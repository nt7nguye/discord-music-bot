import { Client, Interaction, Snowflake } from "discord.js";
import dotenv from "dotenv";
import { Channel } from "./channel";
dotenv.config();

const client = new Client({
  intents: ["GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILDS"],
});

client.on("ready", () => console.log("Ready!"));

/**
 * Maps guild IDs to Channel object, which handles all
 */
const channels = new Map<Snowflake, Channel>();

// This contains the setup code for creating slash commands in a guild. The owner of the bot can send "!deploy" to create them.
client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (
    message.content.toLowerCase() === "!deploy" &&
    message.author.id === client.application?.owner?.id
  ) {
    channels.set(message.guildId, new Channel(message.guildId));
    await message.guild.commands.set([
      {
        name: "play",
        description: "Plays a song",
        options: [
          {
            name: "song",
            type: "STRING" as const,
            description: "The URL of the song to play",
            required: true,
          },
        ],
      },
      {
        name: "skip",
        description: "Skip to the next song in the queue",
      },
      {
        name: "queue",
        description: "See the music queue",
      },
      {
        name: "pause",
        description: "Pauses the song that is currently playing",
      },
      {
        name: "resume",
        description: "Resume playback of the current song",
      },
      {
        name: "leave",
        description: "Leave the voice channel",
      },
      {
        name: "hi",
        description: "Say hi",
      },
      {
        name: "rock",
        description: "Play rock paper scissors",
      },
      {
        name: "paper",
        description: "Play rock paper scissors",
      },
      {
        name: "scissors",
        description: "Play rock paper scissors",
      },
      {
        name: "cheat",
        description: "Toggle cheat mode",
        options: [
          {
            name: "on",
            type: "BOOLEAN" as const,
            description: "on or off",
            required: false,
          },
        ],
      },
      {
        name: "coin-flip",
        description: "Flip a coin",
      },
    ]);

    await message.reply("Deployed!");
  }
});

// Handles slash command interactions
client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand() || !interaction.guildId) return;

  const channel = channels.get(interaction.guildId);
  if (!channel) {
    interaction.reply('Hmm, try deploying the app with "!deploy"');
    return;
  }

  try {
    const resolved = await channel.resolveInteraction(interaction);
    if (!resolved && !interaction.replied) {
      await interaction.reply(`Hmm, I can't seem to find that command`);
      return;
    }
  } catch (e) {
    console.log(e);
    if (!interaction.replied) {
      await interaction.reply("Ooops. Something defintely went wrong there");
      return;
    }
  }
});

client.on("error", console.warn);

client.login(process.env.TOKEN);
