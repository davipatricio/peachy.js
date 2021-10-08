'use strict';

const EventEmitter = require('node:events');

const WebsocketManager = require('./ws/WebsocketManager');
const ActionManager = require('../actions/ActionManager');

const Intents = require('../utils/Intents');

const CacheMake = require('../utils/Cache');

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
				'$os': process.platform,
				'$browser': 'peachy.js',
				'$device': 'peachy.js',
			},

			// By default, all caches are enabled without any limit
			cache: CacheMake(),

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
	}

	createManagers () {
		this.ws = new WebsocketManager(this);
		this.actions = new ActionManager(this);

		CacheMake.addToClient(this, this.options.cache);
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
		if (typeof this.options.cache !== "object") throw new Error('The cache option must be an object.');

		if (typeof this.options.shardId !== 'number') throw new Error('The shardId option must be a number.');
		if (typeof this.options.apiVersion !== 'number') throw new Error('The apiVersion option must be a number.');
		if (typeof this.options.shardCount !== 'number') throw new Error('The shardCount option must be a number.');
		if (typeof this.options.large_threshold !== 'number') throw new Error('The large_threshold option must be a number.');

		// Value checking
		if (this.options.shardId < 0) throw new Error('The shardId option must be a positive number.');
		if (this.options.shardCount < 1) throw new Error('The shardCount option must be a positive number.');

		if (this.options.large_threshold < 50) throw new Error('The large_threshold option must be a number between 50 and 250.');
		if (this.options.large_threshold > 250) throw new Error('The large_threshold option must be a number between 50 and 250.');
	}
}

module.exports = Client;
