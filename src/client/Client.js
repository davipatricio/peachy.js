'use strict';

const EventEmitter = require('node:events');

const Heartbeater = require('./ws/Heartbeater');

const WebsocketManager = require('./ws/WebsocketManager');
const ActionManager = require('../actions/ActionManager');
const CacheFactory = require('../utils/CacheFactory');
const Intents = require('../utils/Intents');

/**
 * Represents the main peachy.js Client, used for interacting with the Discord API
 * @param {Object} options - Additional client options
 * @param {boolean} [options.autoReconnect=true] - If the client should try to reconnect automatically
 * @param {Array<string>} [options.disabledEvents=[]] - Which events will be disabled and not processed
 * {@link https://github.com/denkylabs/peachy.js/tree/main/src/actions|List of supported events }
 * @param {number} [options.shardId=0] - Shard ID of the client
 * @param {number} [options.shardCount=1] - The total amount of shards used by this client
 * @param {number} [options.apiVersion=9] - The Discord API version to use
 * @param {(Array<string>|number)} [options.intents=['GUILDS']] - The intents to use for the client
 * @param {number} [options.large_threshold=50] - Number of members in a guild after which offline users will no
 * longer be sent in the initial guild member list, must be between 50 and 250
 * @param {boolean} [options.failIfNotExists=false] - Whether to error if the replied message doesn't exists
 * @param {Object} [options.cache] - What will be cached
 * @param {number} options.cache.ChannelManager - How many channels will be cached
 * @param {number} options.cache.ChannelMessageManager - How many messages will be cached
 * @param {number} options.cache.EmojiManager - How many emojis will be cached
 * @param {number} options.cache.GuildChannelManager - How many guild channels will be cached
 * @param {number} options.cache.GuildManager - How many guilds will be cached
 * @param {number} options.cache.GuildMemberManager - How many members will be cached
 * @param {number} options.cache.RoleManager - How many roles will be cached
 * @param {number} options.cache.UserManager - How many users will be cached.
 * @param {Object} [options.allowedMentions] - Default allowed mentions configuration used in messages and interactions
 * @param {Array} options.allowedMentions.parse - Types of mentions to be parsed
 * @param {Array} options.allowedMentions.users - Snowflakes of Users to be parsed as mentions
 * @param {Array} options.allowedMentions.roles - Snowflakes of Roles to be parsed as mentions
 * @param {boolean} options.allowedMentions.replied_user - Whether the author of the Message being replied to should be pinged
 */
class Client extends EventEmitter {
  constructor(options = {}) {
    super();

    this.ready = false;
    this.user = null;
    this.api = {};

    // This will either create the default options or set options that are missing
    this.options = Object.assign(
      {
        autoReconnect: true,
        disabledEvents: [],

        // Data sent in IDENTIFY payload
        shardId: 0,
        shardCount: 1,

        apiVersion: 9,

        intents: ['GUILDS'],
        large_threshold: 50,

        properties: {
          $os: process.platform,
          $browser: 'peachy.js',
          $device: 'peachy.js',
        },

        // By default, all caches are enabled without any limit
        cache: CacheFactory.default(options.cache),

        // Default message options
        failIfNotExists: false,
        allowedMentions: {
          parse: ['users', 'roles', 'everyone'],
          replied_user: true,
          users: [],
          roles: [],
        },
      },
      options,
    );

    // Verify if custom options are valid
    this._verifyOptions();

    // Get bitfield from intent array
    this.options.intents = Intents.parse(this.options.intents);
    this.createManagers();
  }

  createManagers() {
    this.ws = new WebsocketManager(this);
    this.actions = new ActionManager(this);

    CacheFactory.addToClient(this, this.options.cache);
  }

  /**
   * @param {string} token - Logs the client in, establishing a websocket connection to Discord
   */
  login(token = process.env.DISCORD_TOKEN) {
    if (!token) throw new Error('No token provided');

    this.ping = -1;
    this.token = token;

    /**
     * Emitted for general debugging information
     * @event Client#debug
     * @param {string} info - The debug information
     */
    this.emit('debug', '[DEBUG] Login method was called. Preparing to connect to the Discord Gateway.');
    this.ws.connect();
  }

  /**
   * Logs out, terminates the connection to Discord, and destroys the client.
   */
  disconnect() {
    this.ws.connection?.close(1000);
    // Stop heartbeating (this automatically verifies if there's a timer)
    Heartbeater.stop(this);

    this.api = {};
    this.cleanUp();
  }

  cleanUp() {
    this.ping = 1;
    this.ready = false;
    this.user = null;
    this.guilds.cache.clear();
    this.emojis.cache.clear();
    this.users.cache.clear();
    this.channels.cache.clear();
  }

  reconnect() {
    // Stop heartbeating (this automatically verifies if there's a timer)
    Heartbeater.stop(this);

    this.cleanUp();
    this.emit('reconnecting');

    // If we don't have a session id, we cannot reconnect
    this.api.should_resume = Boolean(this.api.sessionId);
    this.login(this.token);
  }

  _verifyOptions() {
    // Type checking
    if (!Array.isArray(this.options.disabledEvents)) throw new Error('The disabledEvents option must be an array.');

    if (typeof this.options.properties !== 'object') throw new Error('The properties option must be an object.');
    if (typeof this.options.cache !== 'object') throw new Error('The cache option must be an object.');

    if (typeof this.options.shardId !== 'number') throw new Error('The shardId option must be a number.');
    if (typeof this.options.apiVersion !== 'number') throw new Error('The apiVersion option must be a number.');
    if (typeof this.options.shardCount !== 'number') throw new Error('The shardCount option must be a number.');
    if (typeof this.options.large_threshold !== 'number') {
      throw new Error('The large_threshold option must be a number.');
    }

    // Value checking
    if (this.options.shardId < 0) throw new Error('The shardId option must be a positive number.');
    if (this.options.shardCount < 1) throw new Error('The shardCount option must be a positive number.');

    if (this.options.large_threshold < 50) {
      throw new Error('The large_threshold option must be a number between 50 and 250.');
    }
    if (this.options.large_threshold > 250) {
      throw new Error('The large_threshold option must be a number between 50 and 250.');
    }
  }
}

module.exports = Client;
