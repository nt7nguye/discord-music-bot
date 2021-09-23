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
exports.__esModule = true;
exports.Channel = void 0;
var voice_1 = require("@discordjs/voice");
var discord_js_1 = require("discord.js");
var subscription_1 = require("./music/subscription");
var voice_2 = require("@discordjs/voice");
var game_1 = require("./game");
var utils_1 = require("../utils");
/**
 * A Channel exists for each channel/guild the bot can work for. It contains all other objects to be
 * used in the channel (music subscriptions, games, ...)
 */
var Channel = /** @class */ (function () {
  function Channel(guildId) {
    this.guildId = guildId;
    this.game = new game_1.Game();
  }
  /**
   * Propagates interaction in order. Returns true if its resolved and false otherwise
   */
  Channel.prototype.resolveInteraction = function (interaction) {
    return __awaiter(this, void 0, void 0, function () {
      var greetings, channel, error_1, track, error_2, _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            /**
             * Handle hi
             */
            if (interaction.commandName === "hi") {
              greetings = [
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
              interaction.reply(
                utils_1.choose(greetings) + " " + interaction.user.username
              );
              return [2 /*return*/, true];
            }
            return [4 /*yield*/, this.game.resolveInteraction(interaction)];
          case 1:
            /**
             * Handle rock, paper, scissors
             */
            if (_b.sent()) return [2 /*return*/, true];
            if (!!this.musicSubscription) return [3 /*break*/, 19];
            if (
              !["queue", "pause", "resume", "leave", "skip"].includes(
                interaction.commandName
              )
            )
              return [3 /*break*/, 3];
            return [
              4 /*yield*/,
              interaction.reply("Not playing in this server!"),
            ];
          case 2:
            _b.sent();
            return [2 /*return*/, true];
          case 3:
            if (!(interaction.commandName === "play")) return [3 /*break*/, 18];
            // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
            // and create a this.musicSubscription.
            interaction.deferReply();
            if (
              interaction.member instanceof discord_js_1.GuildMember &&
              interaction.member.voice.channel
            ) {
              channel = interaction.member.voice.channel;
              this.musicSubscription = new subscription_1.MusicSubscription(
                voice_1.joinVoiceChannel({
                  channelId: channel.id,
                  guildId: channel.guild.id,
                  adapterCreator: channel.guild.voiceAdapterCreator,
                })
              );
              this.musicSubscription.voiceConnection.on("error", console.warn);
            }
            if (!!this.musicSubscription) return [3 /*break*/, 5];
            return [
              4 /*yield*/,
              interaction.reply(
                "Join a voice channel and then try that again!"
              ),
            ];
          case 4:
            _b.sent();
            return [2 /*return*/, true];
          case 5:
            _b.trys.push([5, 7, , 9]);
            return [
              4 /*yield*/,
              voice_2.entersState(
                this.musicSubscription.voiceConnection,
                voice_2.VoiceConnectionStatus.Ready,
                20e3
              ),
            ];
          case 6:
            _b.sent();
            return [3 /*break*/, 9];
          case 7:
            error_1 = _b.sent();
            console.warn(error_1);
            return [
              4 /*yield*/,
              interaction.followUp(
                "Failed to join voice channel within 20 seconds, please try again later!"
              ),
            ];
          case 8:
            _b.sent();
            return [2 /*return*/];
          case 9:
            _b.trys.push([9, 13, , 18]);
            return [4 /*yield*/, subscription_1.createTrack(interaction)];
          case 10:
            track = _b.sent();
            return [4 /*yield*/, this.musicSubscription.enqueue(track)];
          case 11:
            _b.sent();
            return [
              4 /*yield*/,
              interaction.followUp("Enqueued **" + track.title + "**"),
            ];
          case 12:
            _b.sent();
            return [2 /*return*/, true];
          case 13:
            error_2 = _b.sent();
            console.warn(error_2);
            _b.label = 14;
          case 14:
            _b.trys.push([14, 16, , 17]);
            return [
              4 /*yield*/,
              interaction.reply(
                "Failed to play track, please try again later!"
              ),
            ];
          case 15:
            _b.sent();
            return [3 /*break*/, 17];
          case 16:
            _a = _b.sent();
            console.log("Failed");
            return [3 /*break*/, 17];
          case 17:
            return [3 /*break*/, 18];
          case 18:
            return [3 /*break*/, 23];
          case 19:
            if (!(interaction.commandName === "leave"))
              return [3 /*break*/, 21];
            return [4 /*yield*/, this.musicSubscription.destroy(interaction)];
          case 20:
            _b.sent();
            delete this.musicSubscription;
            return [2 /*return*/, true];
          case 21:
            return [
              4 /*yield*/,
              this.musicSubscription.resolveInteraction(interaction),
            ];
          case 22:
            if (_b.sent()) {
              return [2 /*return*/, true];
            }
            _b.label = 23;
          case 23:
            // await this.game.resolveInteraction(interaction);
            // await this.coinFlips.resolveInteraction(interaction);
            return [2 /*return*/, false];
        }
      });
    });
  };
  return Channel;
})();
exports.Channel = Channel;
