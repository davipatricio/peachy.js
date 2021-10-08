'use strict';

const TextChannel = require('../structures/TextChannel');
const BaseManager = require('./BaseManager');

class GuildChannelManager extends BaseManager {
	constructor (limit) {
		super(TextChannel, limit)
	}
}

module.exports = GuildChannelManager;
