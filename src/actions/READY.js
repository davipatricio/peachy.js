const User = require('../structures/User');

module.exports.handle = function(client, { user }) {
	client.user = new User(client, user);
	client.users.cache.set(client.user.id, client.user);

	setTimeout(() => {
		client.emit('ready', client.user);
		client.ready = true;
	}, 5000).unref();
};
