'use strict';

const EventEmitter = require('node:events');

const Heartbeater = require('./ws/Heartbeater');

const WebsocketManager = require('./ws/WebsocketManager');
const ActionManager = require('../actions/ActionManager');
const CacheFactory = require('../utils/CacheFactory');
const Intents = require('../utils/Intents');

class Client extends EventEmitter {
  constructor(options = {}) {
    super();

    this.ready = false;
    this.user = null;
    this.api = {};

    this.options = Object.assign(
      {
        // If the library should reconnect automatically
        autoReconnect: true,

        // Which events should be disabled and not processed
        disabledEvents: [],

        // Data ent in IDENTIFY payload
        shardId: 0,
        shardCount: 1,

        apiVersion: 9,

        intents: [],
        large_threshold: 50,

        properties: {
          $os: process.platform,
          $browser: 'peachy.js',
          $device: 'peachy.js',
        },

        // By default, all caches are enabled without any limit
        cache: CacheFactory.default(options.cache),

        // Default message options

        // when replying to a message, whether to error if the referenced message
        // doesn't exist instead of sending as a normal (non-reply) message
        failIfNotExists: false,

        // Default allowed mentions configuration
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

  login(token = process.env.DISCORD_TOKEN) {
    this.ping = -1;
    this.token = token;
    this.emit('debug', '[DEBUG] Login method was called. Preparing to connect to the Discord Gateway.');
    this.ws.connect();
  }

  disconnect() {
    this.ws.connection?.close(1000);
    if (this.api.heartbeat_timer) clearInterval(this.api.heartbeat_timer);
    this.token = null;
    this.api = {};
    this.cleanUp();
  }

  cleanUp() {
    this.ping = -1;
    this.ready = false;
    this.user = null;
    this.guilds.cache.clear();
    this.emojis.cache.clear();
    this.users.cache.clear();
    this.channels.cache.clear();
  }

  reconnect() {
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
