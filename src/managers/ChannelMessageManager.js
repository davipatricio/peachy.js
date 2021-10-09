'use strict';

const LimitedMap = require('../utils/LimitedMap');

class ChannelMessageManager {
  constructor(client, limit) {
    this.cache = new LimitedMap(limit);
    this.client = client;
  }
}

module.exports = ChannelMessageManager;
