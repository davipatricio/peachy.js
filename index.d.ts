import { EventEmitter } from "node:events";

namespace peachyJs {
  export interface ClientOptions {
    disabledEvents: [];
    shardId: number;
    shardCount: number;
    apiVersion: number;
    intents: number | string[];
    large_threshold: number;

    properties: {
      $os: string;
      $browser: "peachy.js";
      $device: "peachy.js";
    };

    // By default, all caches are enabled without any limit
    cache: CacheMake;

    // Default message options

    failIfNotExists: boolean;
    allowedMentions: {
      parse: ["users" | "roles" | "everyone"];
      replied_user: boolean;
      users: [];
      roles: [];
    };
  }
  export class Client extends EventEmitter {
    ready: boolean;
    options: ClientOptions;
    api: any;
    user?: User;
    constructor(options?: ClientOptions);
    createManagers(): void;
    login(token: string): void;
    disconnect(): void;
  }
}

export = peachyJs;
