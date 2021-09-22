import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  entersState,
  VoiceConnection,
  VoiceConnectionDisconnectReason,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Track } from "./track";
import { wait } from "../../utils";
import { CommandInteraction, Interaction } from "discord.js";
import search from "youtube-search";

/**
 * A MusicSubscription exists for each active VoiceConnection. Each subscription has its own audio player and queue,
 * and it also attaches logic to the audio player and voice connection for error handling and reconnection logic.
 */
// TODO
export enum musicCommands {}

export async function createTrack(interaction: CommandInteraction) {
  // Extract the video URL from the command
  const searchText = interaction.options.get("song")!.value! as string;
  const searchResults = await search(searchText, {
    maxResults: 10,
    key: process.env.GOOGLE_API_KEY,
    type: "video",
  });
  const url = searchResults.results[0].link;

  try {
    // Attempt to create a Track from the user's video URL
    const track = await Track.from(url, {
      onStart() {
        interaction
          .followUp({ content: "Now playing!", ephemeral: true })
          .catch(console.warn);
      },
      onFinish() {},
      onError(error) {
        console.warn(error);
        interaction
          .followUp({ content: `Error: ${error.message}`, ephemeral: true })
          .catch(console.warn);
      },
    });
    // Enqueue the track and reply a success message to the user
    await interaction.followUp(`Enqueued **${track.title}**`);
    return track;
  } catch (error) {
    console.warn(error);
    try {
      await interaction.followUp(
        "Failed to play track, please try again later!"
      );
    } catch {
      console.log("Failed");
    }
  }
}

export class MusicSubscription {
  public readonly voiceConnection: VoiceConnection;
  public readonly audioPlayer: AudioPlayer;
  public queue: Track[];
  public queueLock = false;
  public readyLock = false;

  public constructor(voiceConnection: VoiceConnection) {
    this.voiceConnection = voiceConnection;
    this.audioPlayer = createAudioPlayer();
    this.queue = [];

    this.voiceConnection.on("stateChange", async (_, newState) => {
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        if (
          newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
          newState.closeCode === 4014
        ) {
          /*
						If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
						but there is a chance the connection will recover itself if the reason of the disconnect was due to
						switching voice channels. This is also the same code for the bot being kicked from the voice channel,
						so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
						the voice connection.
					*/
          try {
            await entersState(
              this.voiceConnection,
              VoiceConnectionStatus.Connecting,
              5_000
            );
            // Probably moved voice channel
          } catch {
            this.voiceConnection.destroy();
            // Probably removed from voice channel
          }
        } else if (this.voiceConnection.rejoinAttempts < 5) {
          /*
						The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
					*/
          await wait((this.voiceConnection.rejoinAttempts + 1) * 5_000);
          this.voiceConnection.rejoin();
        } else {
          /*
						The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
					*/
          this.voiceConnection.destroy();
        }
      } else if (newState.status === VoiceConnectionStatus.Destroyed) {
        /*
					Once destroyed, stop the subscription
				*/
        this.stop();
      } else if (
        !this.readyLock &&
        (newState.status === VoiceConnectionStatus.Connecting ||
          newState.status === VoiceConnectionStatus.Signalling)
      ) {
        /*
					In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
					before destroying the voice connection. This stops the voice connection permanently existing in one of these
					states.
				*/
        this.readyLock = true;
        try {
          await entersState(
            this.voiceConnection,
            VoiceConnectionStatus.Ready,
            20_000
          );
        } catch {
          if (
            this.voiceConnection.state.status !==
            VoiceConnectionStatus.Destroyed
          )
            this.voiceConnection.destroy();
        } finally {
          this.readyLock = false;
        }
      }
    });

    // Configure audio player
    this.audioPlayer.on("stateChange", (oldState, newState) => {
      if (
        newState.status === AudioPlayerStatus.Idle &&
        oldState.status !== AudioPlayerStatus.Idle
      ) {
        // If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
        // The queue is then processed to start playing the next track, if one is available.
        (oldState.resource as AudioResource<Track>).metadata.onFinish();
        void this.processQueue();
      } else if (newState.status === AudioPlayerStatus.Playing) {
        // If the Playing state has been entered, then a new track has started playback.
        (newState.resource as AudioResource<Track>).metadata.onStart();
      }
    });

    this.audioPlayer.on("error", (error) =>
      (error.resource as AudioResource<Track>).metadata.onError(error)
    );
    voiceConnection.subscribe(this.audioPlayer);
  }

  /**
   *
   */
  public async destroy(interaction: CommandInteraction) {
    this.voiceConnection.destroy();
    await interaction.reply({ content: `Left channel!`, ephemeral: true });
  }

  /**
   * Adds a new Track to the queue.
   *
   * @param track The track to add to the queue
   */
  public enqueue(track: Track) {
    this.queue.push(track);
    void this.processQueue();
  }

  /**
   * Stops audio playback and empties the queue
   */
  public stop() {
    this.queueLock = true;
    this.queue = [];
    this.audioPlayer.stop(true);
  }

  /**
   * Attempts to play a Track from the queue
   */
  private async processQueue(): Promise<void> {
    // If the queue is locked (already being processed), is empty, or the audio player is already playing something, return
    if (
      this.queueLock ||
      this.audioPlayer.state.status !== AudioPlayerStatus.Idle ||
      this.queue.length === 0
    ) {
      return;
    }
    // Lock the queue to guarantee safe access
    this.queueLock = true;

    // Take the first item from the queue. This is guaranteed to exist due to the non-empty check above.
    const nextTrack = this.queue.shift()!;
    try {
      // Attempt to convert the Track into an AudioResource (i.e. start streaming the video)
      const resource = await nextTrack.createAudioResource();
      this.audioPlayer.play(resource);
      this.queueLock = false;
    } catch (error) {
      // If an error occurred, try the next item of the queue instead
      nextTrack.onError(error as Error);
      this.queueLock = false;
      return this.processQueue();
    }
  }

  public async resolveInteraction(
    interaction: CommandInteraction
  ): Promise<boolean> {
    if (interaction.commandName === "play") {
      await interaction.deferReply();

      // Make sure the connection is ready before processing the user's request
      try {
        await entersState(
          this.voiceConnection,
          VoiceConnectionStatus.Ready,
          20e3
        );
      } catch (error) {
        console.warn(error);
        await interaction.followUp(
          "Failed to join voice channel within 20 seconds, please try again later!"
        );
        return;
      }

      const track = await createTrack(interaction);
      this.enqueue(track);
    } else if (interaction.commandName === "skip") {
      // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
      // listener defined in music/this.ts, transitions into the Idle state mean the next track from the queue
      // will be loaded and played.
      this.audioPlayer.stop();
      await interaction.reply("Skipped song!");
    } else if (interaction.commandName === "queue") {
      // Print out the current queue, including up to the next 5 tracks to be played.
      const current =
        this.audioPlayer.state.status === AudioPlayerStatus.Idle
          ? `Nothing is currently playing!`
          : `Playing **${
              (this.audioPlayer.state.resource as AudioResource<Track>).metadata
                .title
            }**`;

      const queue = this.queue
        .slice(0, 5)
        .map((track, index) => `${index + 1}) ${track.title}`)
        .join("\n");

      await interaction.reply(`${current}\n\n${queue}`);
    } else if (interaction.commandName === "pause") {
      this.audioPlayer.pause();
      await interaction.reply({ content: `Paused!`, ephemeral: true });
    } else if (interaction.commandName === "resume") {
      this.audioPlayer.unpause();
      await interaction.reply({ content: `Unpaused!`, ephemeral: true });
    } else {
      return false;
    }
    return true;
  }
}
