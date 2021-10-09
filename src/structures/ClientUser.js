'use strict';

const Constants = require('../constants/DiscordEndpoints');

class ClientUser {
  constructor(client, data) {
    this.client = client;
    this.parseData(data);
  }

  setActivity(name, type = 0) {
    this.setPresence({
      activities: [
        {
          type,
          name,
        },
      ],
    });
  }

  // https://discord.com/developers/docs/topics/gateway#activity-object
  setPresence({ activities = [], status = 'online', afk = false }) {
    const data = {
      op: 3,
      d: {
        activities,
        status,
        afk,
        since: null,
      },
    };

    this.client.ws.connection.send(JSON.stringify(data));
  }

  displayAvatarURL(options = { format: 'png', size: 2048 }) {
    return this.avatarHash
      ? Constants.userAvatar(this.id, this.avatarHash, options.size, options.format)
      : Constants.userDefaultAvatar(this.discriminator);
  }

  toString() {
    return `<@!${this.id}>`;
  }

  parseData(data) {
    if (!data) return;

    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.tag = `${this.username}#${this.discriminator}`;

    this.bot = data.bot ?? false;

    // Avatar and banners
    this.avatarHash = data.avatar;
    this.bannerHash = data.banner;
    this.accentColor = data.accent_color;
  }
}

module.exports = ClientUser;
