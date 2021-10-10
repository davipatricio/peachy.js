'use strict';

const DataManager = require('./DataManager');
const Permissions = require('../utils/PermissionParser');

class GuildMember extends DataManager {
  constructor(client, data, user, guild) {
    super(client);

    this.user = user;

    this.parseData(data, guild);
  }

  toString() {
    return `<@!${this.user.id}>`;
  }

  get guild() {
    return this.guildId ? this.client.guilds.cache.get(this.guildId) : null;
  }

  parseData(data, guild) {
    if (!data) return;

    this.nickname = data.nick;
    this.rolesIds = data.roles;
    this.permissionsList = [];
    this.guildId = guild?.id;

    for (const role of this.rolesIds) {
      this.permissionsList.push(...Permissions.parse(this.guild.roles.cache.get(role).permissions));
    }

    if (data.joined_at) {
      this.joinedTimestamp = new Date(data.joined_at).getTime();
      this.joinedAt = new Date(this.joinedTimestamp);
    }
  }
}

module.exports = GuildMember;
