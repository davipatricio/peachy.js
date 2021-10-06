const LimitedMap = require('../utils/LimitedMap');

class GuildManager {
	constructor (limit) {
		this.cache = new LimitedMap(limit);
	}
}

module.exports = GuildManager;
