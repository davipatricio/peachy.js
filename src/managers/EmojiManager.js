'use strict';

const LimitedMap = require('../utils/LimitedMap');

class EmojiManager {
	constructor (limit) {
		this.cache = new LimitedMap(limit);
	}
}

module.exports = EmojiManager;
