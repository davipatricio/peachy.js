'use strict';

const Guild = require('../structures/Guild');

module.exports.handle = function(client, data) {
	const guild = new Guild(client, data);
	client.guilds._add(guild);
	if (client.ready) client.emit('guildCreate', guild);
};
