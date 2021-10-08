'use strict';

const User = require('../structures/User');

module.exports.handle = function(client, { session_id: sessionId, user }) {
	client.user = new User(client, user);
	client.users.cache.set(client.user.id, client.user);
	client.api.sessionId = sessionId;

	setTimeout(() => {
		client.emit('ready', client.user);
		client.ready = true;
	}, 5000).unref();
};
