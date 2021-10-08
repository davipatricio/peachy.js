'use strict';

const LimitedMap = require('../utils/LimitedMap');

class GuildChannelManager {
	constructor (limit) {
		this.cache = new LimitedMap(limit);
	}
}

module.exports = GuildChannelManager;
