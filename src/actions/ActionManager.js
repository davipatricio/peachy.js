'use strict';

const fs = require('fs');

class ActionManager {
	constructor (client) {
		this.loaded = {};
		this.client = client;
		const actions = fs.readdirSync(__dirname);
		for (let action of actions) {
			action = action.replace('.js', '');

			// Don't load this file
			if (action === 'ActionManager') continue;

			// Don't load disabled events
			if (client.options.disabledEvents.includes(action)) continue;

			this.client.emit('actionLoaded', action);
			this.loaded[action] = require(`./${action}`);
		}
	}
}

module.exports = ActionManager;
