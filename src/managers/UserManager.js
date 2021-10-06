const LimitedMap = require('../utils/LimitedMap');

class UserManager {
	constructor (limit) {
		this.cache = new LimitedMap(limit);
	}
}

module.exports = UserManager;
