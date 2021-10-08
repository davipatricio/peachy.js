'use strict';

const BaseManager = require('./BaseManager');
class GuildManager extends BaseManager {
	constructor (limit) {
		super(limit);
	}
}

module.exports = GuildManager;
