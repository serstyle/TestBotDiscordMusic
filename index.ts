import { Client, Message } from "discord.js";
import * as config from "./config.json";
import { isQueueEmpty, check, isLastMusic } from "./helpers/conditions";

import {
  playMusic,
  voiceChannel,
  MessageCommand,
  getYoutubeUrl,
} from "./helpers/units";
import { ServersDiscord } from "./Models/Servers";
import { ServerDiscord } from "./Models/Server";

const client = new Client();

client.once("ready", () => {
  console.log("Ready!");
});

const instanceServers = new ServersDiscord();

client.on("message", async (message) => {
  const args = message.content.split(" ");

  if (message.channel.type !== "text") return;

  if (!instanceServers.getServer(message.guild.id))
    instanceServers.createServer(message.guild.id);

  let server: ServerDiscord = instanceServers.getServer(message.guild.id);

  let checkError: Message;

  switch (args[0]) {
    //play the music or add to the playlist
    case MessageCommand.PLAY:

      //arrange the args to be one keywords string
      const keywords = args.slice(1).join(" ");

      checkError = await check(message);
      if (checkError) return checkError;

      const youtubeItem = await getYoutubeUrl(keywords);

      if (youtubeItem.url === "no link") {
        return message.reply("dsl j'ai pas trouve ce que tu veux frr");
      }

      server.addMusicToQueue(youtubeItem);

      if (isLastMusic(server.getQueue())) {
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

      if (server) server.deleteQueue();

      voiceChannel(message).leave();
      break;

    //skip the music

    case MessageCommand.SKIP:
      checkError = await check(message);
      if (checkError) return checkError;

      if (isQueueEmpty(server.getQueue()))
        return message.reply("ajoute de la music avant de skip petit fou");

      server.removeFromQueue();

      playMusic(voiceChannel(message), message, server);

      break;

    //playlist show the playlist

    case MessageCommand.PLAYLIST:
      checkError = await check(message);
      if (checkError) return checkError;

      if (isQueueEmpty(server.getQueue())) return message.reply("pas de music");

      const titles = server.getQueue().map((item) => item.title);

      message.reply(`La playlist actuel est compose de : ${titles.join(", ")}`);

      break;
  }
});

client.login(config.token);
