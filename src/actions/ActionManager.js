const fs = require('fs');

class ActionManager {
	constructor (client) {
		this.loaded = {};
		this.client = client;
		const actions = fs.readdirSync(__dirname);
		for (let action of actions) {
			if (action === 'ActionManager.js') continue;

			action = action.replace('.js', '');
			if (client.options.disabledEvents.includes(action)) continue;
			this.client.emit('actionLoaded', action);
			this.loaded[action] = require(`./${action}`);
		}
	}
}

module.exports = ActionManager;
