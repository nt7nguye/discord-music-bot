"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var channel_1 = require("./channel");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var client = new discord_js_1.Client({
  intents: ["GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILDS"],
});
client.on("ready", function () {
  return console.log("Ready!");
});
/**
 * Maps guild IDs to Channel object, which handles all
 */
var channels = new Map();
// This contains the setup code for creating slash commands in a guild. The owner of the bot can send "!deploy" to create them.
client.on("messageCreate", function (message) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          if (!message.guild) return [2 /*return*/];
          if (
            !!((_a = client.application) === null || _a === void 0
              ? void 0
              : _a.owner)
          )
            return [3 /*break*/, 2];
          return [
            4 /*yield*/,
            (_b = client.application) === null || _b === void 0
              ? void 0
              : _b.fetch(),
          ];
        case 1:
          _e.sent();
          _e.label = 2;
        case 2:
          if (
            !(
              message.content.toLowerCase() === "!deploy" &&
              message.author.id ===
                ((_d =
                  (_c = client.application) === null || _c === void 0
                    ? void 0
                    : _c.owner) === null || _d === void 0
                  ? void 0
                  : _d.id)
            )
          )
            return [3 /*break*/, 5];
          channels.set(message.guildId, new channel_1.Channel(message.guildId));
          return [
            4 /*yield*/,
            message.guild.commands.set([
              {
                name: "play",
                description: "Plays a song",
                options: [
                  {
                    name: "song",
                    type: "STRING",
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
            ]),
          ];
        case 3:
          _e.sent();
          return [4 /*yield*/, message.reply("Deployed!")];
        case 4:
          _e.sent();
          _e.label = 5;
        case 5:
          return [2 /*return*/];
      }
    });
  });
});
// Handles slash command interactions
client.on("interactionCreate", function (interaction) {
  return __awaiter(void 0, void 0, void 0, function () {
    var channel, resolved, e_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!interaction.isCommand() || !interaction.guildId)
            return [2 /*return*/];
          channel = channels.get(interaction.guildId);
          if (!channel) {
            interaction.reply('Hmm, try deploying the app with "!deploy"');
            return [2 /*return*/];
          }
          _a.label = 1;
        case 1:
          _a.trys.push([1, 5, , 8]);
          return [4 /*yield*/, channel.resolveInteraction(interaction)];
        case 2:
          resolved = _a.sent();
          if (!(!resolved && !interaction.replied)) return [3 /*break*/, 4];
          return [
            4 /*yield*/,
            interaction.reply("Hmm, I can't seem to find that command"),
          ];
        case 3:
          _a.sent();
          return [2 /*return*/];
        case 4:
          return [3 /*break*/, 8];
        case 5:
          e_1 = _a.sent();
          console.log(e_1);
          if (!!interaction.replied) return [3 /*break*/, 7];
          return [
            4 /*yield*/,
            interaction.reply("Ooops. Something defintely went wrong there"),
          ];
        case 6:
          _a.sent();
          return [2 /*return*/];
        case 7:
          return [3 /*break*/, 8];
        case 8:
          return [2 /*return*/];
      }
    });
  });
});
client.on("error", console.warn);
client.login(process.env.TOKEN);
