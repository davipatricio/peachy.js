'use strict';

const User = require('./User');

class Invite {
  constructor(client, data, guild) {
    this.client = client;
    this.guild = guild;
    this.parseData(data);
  }

  parseData(data) {
    if (!data) return;

    this.code = data.code;

    if (data.channel) {
      this.channel = this.client.channels.cache.get(data.channel.id) ?? data.channel;
      this.channelId = data.channel.id;
    }

    if (data.guild) {
      this.guild = this.client.guilds.cache.get(data.guild.id) ?? data.guild;
      this.guildId = data.guild.id;
    }

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
