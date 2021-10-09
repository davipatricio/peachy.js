'use strict';

const Guild = require('../structures/Guild');

module.exports.handle = (client, data) => {
  const oldGuild = client.guilds.cache.get(data.id);
  let newGuild = null;
  if (oldGuild) {
    // We don't want to change the old guild data so we clone the old guild and update it's data
    newGuild = oldGuild._update(data);
  } else {
    newGuild = new Guild(client, data);
  }
  client.guilds.cache.set(data.id, newGuild);
  client.emit('guildUpdate', oldGuild, newGuild);
};
