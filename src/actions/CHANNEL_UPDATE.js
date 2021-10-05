const TextChannel = require('../structures/TextChannel');

module.exports.handle = function(client, data) {
	if (data.type === 0) {
		const channel = new TextChannel(client, data);
		const oldChannel = client.caches.channels.get(data.id);
		client.emit('channelUpdate', oldChannel, channel);
		client.caches.channels.set(data.id, channel);
	}
};
