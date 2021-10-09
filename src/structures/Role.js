'use strict';

const Requester = require('../utils/Requester');

class Role {
  constructor(client, data, guild) {
    this.client = client;
    this.guild = guild;
    this.parseData(data);
  }

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
    return new Role(this.client, data, this.guild);
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
    return new Role(this.client, data, this.guild);
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
    return new Role(this.client, data, this.guild);
  }

  delete(reason) {
    return Requester.create(this.client, `/guilds/${this.guild.id}/roles/${this.id}`, 'DELETE', true, undefined, {
      'X-Audit-Log-Reason': reason,
    });
  }

  parseData(data) {
    if (!data) return;

    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
    this.mentionable = data.mentionable;
  }
}

module.exports = Role;
