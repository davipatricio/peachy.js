'use strict';

const TextChannel = require('../structures/TextChannel');
const BaseManager = require('./BaseManager');

class ChannelManager extends BaseManager {
  constructor(client, limit) {
    super(TextChannel, limit, '/channels');
    this._client = client;
  }
}

module.exports = ChannelManager;
