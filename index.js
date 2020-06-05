"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var config = require("./config.json");
var ytdl = require("ytdl-core");
var client = new discord_js_1.Client();
var permissions = new discord_js_1.Permissions(3155968);
var MessageCommand;
(function (MessageCommand) {
    MessageCommand["PLAY"] = "!play";
})(MessageCommand || (MessageCommand = {}));
client.once("ready", function () {
    console.log("Ready!");
});
client.on("messageDelete", function (message) {
    message.reply("vient juste de supprimer le message suivant : \"" + message.content + "\"");
});
var voiceChannel = function (message) {
    if (message.channel.type !== "text")
        return;
    var voiceChannel = message.member.voice.channel;
    return voiceChannel;
};
var deleteMessage = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
var servers = {};
client.on("message", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var args, messageContent, playMusic, url, server, server, server;
    var _a;
    return __generator(this, function (_b) {
        args = message.content.split(" ");
        messageContent = message.content;
        playMusic = function (vc) {
            vc.join().then(function (connection) {
                var server = servers[message.guild.id];
                if (!server || !server.queue[0])
                    message.reply("ajoute de la music avant de skip petit fou");
                message.channel.send("C cette music qui se joue mtn lol: " + server.queue[0]);
                var stream = ytdl(server.queue[0], {
                    filter: "audioonly"
                });
                server.dispatcher = connection.play(stream);
                server.dispatcher.setVolume(0.5);
                server.dispatcher.on("finish", function () {
                    server.queue.shift();
                    playMusic(vc);
                });
            });
        };
        switch (args[0]) {
            case MessageCommand.PLAY:
                if (message.channel.id !== "718245594342096970") {
                    deleteMessage(message);
                    return [2 /*return*/, message.reply("Va dans le channel music pour ajouter ta music")];
                }
                if (message.channel.type !== "text")
                    return [2 /*return*/];
                url = args[1];
                if (!servers[message.guild.id])
                    servers[message.guild.id] = { queue: [] };
                server = servers[message.guild.id];
                server.queue.push(url);
                if (!voiceChannel(message)) {
                    return [2 /*return*/, message.reply("please join a voice channel first!")];
                }
                if (server.queue.length === 1) {
                    playMusic(voiceChannel(message));
                }
                else {
                    message.channel.send("La musique a ete ajoute a la queue patiente un peu :) ");
                }
                break;
            case "!stop":
                if (message.channel.id !== "718245594342096970") {
                    deleteMessage(message);
                    return [2 /*return*/, message.reply("Va dans le channel music pour stop la music")];
                }
                if (message.channel.type !== "text")
                    return [2 /*return*/];
                if (!voiceChannel(message)) {
                    return [2 /*return*/, message.reply("please join a voice channel first!")];
                }
                server.queue.splice(0, server.queue.length);
                voiceChannel(message).leave();
                break;
            case "!skip":
                if (message.channel.id !== "718245594342096970") {
                    deleteMessage(message);
                    return [2 /*return*/, message.reply("Va dans le channel music pour skip")];
                }
                server = servers[message.guild.id];
                if (server && server.dispatcher)
                    (_a = server === null || server === void 0 ? void 0 : server.queue) === null || _a === void 0 ? void 0 : _a.shift();
                playMusic(voiceChannel(message));
                break;
            case "!playlist":
                server = servers[message.guild.id];
                if (!server || !server.queue || server.queue.length === 0)
                    return [2 /*return*/, message.reply("pas de music")];
                message.reply("La playlist actuel est compose de : " + server.queue.join(" | "));
                break;
        }
        return [2 /*return*/];
    });
}); });
client.login(config.token);
