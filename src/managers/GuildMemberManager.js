'use strict';

const GuildMember = require('../structures/GuildMember');
const BaseManager = require('./BaseManager');

class GuildMemberManager extends BaseManager {
	constructor (limit) {
		super(GuildMember, limit);
	}
}

module.exports = GuildMemberManager;
