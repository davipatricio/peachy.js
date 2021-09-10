const Guild = require('../structures/Guild');

module.exports.handle = function(client, data) {
	const oldGuild = client.caches.guilds.get(data.id);
	const newGuild = new Guild(client, data);
	client.caches.guilds.set(data.id, newGuild);
	client.emit('guildUpdate', oldGuild, newGuild);
};
