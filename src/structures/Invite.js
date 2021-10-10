'use strict';

const User = require('./User');

class Invite {
  constructor(client, data, guild) {
    this.client = client;
    this.guild = guild;
    this.parseData(data);
  }

  get guild() {
    return this.guildId ? this.client.guilds.cache.get(this.guildId) : null;
  }

  get channel() {
    return this.channelId ? this.client.channels.cache.get(this.channelId) : null;
  }

  parseData(data) {
    if (!data) return;

    this.code = data.code;

    this.channelId = data.channel ? data.channel.id : null;
    this.guildId = data.guild ? data.guild.id : null;

    this.inviter = new User(this.client, data.inviter);
    this.maxAge = data.max_age;
    this.maxUses = data.max_uses;
    this.temporary = data.temporary;
    this.uses = data.uses;

    if (data.created_at) {
      this.createdTimestamp = new Date(data.created_at).getTime();
      this.createdAt = new Date(this.createdTimestamp);
    }
  }
}

module.exports = Invite;
