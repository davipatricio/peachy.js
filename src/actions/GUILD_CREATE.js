const Guild = require('../structures/Guild');

module.exports.handle = function(client, data) {
	const guild = new Guild(client, data);
	client.caches.guilds.set(data.id, guild);
	if (client.ready) client.emit('guildCreate', guild);
};
