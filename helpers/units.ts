import { VoiceChannel, Message, StreamDispatcher } from "discord.js";
import * as ytdl from "ytdl-core";
import { isQueueEmpty } from "./conditions";

export interface GuildDiscord {
  queue: string[];
  dispatcher?: StreamDispatcher;
}

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
      "C cette music qui se joue mtn lol: " + server.queue[0]
    );

    // needed for the discord to play a stream
    const stream = ytdl(server.queue[0], {
      filter: "audioonly",
    });
    server.dispatcher = connection.play(stream);
    server.dispatcher.setVolume(0.5);
    server.dispatcher.on("finish", () => {
      server.queue.shift();
      if(server.queue.length === 0) return;
      playMusic(vc, message, server);
    });
  });
};
