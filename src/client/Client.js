const os = require('os');
const EventEmitter = require('events');
const LimitedMap = require('../utils/LimitedMap');
const Websocket = require('./ws/Websocket');
const ActionManager = require('../actions/ActionManager');
const Intents = require('../utils/Intents');

class Client extends EventEmitter {
	constructor (options = {}) {
		super();
		this.api = {};

		this.ws = new Websocket(this);
		this.actions = new ActionManager(this);

		this.options = Object.assign({
			disabledEvents: [],
			shardId: 0,
			shardCount: 1,
			intents: [],
			large_threshold: 50,
			properties: {
				'$os': os.platform(),
				'$browser': 'peachy.js',
				'$device': 'peachy.js',
			},

			// By default, all caches are enabled
			caches: {
				guilds: Infinity,
				channels: Infinity,
				roles: Infinity,
				users: Infinity,
				membersPerGuild: Infinity,
				emojis: Infinity,
			},
		}, options);

		this._verifyOptions();
		this.options.intents = Intents(this.options.intents);
		this.caches = {
			guilds: new LimitedMap(this.options.caches.guilds),
			channels: new LimitedMap(this.options.caches.channels),
			roles: new LimitedMap(this.options.caches.roles),
			users: new LimitedMap(this.options.caches.users),
			membersPerGuild: new LimitedMap(this.options.caches.membersPerGuild),
			emojis: new LimitedMap(this.options.caches.emojis),
		};
	}

	async login (token) {
		this.token = token ?? process.env.DISCORD_TOKEN ?? process.env.BOT_TOKEN ?? process.env.TOKEN;
		if (!this.token || typeof this.token !== 'string') throw new Error('No token was provided.');

		this.emit('debug', 'Login method was called. Preparing to connect to the Discord Gateway.');
		return this.ws.connect();
	}

	_verifyOptions () {
		// Type checking
		if (!Array.isArray(this.options.disabledEvents)) throw new Error('The disabledEvents option must be an array.');
		if (!Array.isArray(this.options.intents)) throw new Error('The intents option must be an array.');

		if (typeof this.options.properties !== 'object') throw new Error('The properties option must be an object.');
		if (typeof this.options.caches !== 'object') throw new Error('The properties option must be an object.');

		if (typeof this.options.shardId !== 'number') throw new Error('The shardId option must be a number.');
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
