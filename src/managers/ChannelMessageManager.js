'use strict';

const LimitedMap = require('../utils/LimitedMap');

class ChannelMessageManager {
  constructor(client, limit) {
    this.cache = new LimitedMap(limit);
    this._client = client;
  }
}

module.exports = ChannelMessageManager;
