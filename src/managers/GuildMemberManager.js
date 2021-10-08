'use strict';

const BaseManager = require('./BaseManager');
class GuildMemberManager extends BaseManager {
	constructor (limit) {
		super(limit);
	}
}

module.exports = GuildMemberManager;
