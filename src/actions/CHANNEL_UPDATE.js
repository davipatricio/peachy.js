'use strict';

const TextChannel = require('../structures/TextChannel');

module.exports.handle = (client, data) => {
  switch (data.type) {
    case 0: {
      const oldChannel = client.channels.cache.get(data.id);
      let channel = null;
      if (oldChannel) {
        // We don't want to change the old channel data so we clone the old channel and update it's data
        channel = oldChannel._update(data);
      } else {
        channel = new TextChannel(client, data, client.guilds.caches.get(data.guild_id));
      }
      client.emit('channelUpdate', oldChannel, channel);
      break;
    }
  }
};
