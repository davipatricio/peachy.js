'use strict';

const TextChannel = require('../structures/TextChannel');
const LimitedMap = require('../utils/LimitedMap');
const Requester = require('../utils/Requester');

class GuildChannelManager {
  constructor(client, limit) {
    this.cache = new LimitedMap(limit);
    this.client = client;
  }

  async fetch(id) {
    if (this.cache.has(id)) return this.cache.get(id);

    const data = await Requester.create(this.client, `/channels/${id}`, 'GET', true);
    let channel = null;
    let cachedChannel = this.cache.get(id);
    switch (data.type) {
      case 0:
        // We don't want to change the old channel data so we clone the old channel and update it's data
        channel =
          this.cache.get(id)?._update(data, cachedChannel.guild) ??
          new TextChannel(this.client, data, this.client.guilds.cache.get(data.guild_id));
        break;
    }

    this.cache.set(channel.id, channel);
    this.client.channels.cache.set(channel.id, channel);
    return channel;
  }
}

module.exports = GuildChannelManager;
