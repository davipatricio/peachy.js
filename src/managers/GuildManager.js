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

    // We don't want to change the old member data so we clone the old member and update it's data
    const guild = this.cache.get(id)?._update(data) ?? new Guild(this.client, data);
    this.cache.set(guild.id, guild);
    return guild;
  }
}

module.exports = GuildManager;
