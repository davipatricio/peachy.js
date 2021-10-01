const Message = require('../structures/Guild');

module.exports.handle = function(client, data) {
	const message = new Message(client, data);
	client.emit('messageCreate', data)
};
