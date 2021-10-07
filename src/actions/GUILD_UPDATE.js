'use strict';

const Guild = require('../structures/Guild');

module.exports.handle = function(client, data) {
	const oldGuild = client.guilds.cache.get(data.id);
	const newGuild = new Guild(client, data);
	client.guilds.cache.set(data.id, newGuild);
	client.emit('guildUpdate', oldGuild, newGuild);
};
