'use strict';

const Message = require('../structures/Message');

module.exports.handle = function(client, data) {
	const message = new Message(client, data);
	client.emit('messageCreate', message);
};
