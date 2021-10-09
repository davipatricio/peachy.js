'use strict';

const Guild = require('../structures/Guild');

module.exports.handle = (client, data) => {
  const guild = new Guild(client, data);
  client.guilds.cache.set(guild, guild.id);
  if (client.ready) client.emit('guildCreate', guild);
};
