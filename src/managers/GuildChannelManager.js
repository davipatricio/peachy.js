'use strict';

const TextChannel = require('../structures/TextChannel');
const { LimitedMap } = require('../utils/Utils');
const BaseManager = require('./BaseManager');

class GuildChannelManager {
  constructor(client, limit) {
    this._client = client;
    this.cache = new LimitedMap(limit);
  }

  async fetch(id) {
    if (this.cache.has(id)) return this.cache.get(id);

    const data = await Requester.create(this.client, `/channels/${id}`, 'GET', true);
    let channel = null;
    switch (data.type) {
      case 0:
        // We don't want to change the old channel data so we clone the old channel and update it's data
        channel =
          this.cache.get(id)?._update(data) ??
          new TextChannel(this.client, data, this.client.guilds.cache.get(data.guild_id));
        break;
    }

  forge(options) {
    return this.fetch({
      getFromCache: true,
      forge: true,
      id: typeof options === 'string' ? options : options.id,
    });
  }
}

module.exports = GuildChannelManager;
