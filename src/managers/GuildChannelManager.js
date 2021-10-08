'use strict';

const LimitedMap = require('../utils/LimitedMap');

class GuildChannelManager extends BaseManager {
	constructor (limit) {
		this.cache = new LimitedMap(limit);
	}
}

module.exports = GuildChannelManager;
