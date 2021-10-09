import { EventEmitter } from 'node:events';

namespace peachyJs {
  export type snowflake = `${number}`;
  export interface ClientOptions {
    disabledEvents: [];
    shardId: number;
    shardCount: number;
    apiVersion: number;
    intents: number | string[];
    large_threshold: number;

    properties: {
      $os: string;
      $browser: 'peachy.js';
      $device: 'peachy.js';
    };

    // By default, all caches are enabled without any limit
    cache: CacheMake;

    // Default message options

    failIfNotExists: boolean;
    allowedMentions: {
      parse: ['users' | 'roles' | 'everyone'];
      replied_user: boolean;
      users: [];
      roles: [];
    };
  }

  export class Client extends EventEmitter {
    token: string;
    ready: boolean;
    options: ClientOptions;
    api: any;
    user?: User;
    channels?: LimitedMap<snowflake, TextChannel>;
    constructor(options?: ClientOptions);
    createManagers(): void;
    makeRequest(endpoint: string, method?: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT', data?: any): Promise<any>;
    login(token: string): void;
    disconnect(): void;
  }

  export namespace Utils {
    export function isConstructor(clase: new (...args: any[]) => any, ...params: any[]): boolean;
    export function censureToken(token: string): string;
    export class LimitedMap<K, V> extends Map {
      limit: number;
      set(key: K, value: V): V;
      keyArray(): K[];
      valueArray(): V[];
      random(items: number = 1): V[];
    }
    export namespace CacheFactory {
      export interface CacheFactoryOptions {
        EmojiManager: number;
        ChannelManager: number;
        RoleManager: number;
        UserManager: number;
        GuildMemberManager: number;
        ChannelMessageManager: number;
      }
      export default (options: CacheFactoryOptions = {}): CacheFactoryOptions => {};
      export function addToClient(client: Client): void;
    }
  }

  export interface MessageEmbedData {
    title?: string;
    timestamp?: number;
    color?: number;
    description?: string;
    url?: string;
    image?: {
      url: string;
      height?: number;
      width?: number;
    };
    author?: { name?: string; icon?: string; url?: string };
    footer?: { text?: string; icon_url?: string };
    fields?: { name: string; value: string; inline?: boolean }[];
  }
  export class MessageEmbed {
    title?: string;
    timestamp?: number;
    color?: number;
    description?: string;
    url?: string;
    image?: {
      url: string;
      height?: number;
      width?: number;
    };
    author?: { name?: string; icon?: string; url?: string };
    footer?: { text?: string; icon_url?: string };
    fields?: { name: string; value: string; inline?: boolean }[];

    constructor(data?: MessageEmbedData);
    setAuthor(name, icon?: string, url?: string): MessageEmbed;
    setTitle(title: string): MessageEmbed;
    setDescription(description: string): MessageEmbed;
    setURL(url: string): MessageEmbed;
    setTimestamp(timestamp?: number): MessageEmbed;
    setColor(color: number): MessageEmbed;
    setFooter(text?: string, icon_url?: string): MessageEmbed;
    setImage(url: string): MessageEmbed;
    addField(name: string, value: string, inline?: boolean): MessageEmbed;
    addFields(...fields: MessageEmbedData['fields']);
  }

  export const LimitedMap = Utils.LimitedMap;
  export const CacheFactory = Utils.CacheFactory;
}

export = peachyJs;
