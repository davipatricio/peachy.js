'use strict';

const TextChannel = require('../structures/TextChannel');

module.exports.handle = (client, data) => {
  switch (data.type) {
    case 0: {
      const channel = new TextChannel(client, data, client.guilds.cache.get(data.guild_id));
      client.channels.cache.delete(data.id);
      client.emit('channelDelete', channel);
      break;
    }
  }
};
