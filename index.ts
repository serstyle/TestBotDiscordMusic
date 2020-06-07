import { Client, Message } from "discord.js";
import * as config from "./config.json";
import { isQueueEmpty, check } from "./helpers/conditions";

import {
  playMusic,
  voiceChannel,
  GuildDiscord,
  MessageCommand,
  getYoutubeUrl,
} from "./helpers/units";

const client = new Client();

client.once("ready", () => {
  console.log("Ready!");
});

const servers: {} = {};



client.on("message", async (message) => {
  const args = message.content.split(" ");

  if (message.channel.type !== "text") return;
  console.log("args : ", args);
  let server: GuildDiscord;
  let checkError: Message;
  switch (args[0]) {
    //play the music or add to the playlist
    case MessageCommand.PLAY:
      //arrange the args to be one keywords string
      const arrKeywords = args.slice(1);
      const keywords = arrKeywords.join(" ");

      checkError = await check(message);
      if (checkError) return checkError;

      const youtubeItem = await getYoutubeUrl(keywords);

<<<<<<< HEAD
      if (youtubeItem.url === "no link")
        return message.reply("sorry j'ai pas trouve ce que tu veux frr");
=======
      if (youtubeItem.url === "no link") {
        console.log("no link");
        return message.reply("sorry j'ai pas trouve ce que tu veux frr");
      }
>>>>>>> branch2

      if (!servers[message.guild.id])
        servers[message.guild.id] = { queue: [] } as {
          queue: { url: string; title: string }[];
        };

      server = servers[message.guild.id];
      server.queue.push(youtubeItem);

      if (server.queue.length === 1) {
        playMusic(voiceChannel(message), message, server);
      } else {
        message.channel.send(
          `La musique "${youtubeItem.title}" a ete ajoute a la queue patiente un peu `
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
      const titles = server.queue.map((item) => item.title);
      message.reply(
        `La playlist actuel est compose de : ${titles.join(", ")}` 
      );

      break;
  }
});

client.login(config.token);
