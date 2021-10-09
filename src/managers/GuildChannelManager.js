'use strict';

const TextChannel = require('../structures/TextChannel');
const { LimitedMap } = require('../utils/Utils');
const BaseManager = require('./BaseManager');

class GuildChannelManager {
  constructor(client, limit) {
    this._client = client;
    this.cache = new LimitedMap(limit);
  }

  fetch(options) {
    return BaseManager.prototype.fetch.call(
      {
        base: TextChannel,
        _client: this._client,
        _url: `/channels/`,
        cache: this.cache,
      },
      options,
    );
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
