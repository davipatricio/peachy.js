'use strict';

const EmojiManager = require('../managers/EmojiManager');
const GuildChannelManager = require('../managers/GuildChannelManager');
const GuildManager = require('../managers/GuildManager');
const UserManager = require('../managers/UserManager');

module.exports.default = (options = {}) => {
	return {
		EmojiManager: options.EmojiManager ?? Infinity,
		GuildChannelManager: options.GuildChannelManager ?? Infinity,
		GuildManager: options.GuildManager ?? Infinity,
		RoleManager: options.RoleManager ?? Infinity,
		UserManager: options.UserManager ?? Infinity,
		GuildMemberManager: options.GuildMemberManager ?? Infinity,
	};
};
module.exports.addToClient = (client, Make) => {
	client.guilds = new GuildManager(Make.options.GuildChannelManager);
	client.emojis = new EmojiManager(Make.options.EmojiManager);
	client.users = new UserManager(Make.options.UserManager);
	client.channels = new GuildChannelManager(Make.options.GuildChannelManager);
};
