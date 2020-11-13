import { Message } from "discord.js";
import { deleteMessage, voiceChannel } from "./units";
import { MusicToStream } from "../Models/Server";

export const isWrongChannel = async (message: Message) => {
  if (message.channel.id !== "718245594342096970") {
    deleteMessage(message);
    return message.reply("Va dans le channel music pour controler la music 😐");
  }
};
export const isWrongUser = async (message: Message) => {
  if (process.env.BOT_PERSO && message.author.id !== '336795736236752898') {
    deleteMessage(message);
    return message.reply("T KI PTDR 😐 SEUL GRAND MAITRE SER PEUT ME PARLER, utilise AKOS avec '!play' ");
  }
};

export const isUserInAVoiceChanel = (message: Message) => {
  if (!voiceChannel(message)) {
    return message.reply("please join a voice channel first! 😐");
  }
};

export const isQueueEmpty = (queue: MusicToStream[]) =>
  !queue || queue.length === 0;


export const check = async (message: Message) => {
  const wrongUser = await isWrongUser(message);
  if (wrongUser) return wrongUser;
  const wrongChannel = await isWrongChannel(message);
  if (wrongChannel) return wrongChannel;
  const userInVC = await isUserInAVoiceChanel(message);
  if (userInVC) return userInVC;
};

export const isLastMusic = (queue: MusicToStream[]) => queue.length === 1;
