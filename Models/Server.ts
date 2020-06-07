import { StreamDispatcher, VoiceConnection } from "discord.js";
import { Readable } from "stream";

export interface MusicToStream{
    url: string;
    title: string;
}

export class ServerDiscord {
    private queue: MusicToStream[] = [];
    public dispatcher: StreamDispatcher;
  
  
    addMusicToQueue(music: MusicToStream){
      this.queue.push(music);
    }
  
    getQueue(){
      return this.queue;
    }
    
    removeFromQueue(){
        this.queue.shift();
    }

    deleteQueue(){
        this.queue = [];
    }

    createDispatcherToConnectPlay(connection: VoiceConnection, stream: Readable){
        this.dispatcher = connection.play(stream, { highWaterMark: 1, volume: 0.5 });
    }

    dispatcherAction(event: "finish" | string, listener: () =>void){
        this.dispatcher.on(event, listener)
    }


  }