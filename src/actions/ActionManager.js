const fs = require('fs');

class ActionManager {
	constructor (client) {
		// Load all events
		this.loaded = {};
		this.client = client;
		const actions = fs.readdirSync(__dirname);
		for (let action of actions) {
			if (action === 'ActionManager.js') continue;
			action = action.replace('.js', '');
			this.client.emit('actionLoaded', action);
			this.loaded[action] = require(`./${action}`);
		}
	}
}

module.exports = ActionManager;
