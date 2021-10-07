'use strict';

const os = require('os');
const EventEmitter = require('events');

const WebsocketManager = require('./ws/WebsocketManager');
const ActionManager = require('../actions/ActionManager');

const Intents = require('../utils/Intents');

const GuildManager = require('../managers/GuildManager');
const UserManager = require('../managers/UserManager');
const EmojiManager = require('../managers/EmojiManager');
const GuildChannelManager = require('../managers/GuildChannelManager');

class Client extends EventEmitter {
	constructor (options = {}) {
		super();

		this.ready = false;
		this.user = null;
		this.api = {};

		this.options = Object.assign({
			// Which events should be disabled and not processed
			disabledEvents: [],

			// Sent in IDENTIFY payload
			shardId: 0,
			shardCount: 1,

			apiVersion: 9,

			intents: [],
			large_threshold: 50,

			properties: {
				'$os': os.platform(),
				'$browser': 'peachy.js',
				'$device': 'peachy.js',
			},

			// By default, all caches are enabled without any limit
			caches: {
				guilds: Infinity,
				channels: Infinity,
				roles: Infinity,
				users: Infinity,
				membersPerGuild: Infinity,
				emojis: Infinity,
			},

			// Default message options

			failIfNotExists: false,
			allowedMentions: {
				parse: ['users', 'roles', 'everyone'],
				replied_user: true,
				users: [],
				roles: [],
			},
		}, options);

		// Verify if custom options are valid
		this._verifyOptions();

		// Get bitfield from intent array
		this.options.intents = Intents.parse(this.options.intents);
		this.createManagers();

		this.ws = new WebsocketManager(this);
		this.actions = new ActionManager(this);
	}

	createManagers () {
		this.guilds = new GuildManager(this.options.caches.guilds);
		this.emojis = new EmojiManager(this.options.caches.emojis);
		this.users = new UserManager(this.options.caches.users);
		this.channels = new GuildChannelManager(this.options.caches.channels);
	}

	login (token) {
		this.token = token ?? process.env.DISCORD_TOKEN;
		if (!this.token || typeof this.token !== 'string') throw new Error('No valid token was provided.');

		this.ping = -1;
		this.emit('debug', 'Login method was called. Preparing to connect to the Discord Gateway.');
		return this.ws.connect();
	}

	disconnect () {
		if (!this.ws.connection) return;

		if (this.api.heartbeat_timer) clearInterval(this.api.heartbeat_timer);
		this.api.sequence = null;
		this.ws.connection.close();
		this.ready = false;
		this.user = null;
		this.api = {};
	}

	_verifyOptions () {
		// Type checking
		if (!Array.isArray(this.options.disabledEvents)) throw new Error('The disabledEvents option must be an array.');

		if (typeof this.options.properties !== 'object') throw new Error('The properties option must be an object.');
		if (typeof this.options.caches !== 'object') throw new Error('The properties option must be an object.');

		if (typeof this.options.shardId !== 'number') throw new Error('The shardId option must be a number.');
		if (typeof this.options.apiVersion !== 'number') throw new Error('The apiVersion option must be a number.');
		if (typeof this.options.shardCount !== 'number') throw new Error('The shardCount option must be a number.');
		if (typeof this.options.large_threshold !== 'number') throw new Error('The large_threshold option must be a number.');

		// Value checking
		if (this.options.shardId < 0) throw new Error('The shardId option must be a positive number.');
		if (this.options.shardCount < 1) throw new Error('The shardCount option must be a positive number.');

		if (this.options.large_threshold < 50) throw new Error('The large_threshold option must be a number between 50 and 250.');
		if (this.options.large_threshold > 250) throw new Error('The large_threshold option must be a number between 50 and 250.');

		// Cache checking
		if (typeof this.options.caches.guilds !== 'number') throw new Error('The caches.guilds option must be a number.');
		if (typeof this.options.caches.guilds < 0) throw new Error('The caches.guilds option must be a positive number.');

		if (typeof this.options.caches.channels !== 'number') throw new Error('The caches.channels option must be a number.');
		if (typeof this.options.caches.channels < 0) throw new Error('The caches.channels option must be a positive number.');

		if (typeof this.options.caches.roles !== 'number') throw new Error('The caches.roles option must be a number.');
		if (typeof this.options.caches.roles < 0) throw new Error('The caches.roles option must be a positive number.');

		if (typeof this.options.caches.users !== 'number') throw new Error('The caches.users option must be a number.');
		if (typeof this.options.caches.users < 0) throw new Error('The caches.users option must be a positive number.');

		if (typeof this.options.caches.membersPerGuild !== 'number') throw new Error('The caches.membersPerGuild option must be a number.');
		if (typeof this.options.caches.membersPerGuild < 0) throw new Error('The caches.membersPerGuild option must be a positive number.');

		if (typeof this.options.caches.emojis !== 'number') throw new Error('The caches.emojis option must be a number.');
		if (typeof this.options.caches.emojis < 0) throw new Error('The caches.emojis option must be a positive number.');
	}
}

module.exports = Client;
