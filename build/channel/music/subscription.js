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
exports.MusicSubscription =
  exports.createTrack =
  exports.musicCommands =
    void 0;
var voice_1 = require("@discordjs/voice");
var track_1 = require("./track");
var utils_1 = require("../../utils");
var youtube_search_1 = __importDefault(require("youtube-search"));
/**
 * A MusicSubscription exists for each active VoiceConnection. Each subscription has its own audio player and queue,
 * and it also attaches logic to the audio player and voice connection for error handling and reconnection logic.
 */
// TODO
var musicCommands;
(function (musicCommands) {})(
  (musicCommands = exports.musicCommands || (exports.musicCommands = {}))
);
function createTrack(interaction) {
  return __awaiter(this, void 0, void 0, function () {
    var searchText, searchResults, url, track, error_1, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          searchText = interaction.options.get("song").value;
          return [
            4 /*yield*/,
            youtube_search_1["default"](searchText, {
              maxResults: 10,
              key: process.env.GOOGLE_API_KEY,
              type: "video",
            }),
          ];
        case 1:
          searchResults = _b.sent();
          url = searchResults.results[0].link;
          _b.label = 2;
        case 2:
          _b.trys.push([2, 5, , 10]);
          return [
            4 /*yield*/,
            track_1.Track.from(url, {
              onStart: function () {
                interaction
                  .followUp({ content: "Now playing!", ephemeral: true })
                  ["catch"](console.warn);
              },
              onFinish: function () {},
              onError: function (error) {
                console.warn(error);
                interaction
                  .followUp({
                    content: "Error: " + error.message,
                    ephemeral: true,
                  })
                  ["catch"](console.warn);
              },
            }),
          ];
        case 3:
          track = _b.sent();
          // Enqueue the track and reply a success message to the user
          return [
            4 /*yield*/,
            interaction.followUp("Enqueued **" + track.title + "**"),
          ];
        case 4:
          // Enqueue the track and reply a success message to the user
          _b.sent();
          return [2 /*return*/, track];
        case 5:
          error_1 = _b.sent();
          console.warn(error_1);
          _b.label = 6;
        case 6:
          _b.trys.push([6, 8, , 9]);
          return [
            4 /*yield*/,
            interaction.followUp(
              "Failed to play track, please try again later!"
            ),
          ];
        case 7:
          _b.sent();
          return [3 /*break*/, 9];
        case 8:
          _a = _b.sent();
          console.log("Failed");
          return [3 /*break*/, 9];
        case 9:
          return [3 /*break*/, 10];
        case 10:
          return [2 /*return*/];
      }
    });
  });
}
exports.createTrack = createTrack;
var MusicSubscription = /** @class */ (function () {
  function MusicSubscription(voiceConnection) {
    var _this = this;
    this.queueLock = false;
    this.readyLock = false;
    this.voiceConnection = voiceConnection;
    this.audioPlayer = voice_1.createAudioPlayer();
    this.queue = [];
    this.voiceConnection.on("stateChange", function (_, newState) {
      return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              if (
                !(
                  newState.status === voice_1.VoiceConnectionStatus.Disconnected
                )
              )
                return [3 /*break*/, 9];
              if (
                !(
                  newState.reason ===
                    voice_1.VoiceConnectionDisconnectReason.WebSocketClose &&
                  newState.closeCode === 4014
                )
              )
                return [3 /*break*/, 5];
              _c.label = 1;
            case 1:
              _c.trys.push([1, 3, , 4]);
              return [
                4 /*yield*/,
                voice_1.entersState(
                  this.voiceConnection,
                  voice_1.VoiceConnectionStatus.Connecting,
                  5000
                ),
              ];
            case 2:
              _c.sent();
              return [3 /*break*/, 4];
            case 3:
              _a = _c.sent();
              this.voiceConnection.destroy();
              return [3 /*break*/, 4];
            case 4:
              return [3 /*break*/, 8];
            case 5:
              if (!(this.voiceConnection.rejoinAttempts < 5))
                return [3 /*break*/, 7];
              /*
                            The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
                        */
              return [
                4 /*yield*/,
                utils_1.wait((this.voiceConnection.rejoinAttempts + 1) * 5000),
              ];
            case 6:
              /*
                            The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
                        */
              _c.sent();
              this.voiceConnection.rejoin();
              return [3 /*break*/, 8];
            case 7:
              /*
                            The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
                        */
              this.voiceConnection.destroy();
              _c.label = 8;
            case 8:
              return [3 /*break*/, 15];
            case 9:
              if (
                !(newState.status === voice_1.VoiceConnectionStatus.Destroyed)
              )
                return [3 /*break*/, 10];
              /*
                            Once destroyed, stop the subscription
                        */
              this.stop();
              return [3 /*break*/, 15];
            case 10:
              if (
                !(
                  !this.readyLock &&
                  (newState.status ===
                    voice_1.VoiceConnectionStatus.Connecting ||
                    newState.status ===
                      voice_1.VoiceConnectionStatus.Signalling)
                )
              )
                return [3 /*break*/, 15];
              /*
                            In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
                            before destroying the voice connection. This stops the voice connection permanently existing in one of these
                            states.
                        */
              this.readyLock = true;
              _c.label = 11;
            case 11:
              _c.trys.push([11, 13, 14, 15]);
              return [
                4 /*yield*/,
                voice_1.entersState(
                  this.voiceConnection,
                  voice_1.VoiceConnectionStatus.Ready,
                  20000
                ),
              ];
            case 12:
              _c.sent();
              return [3 /*break*/, 15];
            case 13:
              _b = _c.sent();
              if (
                this.voiceConnection.state.status !==
                voice_1.VoiceConnectionStatus.Destroyed
              )
                this.voiceConnection.destroy();
              return [3 /*break*/, 15];
            case 14:
              this.readyLock = false;
              return [7 /*endfinally*/];
            case 15:
              return [2 /*return*/];
          }
        });
      });
    });
    // Configure audio player
    this.audioPlayer.on("stateChange", function (oldState, newState) {
      if (
        newState.status === voice_1.AudioPlayerStatus.Idle &&
        oldState.status !== voice_1.AudioPlayerStatus.Idle
      ) {
        // If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
        // The queue is then processed to start playing the next track, if one is available.
        oldState.resource.metadata.onFinish();
        void _this.processQueue();
      } else if (newState.status === voice_1.AudioPlayerStatus.Playing) {
        // If the Playing state has been entered, then a new track has started playback.
        newState.resource.metadata.onStart();
      }
    });
    this.audioPlayer.on("error", function (error) {
      return error.resource.metadata.onError(error);
    });
    voiceConnection.subscribe(this.audioPlayer);
  }
  /**
   *
   */
  MusicSubscription.prototype.destroy = function (interaction) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.voiceConnection.destroy();
            return [
              4 /*yield*/,
              interaction.reply({ content: "Left channel!", ephemeral: true }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Adds a new Track to the queue.
   *
   * @param track The track to add to the queue
   */
  MusicSubscription.prototype.enqueue = function (track) {
    this.queue.push(track);
    void this.processQueue();
  };
  /**
   * Stops audio playback and empties the queue
   */
  MusicSubscription.prototype.stop = function () {
    this.queueLock = true;
    this.queue = [];
    this.audioPlayer.stop(true);
  };
  /**
   * Attempts to play a Track from the queue
   */
  MusicSubscription.prototype.processQueue = function () {
    return __awaiter(this, void 0, void 0, function () {
      var nextTrack, resource, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            // If the queue is locked (already being processed), is empty, or the audio player is already playing something, return
            if (
              this.queueLock ||
              this.audioPlayer.state.status !==
                voice_1.AudioPlayerStatus.Idle ||
              this.queue.length === 0
            ) {
              return [2 /*return*/];
            }
            // Lock the queue to guarantee safe access
            this.queueLock = true;
            nextTrack = this.queue.shift();
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4 /*yield*/, nextTrack.createAudioResource()];
          case 2:
            resource = _a.sent();
            this.audioPlayer.play(resource);
            this.queueLock = false;
            return [3 /*break*/, 4];
          case 3:
            error_2 = _a.sent();
            // If an error occurred, try the next item of the queue instead
            nextTrack.onError(error_2);
            this.queueLock = false;
            return [2 /*return*/, this.processQueue()];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  MusicSubscription.prototype.resolveInteraction = function (interaction) {
    return __awaiter(this, void 0, void 0, function () {
      var error_3, track, current, queue;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(interaction.commandName === "play")) return [3 /*break*/, 8];
            return [4 /*yield*/, interaction.deferReply()];
          case 1:
            _a.sent();
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4, , 6]);
            return [
              4 /*yield*/,
              voice_1.entersState(
                this.voiceConnection,
                voice_1.VoiceConnectionStatus.Ready,
                20e3
              ),
            ];
          case 3:
            _a.sent();
            return [3 /*break*/, 6];
          case 4:
            error_3 = _a.sent();
            console.warn(error_3);
            return [
              4 /*yield*/,
              interaction.followUp(
                "Failed to join voice channel within 20 seconds, please try again later!"
              ),
            ];
          case 5:
            _a.sent();
            return [2 /*return*/];
          case 6:
            return [4 /*yield*/, createTrack(interaction)];
          case 7:
            track = _a.sent();
            this.enqueue(track);
            return [3 /*break*/, 17];
          case 8:
            if (!(interaction.commandName === "skip")) return [3 /*break*/, 10];
            // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
            // listener defined in music/this.ts, transitions into the Idle state mean the next track from the queue
            // will be loaded and played.
            this.audioPlayer.stop();
            return [4 /*yield*/, interaction.reply("Skipped song!")];
          case 9:
            _a.sent();
            return [3 /*break*/, 17];
          case 10:
            if (!(interaction.commandName === "queue"))
              return [3 /*break*/, 12];
            current =
              this.audioPlayer.state.status === voice_1.AudioPlayerStatus.Idle
                ? "Nothing is currently playing!"
                : "Playing **" +
                  this.audioPlayer.state.resource.metadata.title +
                  "**";
            queue = this.queue
              .slice(0, 5)
              .map(function (track, index) {
                return index + 1 + ") " + track.title;
              })
              .join("\n");
            return [4 /*yield*/, interaction.reply(current + "\n\n" + queue)];
          case 11:
            _a.sent();
            return [3 /*break*/, 17];
          case 12:
            if (!(interaction.commandName === "pause"))
              return [3 /*break*/, 14];
            this.audioPlayer.pause();
            return [
              4 /*yield*/,
              interaction.reply({ content: "Paused!", ephemeral: true }),
            ];
          case 13:
            _a.sent();
            return [3 /*break*/, 17];
          case 14:
            if (!(interaction.commandName === "resume"))
              return [3 /*break*/, 16];
            this.audioPlayer.unpause();
            return [
              4 /*yield*/,
              interaction.reply({ content: "Unpaused!", ephemeral: true }),
            ];
          case 15:
            _a.sent();
            return [3 /*break*/, 17];
          case 16:
            return [2 /*return*/, false];
          case 17:
            return [2 /*return*/, true];
        }
      });
    });
  };
  return MusicSubscription;
})();
exports.MusicSubscription = MusicSubscription;
