import { Client, Message } from "discord.js";
import { isQueueEmpty, check, isLastMusic } from "./helpers/conditions";
import * as dotenv from 'dotenv';
dotenv.config();
import {
  voiceChannel,
  MessageCommand,
  getYoutubeUrl,
  getYoutubePlaylist,
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
    case process.env.BOT_PREFIX + MessageCommand.PLAY:

      //arrange the args to be one keywords string
      const keywords = args.slice(1).join(" ");

      checkError = await check(message);
      if (checkError) return checkError;

      const youtubeItem = await getYoutubeUrl(keywords);

      if (youtubeItem.url === "no link") {
        return message.reply("dsl j'ai pas trouve ce que tu veux frr 😬😬");
      }

      server.addMusicToQueue(youtubeItem);

      if (isLastMusic(server.Queue)) {
        server.playMusic(voiceChannel(message), message);
      } else {
        message.channel.send(
          `La musique "${youtubeItem.title}" a ete ajoute a la queue patiente un peu 🎉💤`
        );
      }

      break;


    case process.env.BOT_PREFIX + MessageCommand.PLAY_PLAYLIST:

      //arrange the args to be one keywords string
      const playlist = args.slice(1).join(" ");

      checkError = await check(message);
      if (checkError) return checkError;

      const youtubeListItems = await getYoutubePlaylist(playlist);

      if (youtubeListItems.length === 0) {
        return message.reply("dsl j'ai pas trouve ce que tu veux frr 😬😬");
      }

      const queueBeforePlayListAdded = [...server.Queue];

      youtubeListItems.map(youtubeItem => server.addMusicToQueue({url: `https://www.youtube.com/watch?v=${youtubeItem.snippet.resourceId.videoId}`, title:youtubeItem.snippet.title}))

      console.log(queueBeforePlayListAdded)
      if (queueBeforePlayListAdded.length === 0) {
        server.playMusic(voiceChannel(message), message);
      } else {
        message.channel.send(
          `La playlist a ete ajoute a la queue patiente un peu 🎉💤`
        );
      }

      break;

    //stop the music and kick the bot

    case process.env.BOT_PREFIX + MessageCommand.STOP:
      checkError = await check(message);
      if (checkError) return checkError;

      if (server) server.deleteQueue();

      voiceChannel(message).leave();
      break;

    //skip the music

    case process.env.BOT_PREFIX + MessageCommand.SKIP:
      checkError = await check(message);
      if (checkError) return checkError;

      if (isQueueEmpty(server.Queue))
        return message.reply("ajoute de la music avant de skip grand fou 🤪🤪");

      server.removeFromQueue();

      server.playMusic(voiceChannel(message), message);

      break;
    
      case process.env.BOT_PREFIX + MessageCommand.GO_TO:
        checkError = await check(message);
        if (checkError) return checkError;
  
        if (isQueueEmpty(server.Queue))
          return message.reply("ajoute de la music avant de bouger grand fou 🤪🤪");
        
        const goToItem = parseInt(args.slice(1).join(" "));
        if(goToItem > server.Queue.length)
          return message.reply('Essaie pas de me casser')
        for(let i = 0; i < goToItem - 1; i++){
          server.removeFromQueue();
        }
  
        server.playMusic(voiceChannel(message), message);
  
        break;
  
    //playlist show the playlist

    case process.env.BOT_PREFIX + MessageCommand.PLAYLIST:
      checkError = await check(message);
      if (checkError) return checkError;

      if (isQueueEmpty(server.Queue)) return message.reply("pas de music 😬😬");

      const titles = server.Queue.map((item, i) => `[${i + 1}] ${item.title}`);

      message.reply(`🎶🎶 La playlist actuel est compose de : ${titles.join(" | | ")}`);

      break;
  }
});
// console.log(process.env.token)
client.login(process.env.token);
