'use strict';

class Role {
  constructor(client, data, guild) {
    this.client = client;
    this.guild = guild;
    this.parseData(data);
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
