'use strict';

const LimitedMap = require('../utils/LimitedMap');

class GuildMemberManager {
	constructor (limit) {
		this.cache = new LimitedMap(limit);
	}
}

module.exports = GuildMemberManager;
