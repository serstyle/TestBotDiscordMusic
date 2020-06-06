import { Message } from "discord.js";
import { deleteMessage, voiceChannel, GuildDiscord } from "./units";

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

export const isQueueEmpty = (server: GuildDiscord) =>
  !server || !server.queue || server.queue.length === 0;

export const check = async (message: Message) => {
  const wrongChannel = await isWrongChannel(message);
  if (wrongChannel) return wrongChannel;
  const userInVC = await isUserInAVoiceChanel(message);
  if (userInVC) return userInVC;
};
