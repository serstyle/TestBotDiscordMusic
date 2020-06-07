import { VoiceChannel, Message } from "discord.js";
import * as ytdl from "ytdl-core";
import { isQueueEmpty } from "./conditions";
import fetch from "node-fetch";
import * as config from "../config.json";
import { ServerDiscord } from "../Models/Server";

export enum MessageCommand {
  PLAY = "!play",
  STOP = "!stop",
  PLAYLIST = "!playlist",
  SKIP = "!skip",
}

export const voiceChannel = (message: Message) => {
  if (message.channel.type !== "text") return;
  const voiceChannel = message.member.voice.channel;

  return voiceChannel;
};

export const deleteMessage = (message: Message) => {
  try {
    return message.channel.messages.delete(message);
  } catch (e) {
    console.error(e);
  }
};

export const playMusic = (
  vc: VoiceChannel,
  message: Message,
  server: ServerDiscord
) => {
  vc.join().then((connection) => {
    const serverQueue = server.getQueue();

    message.channel.send(
      `C cette music qui se joue mtn lol: "${serverQueue[0].title}" et le lien c est ${serverQueue[0].url}`
    );

    // create a stream from the url with YTDL.
    // uses by the connection.play method.
    const stream = ytdl(serverQueue[0].url, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
      quality: "highestaudio",
    });

    server.createDispatcherToConnectPlay(connection, stream);

    server.dispatcherAction("finish", () => {
      server.removeFromQueue();
      if (isQueueEmpty(serverQueue)) return;
      playMusic(vc, message, server);
    });
  });
};

export const getYoutubeUrl = async (keywords: string) => {
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
  return { url: firstYoutubeLink, title: youtubeLinks.items[0].snippet.title };
};
