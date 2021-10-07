'use strict';

const Guild = require('../structures/Guild');

module.exports.handle = function(client, data) {
	const cachedGuild = client.guilds.cache.get(data.id);
	client.guilds.cache.delete(data.id);
	if (cachedGuild) return client.emit('guildDelete', cachedGuild);

	const guild = new Guild(client, data);
	client.emit('guildDelete', guild);
};
