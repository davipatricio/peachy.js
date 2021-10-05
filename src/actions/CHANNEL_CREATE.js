const TextChannel = require('../structures/TextChannel');

module.exports.handle = function(client, data) {
	if (data.type === 0) {
		const channel = new TextChannel(client, data);
		client.caches.channels.set(data.id, channel);
		client.emit('channelCreate', guild);
	}
};
