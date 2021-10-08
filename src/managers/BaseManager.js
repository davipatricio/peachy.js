'use strict';

const LimitedMap = require('../utils/LimitedMap');
class BaseManager {
	constructor (limit = Infinity) {
		this.cache = new LimitedMap(limit);
	}
}

module.exports = BaseManager;
