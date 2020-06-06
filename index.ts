import { Client, Message } from "discord.js";
import * as config from "./config.json";
import { isQueueEmpty, check } from "./helpers/conditions";
import fetch from "node-fetch";
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

const servers: {} = {};

const getYoutubeUrl = async (keywords: string) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${keywords}&type=video&key=${config.API_KEY_YOUTUBE}`
  );
  const youtubeLinks = await response.json();
  console.log(keywords);
  console.log("json parse: ".toUpperCase(), youtubeLinks);
  const firstYoutubeLink =
    youtubeLinks && youtubeLinks.items.length > 0
      ? `https://www.youtube.com/watch?v=${youtubeLinks.items[0].id.videoId}`
      : "no link";
  return firstYoutubeLink;
};

client.on("message", async (message) => {
  const args = message.content.split(" ");

  if (message.channel.type !== "text") return;
  console.log("args : ", args);
  let server: GuildDiscord;
  let checkError: Message;
  switch (args[0]) {
    //play the music or add to the playlist
    case MessageCommand.PLAY:
      const arrKeywords = args.slice(1);
      const keywords = arrKeywords.join(" ");
      checkError = await check(message);
      if (checkError) return checkError;
      const url = await getYoutubeUrl(keywords);
      if (url === "no link")
        return message.reply("sorry j ai pas trouve ce que tu veux frr");
      if (!servers[message.guild.id])
        servers[message.guild.id] = { queue: [] } as { queue: {url: string, title: string}[] };

      server = servers[message.guild.id];
      server.queue.push(url);

      if (server.queue.length === 1) {
        playMusic(voiceChannel(message), message, server);
      } else {
        message.channel.send(
          "La musique a ete ajoute a la queue patiente un peu "
        );
      }

      break;

    //stop the music and kick the bot

    case MessageCommand.STOP:
      checkError = await check(message);
      if (checkError) return checkError;
      server = servers[message.guild.id];
      if (server) server.queue = [];
      voiceChannel(message).leave();
      break;

    //skip the music

    case MessageCommand.SKIP:
      checkError = await check(message);
      if (checkError) return checkError;

      server = servers[message.guild.id];
      if (server && server.dispatcher) server?.queue?.shift();
      playMusic(voiceChannel(message), message, server);

      break;

    //playlist show the playlist

    case MessageCommand.PLAYLIST:
      checkError = await check(message);
      if (checkError) return checkError;

      server = servers[message.guild.id];

      if (isQueueEmpty(server)) return message.reply("pas de music");

      message.reply(
        "La playlist actuel est compose de : " + server.queue.join(" | ")
      );

      break;
  }
});

client.login(config.token);
