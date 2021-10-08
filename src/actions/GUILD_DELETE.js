'use strict';

const Guild = require('../structures/Guild');

module.exports.handle = function(client, data) {
	const cachedGuild = client.guilds.cache.get(data.id) ?? new Guild(client, data);
	client.guilds.cache.delete(data.id);
	if (cachedGuild) client.emit('guildDelete', cachedGuild);
};
