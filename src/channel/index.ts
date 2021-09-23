import { joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember } from "discord.js";
import { createTrack, MusicSubscription } from "./music/subscription";
import { entersState, VoiceConnectionStatus } from "@discordjs/voice";
import { Game } from "./game";
import { choose } from "../utils";

/**
 * A Channel exists for each channel/guild the bot can work for. It contains all other objects to be
 * used in the channel (music subscriptions, games, ...)
 */
export class Channel {
  private musicSubscription: MusicSubscription;
  public readonly game: Game;
  // public readonly coinFlips: CoinFlipGame;

  public guildId: string;

  public constructor(guildId: string) {
    this.guildId = guildId;
    this.game = new Game();
  }

  /**
   * Propagates interaction in order. Returns true if its resolved and false otherwise
   */
  public async resolveInteraction(
    interaction: CommandInteraction
  ): Promise<boolean> {
    /**
     * Handle hi
     */
    if (interaction.commandName === "hi") {
      const greetings = [
        "greetings",
        "howdy",
        "welcome",
        "bonjour",
        "good day",
        "hey",
        "hi-ya",
        "how goes it",
        "howdy-do",
        "shalom",
        "sup",
      ];
      interaction.reply(`${choose(greetings)} ${interaction.user.username}`);
      return true;
    }

    /**
     * Handle rock, paper, scissors
     */
    if (await this.game.resolveInteraction(interaction)) return true;

    /**
     * Handle with music subscription
     */
    if (!this.musicSubscription) {
      // Handle when there is no music subscription
      if (
        ["queue", "pause", "resume", "leave", "skip"].includes(
          interaction.commandName
        )
      ) {
        await interaction.reply("Not playing in this server!");
        return true;
      } else if (interaction.commandName === "play") {
        // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
        // and create a this.musicSubscription.
        interaction.deferReply();
        if (
          interaction.member instanceof GuildMember &&
          interaction.member.voice.channel
        ) {
          const channel = interaction.member.voice.channel;
          this.musicSubscription = new MusicSubscription(
            joinVoiceChannel({
              channelId: channel.id,
              guildId: channel.guild.id,
              adapterCreator: channel.guild.voiceAdapterCreator,
            })
          );
          this.musicSubscription.voiceConnection.on("error", console.warn);
        }

        // If there's still no music subscription, ask to join channel
        if (!this.musicSubscription) {
          await interaction.reply(
            "Join a voice channel and then try that again!"
          );
          return true;
        }

        try {
          await entersState(
            this.musicSubscription.voiceConnection,
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

        try {
          const track = await createTrack(interaction);
          await this.musicSubscription.enqueue(track);
          await interaction.followUp(`Enqueued **${track.title}**`);
          return true;
        } catch (error) {
          console.warn(error);
          try {
            await interaction.reply(
              "Failed to play track, please try again later!"
            );
          } catch {
            console.log("Failed");
          }
        }
      }
    } else {
      // Music subscription exist
      if (interaction.commandName === "leave") {
        await this.musicSubscription.destroy(interaction);
        delete this.musicSubscription;
        return true;
      } else {
        if (await this.musicSubscription.resolveInteraction(interaction)) {
          return true;
        }
      }
    }

    // await this.game.resolveInteraction(interaction);
    // await this.coinFlips.resolveInteraction(interaction);
    return false;
  }
}
