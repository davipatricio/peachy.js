const User = require('../structures/User');

module.exports.handle = function(client, { user }) {
	client.user = new User(client, user);
	setTimeout(() => {
		client.emit('ready');
		client.ready = true;
	}, 5000).unref();
};
