import {ServerDiscord} from "./Server";

export class ServersDiscord {
  servers: {};
  constructor() {
    this.servers = {};
  }

  getServer(serverId: string): ServerDiscord {
    return this.servers[serverId];
  }

  createServer(serverId: string) {
    this.servers[serverId] = new ServerDiscord();
  }
}
