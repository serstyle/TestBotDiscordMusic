import { VoiceChannel, Message, StreamDispatcher } from "discord.js";
import * as ytdl from "ytdl-core";
import { isQueueEmpty } from "./conditions";
import fetch from "node-fetch";
export interface GuildDiscord {
  queue: { url: string; title: string }[];
  dispatcher?: StreamDispatcher;
}
import * as config from "../config.json";
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
  server: GuildDiscord
) => {
  vc.join().then((connection) => {
    if (isQueueEmpty(server))
      return message.reply("ajoute de la music avant de skip petit fou");

    message.channel.send(
      `C cette music qui se joue mtn lol: "${server.queue[0].title}" et le lien c est ${server.queue[0].url}`
    );

    // needed for the discord to play a stream
    const stream = ytdl(server.queue[0].url, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
      quality: "highestaudio",
    });
    server.dispatcher = connection.play(stream, { highWaterMark: 1 });
    server.dispatcher.setVolume(0.5);
    server.dispatcher.on("finish", () => {
      server.queue.shift();
      if (server.queue.length === 0) return;
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
