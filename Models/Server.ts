import {
  StreamDispatcher,
  VoiceConnection,
  Message,
  VoiceChannel,
} from "discord.js";
import { Readable } from "stream";
import ytdl = require("ytdl-core");
import { isQueueEmpty } from "../helpers/conditions";

export interface MusicToStream {
  url: string;
  title: string;
}

export class ServerDiscord {
  private queue: MusicToStream[] = [];
  private dispatcher: StreamDispatcher;

  get Queue() {
    return this.queue;
  }

  addMusicToQueue(music: MusicToStream) {
    this.queue.push(music);
  }

  removeFromQueue() {
    this.queue.shift();
  }

  deleteQueue() {
    this.queue = [];
  }

  createDispatcherToConnectPlay(connection: VoiceConnection, stream: Readable) {
    this.dispatcher = connection.play(stream, {
      highWaterMark: 1,
      volume: 0.5,
    });
  }

  dispatcherAction(event: "finish" | string, listener: () => void) {
    this.dispatcher.on(event, listener);
  }

  playMusic(vc: VoiceChannel, message: Message) {
    vc.join().then((connection) => {
      const serverQueue = this.Queue;

      message.channel.send(
        `🎶🎶C cette music qui se joue mtn lol: "${serverQueue[0].title}" et le lien c est ${serverQueue[0].url}🎶🎶`
      );

      // create a stream from the url with YTDL.
      // uses by the connection.play method.
      const stream = ytdl(serverQueue[0].url, {
        filter: "audioonly",
        highWaterMark: 1 << 25,
        quality: "highestaudio",
      });

      this.createDispatcherToConnectPlay(connection, stream);

      this.dispatcherAction("finish", () => {
        this.removeFromQueue();
        if (isQueueEmpty(serverQueue)) return;
        this.playMusic(vc, message);
      });
    });
  }
}
