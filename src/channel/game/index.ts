import { CommandInteraction } from "discord.js";
import { choose } from "../../utils";

interface Stats {
  cheat: boolean;
}

const winResponse = {
  rock: "paper",
  paper: "scissors",
  scissors: "rock",
};

const rpsOptions = ["rock", "paper", "scissors"];
const coinOptions = ["tail", "head"];

export class Game {
  private playerStatsMap: Map<String, Stats>;

  public constructor() {
    this.playerStatsMap = new Map<String, Stats>();
  }

  public async resolveInteraction(
    interaction: CommandInteraction
  ): Promise<boolean> {
    if (!this.playerStatsMap.get(interaction.user.id)) {
      this.playerStatsMap.set(interaction.user.id, {
        cheat: false,
      });
    }

    const name = interaction.commandName;
    const playerStats = this.playerStatsMap.get(interaction.user.id);

    let resolved = true;
    if (rpsOptions.includes(name)) {
      // Cheat or not
      const response = playerStats.cheat
        ? winResponse[name]
        : choose(rpsOptions);

      //  Misc
      let result = "";
      if (response === name) {
        result = "drew";
      } else if (response === winResponse[name]) {
        result = "won";
      } else {
        result = "lost";
      }

      await interaction.reply(`${response}. You ${result}`);
    } else if (name === "coin-flip") {
      interaction.reply(choose(coinOptions));
    } else if (name === "cheat") {
      const on =
        (interaction.options.get("on")?.value as boolean) || !playerStats.cheat;
      playerStats.cheat = on;
      interaction.reply(`Cheat ${on ? "on" : "off"}`);
    } else {
      resolved = false;
    }

    return resolved;
  }
}
