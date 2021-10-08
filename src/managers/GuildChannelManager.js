'use strict';

const BaseManager = require('./BaseManager');
class GuildChannelManager extends BaseManager {
	constructor (limit) {
		super(limit);
	}
}

module.exports = GuildChannelManager;
