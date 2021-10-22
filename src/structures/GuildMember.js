'use strict';

const DataManager = require('./DataManager');
const User = require('./User');
const Permissions = require('../utils/PermissionParser');

class GuildMember extends DataManager {
  constructor(client, data, user, guild) {
    super(client);

    /**
     * @type {User} - The user that this guild member instance represents
     */
    this.user = user instanceof User ? user : new User(client, user);
    this.parseData(data, guild);
  }

  /**
   * Returns the member mention
   * @example
   * <@!12345678901234567>
   * @returns {string}
   */
  toString() {
    return `<@!${this.user.id}>`;
  }

  parseData(data, guild) {
    if (!data) return;

    this.guildId = guild.id;
    this.guild = this.client.guilds.cache.get(this.guildId);
    this.nickname = data.nick;
    this.rolesIds = data.roles;
    this.permissionsList = [];

    for (const role of this.rolesIds) {
      this.permissionsList.push(...Permissions.parse(this.guild?.roles.cache.get(role).permissions));
    }

    if (data.joined_at) {
      this.joinedTimestamp = new Date(data.joined_at).getTime();
      this.joinedAt = new Date(this.joinedTimestamp);
    }

    // Cache channel
    this.client.users.cache.set(data.id, this.user);
    this.guild?.members.cache.set(data.id, this);
  }
}

module.exports = GuildMember;
