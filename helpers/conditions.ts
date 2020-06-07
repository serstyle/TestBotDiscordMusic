import { Message } from "discord.js";
import { deleteMessage, voiceChannel } from "./units";
import { ServerDiscord, MusicToStream } from "../Models/Server";

export const isWrongChannel = async (message: Message) => {
  if (message.channel.id !== "718245594342096970") {
    deleteMessage(message);
    return message.reply("Va dans le channel music pour controler la music");
  }
};

export const isUserInAVoiceChanel = (message: Message) => {
  if (!voiceChannel(message)) {
    return message.reply("please join a voice channel first!");
  }
};

export const isQueueEmpty = (queue: MusicToStream[]) =>
  !queue || queue.length === 0;

export const check = async (message: Message) => {
  const wrongChannel = await isWrongChannel(message);
  if (wrongChannel) return wrongChannel;
  const userInVC = await isUserInAVoiceChanel(message);
  if (userInVC) return userInVC;
};

export const isLastMusic = (queue: MusicToStream[]) => queue.length === 1;
