'use strict';

const Guild = require('../structures/Guild');
const LimitedMap = require('../utils/LimitedMap');
const Requester = require('../utils/Requester');
class GuildManager {
  constructor(client, limit) {
    this.cache = new LimitedMap(limit);
    this.client = client;
  }

  async fetch(id) {
    if (this.cache.has(id)) return this.cache.get(id);
    const data = await Requester.create(this.client, `/guilds/${id}`, 'GET', true);
    const guild = new Guild(this.client, data);
    this.cache.set(guild.id, guild);
    return guild;
  }
}

module.exports = GuildManager;
