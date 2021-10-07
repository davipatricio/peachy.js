'use strict';

const LimitedMap = require('../utils/LimitedMap');

class RoleManager {
	constructor (limit) {
		this.cache = new LimitedMap(limit);
	}
}

module.exports = RoleManager;
