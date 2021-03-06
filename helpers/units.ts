import { Message } from "discord.js";
import fetch from "node-fetch";

export enum MessageCommand {
  PLAY = "play",
  PLAY_PLAYLIST = "plays",
  STOP = "stop",
  PLAYLIST = "playlist",
  SKIP = "skip",
  GO_TO = "goto"
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

export const getYoutubePlaylist = async (keywords: string):Promise<Array<any>> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${keywords}&maxResults=50&key=${process.env.API_KEY_YOUTUBE}`
  );
  const youtubeLinks = await response.json();

  console.log(keywords);
  console.log("json parse: ".toUpperCase(), youtubeLinks);

  return youtubeLinks.items;
};

export const getYoutubeUrl = async (keywords: string) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${keywords}&type=video&key=${process.env.API_KEY_YOUTUBE}`
  );
  const youtubeLinks = await response.json();

  console.log(keywords);
  console.log("json parse: ".toUpperCase(), youtubeLinks);

  const firstYoutubeLink =
    youtubeLinks && youtubeLinks.items.length > 0
      ? {
          url: `https://www.youtube.com/watch?v=${youtubeLinks.items[0].id.videoId}`,
          title: youtubeLinks.items[0].snippet.title,
        }
      : { url: "no link", title: "no title" };
  return firstYoutubeLink;
};
