'use strict';

const DataManager = require('./DataManager');
const Requester = require('../utils/Requester');

class Role extends DataManager {
  constructor(client, data, guild) {
    super(client);

    this.parseData(data, guild);
  }

  /**
   * Changes the role name.
   * @param {string} name - New role name
   * @param {string} [reason] - Reason for changing the role name
   */
  async setName(name, reason) {
    const data = await Requester.create(
      this.client,
      `/guilds/${this.guild.id}/roles/${this.id}`,
      'PATCH',
      true,
      { name },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return this.parseData(data);
  }

  async setHoist(hoist = true, reason) {
    const data = await Requester.create(
      this.client,
      `/guilds/${this.guild.id}/roles/${this.id}`,
      'PATCH',
      true,
      { hoist },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return this.parseData(data);
  }

  async setMentionable(mentionable = true, reason) {
    const data = await Requester.create(
      this.client,
      `/guilds/${this.guild.id}/roles/${this.id}`,
      'PATCH',
      true,
      { mentionable },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return this.parseData(data);
  }

  /**
   * Deletes the role.
   * @param {string} [reason] - Reason for deleting the channel
   * @returns {Promise<null>}
   */
  delete(reason) {
    return Requester.create(this.client, `/guilds/${this.guild.id}/roles/${this.id}`, 'DELETE', true, undefined, {
      'X-Audit-Log-Reason': reason,
    });
  }

  get guild() {
    return this.guildId ? this.client.guilds.cache.get(this.guildId) : null;
  }

  toString() {
    return `<@&${this.id}>`;
  }

  parseData(data, guild) {
    if (!data) return;

    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
    this.mentionable = data.mentionable;
    this.guildId = guild?.id;

    // Cache role
    this.guild?.roles.cache.set(data.id, this);
  }
}

module.exports = Role;
