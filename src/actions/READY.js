const User = require('../structures/User');

module.exports.handle = function(client, data) {
	client.user = new User(client, data.user);
	setTimeout(() => {
		client.emit('ready');
		client.ready = true;
	}, 5000).unref();
};
