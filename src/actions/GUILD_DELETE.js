const Guild = require('../structures/Guild');

module.exports.handle = function(client, data) {
	const cachedGuild = client.caches.guilds.get(data.id);
	client.caches.guilds.delete(data.id);
	if (cachedGuild) return client.emit('guildDelete', cachedGuild);

	const guild = new Guild(client, data);
	client.emit('guildDelete', guild);
};
