import { Client } from "discord.js";
import * as config from "./config.json";
import {
  isQueueEmpty,
  isWrongChannel,
  isUserInAVoiceChanel,
} from "./helpers/conditions";
import {
  playMusic,
  voiceChannel,
  GuildDiscord,
  MessageCommand,
} from "./helpers/units";

const client = new Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageDelete", (message) => {
  message.reply(
    `vient juste de supprimer le message suivant : "${message.content}"`
  );
});

const servers: {} = {};

client.on("message", async (message) => {
  const args = message.content.split(" ");

  if (message.channel.type !== "text") return;

  let server: GuildDiscord;

  switch (args[0]) {
    //play the music or add to the playlist
    case MessageCommand.PLAY:
      isWrongChannel(message);
      const url = args[1];
      if (!servers[message.guild.id])
        servers[message.guild.id] = { queue: [] } as { queue: string[] };

      server = servers[message.guild.id];
      server.queue.push(url);

      isUserInAVoiceChanel(message);

      if (server.queue.length === 1) {
        playMusic(voiceChannel(message), message, server);
      } else {
        message.channel.send(
          "La musique a ete ajoute a la queue patiente un peu :) "
        );
      }

      break;

    //stop the music and kick the bot

    case MessageCommand.STOP:
      isWrongChannel(message);
      isUserInAVoiceChanel(message);
      server = servers[message.guild.id];
      server.queue = [];
      voiceChannel(message).leave();
      break;

    //skip the music

    case MessageCommand.SKIP:
      isWrongChannel(message);
      isUserInAVoiceChanel(message);

      server = servers[message.guild.id];

      if (server && server.dispatcher) server?.queue?.shift();
      playMusic(voiceChannel(message), message, server);

      break;

    //playlist show the playlist

    case MessageCommand.PLAYLIST:
      isWrongChannel(message);
      isUserInAVoiceChanel(message);

      server = servers[message.guild.id];

      if (isQueueEmpty(server)) return message.reply("pas de music");

      message.reply(
        "La playlist actuel est compose de : " + server.queue.join(" | ")
      );

      break;
  }
});

client.login(config.token);
