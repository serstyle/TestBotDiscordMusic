import { Client, VoiceChannel, Message, Permissions } from "discord.js";
import * as config from "./config.json";
import * as ytdl from "ytdl-core";

const client = new Client();

const permissions = new Permissions(3155968);

enum MessageCommand {
  PLAY = "!play",
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageDelete", (message) => {
  message.reply(
    `vient juste de supprimer le message suivant : "${message.content}"`
  );
});

const voiceChannel = (message: Message) => {
  if (message.channel.type !== "text") return;
  const voiceChannel = message.member.voice.channel;

  return voiceChannel;
};

const deleteMessage = async (message: Message) => {
  //   await message.channel.delete();
};

const playMusic = (vc: VoiceChannel, message: Message) => {
  vc.join().then((connection) => {
    var server = servers[message.guild.id];
    if (!server || !server.queue[0])
      message.reply("ajoute de la music avant de skip petit fou");
    message.channel.send(
      "C cette music qui se joue mtn lol: " + server.queue[0]
    );

    const stream = ytdl(server.queue[0], {
      filter: "audioonly",
    });
    server.dispatcher = connection.play(stream);
    server.dispatcher.setVolume(0.5);
    server.dispatcher.on("finish", () => {
      server.queue.shift();
      playMusic(vc, message);
    });
  });
};

var servers: {} = {};

client.on("message", async (message) => {
  const args = message.content.split(" ");

  if (message.channel.type !== "text") return;

  let server;
  switch (args[0]) {
    //play the music or add to the playlist
    case MessageCommand.PLAY:
      if (message.channel.id !== "718245594342096970") {
        deleteMessage(message);
        return message.reply("Va dans le channel music pour ajouter ta music");
      }
      const url = args[1];
      if (!servers[message.guild.id]) servers[message.guild.id] = { queue: [] };

      server = servers[message.guild.id];
      server.queue.push(url);

      if (!voiceChannel(message)) {
        return message.reply("please join a voice channel first!");
      }
      if (server.queue.length === 1) {
        playMusic(voiceChannel(message), message);
      } else {
        message.channel.send(
          "La musique a ete ajoute a la queue patiente un peu :) "
        );
      }

      break;

    //stop the music and kick the bot

    case "!stop":
      if (message.channel.id !== "718245594342096970") {
        deleteMessage(message);
        return message.reply("Va dans le channel music pour stop la music");
      }
      if (!voiceChannel(message)) {
        return message.reply("please join a voice channel first!");
      }
      server.queue.splice(0, server.queue.length);
      voiceChannel(message).leave();
      break;

    //skip the music

    case "!skip":
      if (message.channel.id !== "718245594342096970") {
        deleteMessage(message);
        return message.reply("Va dans le channel music pour skip");
      }
      server = servers[message.guild.id];
      if (server && server.dispatcher) server?.queue?.shift();
      playMusic(voiceChannel(message), message);
      break;

    //playlist show the playlist

    case "!playlist":
      server = servers[message.guild.id];
      if (!server || !server.queue || server.queue.length === 0)
        return message.reply("pas de music");
      message.reply(
        "La playlist actuel est compose de : " + server.queue.join(" | ")
      );

      break;
  }

  //   if (message.content.startsWith(Message.PLAY)) {
  //     if (message.channel.type !== "text") return;
  //     const url = messageContent.slice(Message.PLAY.length);

  //     const voiceChannel = message.member.voice.channel;
  //     if (!voiceChannel) {
  //       return message.reply("please join a voice channel first!");
  //     }
  //     musicArray.push(url);

  //     if (musicArray.length === 1) {
  //       playMusic(voiceChannel, server);
  //     }
  //   }
  //   // stop
  //   if (message.content === "!stop") {
  //     if (message.channel.type !== "text") return;
  //     const voiceChannel = message.member.voice.channel;
  //     musicArray.splice(0, musicArray.length);
  //     voiceChannel.leave();
  //   }
  //   // skip
  //   if (message.content === "!skip") {
  //     server.dispatcher.on("finish", () =>
  //       nextSong(message.member.voice.channel, server)
  //     );
  //   }
});

client.login(config.token);
