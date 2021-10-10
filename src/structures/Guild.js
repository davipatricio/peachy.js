'use strict';

const GuildMember = require('./GuildMember');
const Role = require('./Role');
const TextChannel = require('./TextChannel');
const User = require('./User');
const Constants = require('../constants/DiscordEndpoints');
const GuildChannelManager = require('../managers/GuildChannelManager');
const GuildMemberManager = require('../managers/GuildMemberManager');
const RoleManager = require('../managers/RoleManager');
const Requester = require('../utils/Requester');
const Base = require('./Base');

class Guild extends Base {
  constructor(client, data) {
    super(client, data.id);

    this.channels = new GuildChannelManager(this.client, this.client.options.cache.GuildChannelManager);
    this.members = new GuildMemberManager(this.client, this, this.client.options.cache.GuildMemberManager);
    this.roles = new RoleManager(this.client, this.client.options.cache.RoleManager);

    this.parseData(data);
  }

  displayIconURL(options = { format: 'png', size: 2048 }) {
    return this.icon ? Constants.guildIcon(this.id, this.icon, options.size, options.format) : null;
  }

  displaySplashURL(options = { format: 'png', size: 2048 }) {
    return this.splash ? Constants.guildSplash(this.id, this.splash, options.size, options.format) : null;
  }

  displayDiscoverySplashURL(options = { format: 'png', size: 2048 }) {
    return this.discoverySplash
      ? Constants.guildDiscoverySplash(this.id, this.discoverySplash, options.size, options.format)
      : null;
  }

  displayBannerURL(options = { format: 'png', size: 2048 }) {
    return this.banner ? Constants.guildBanner(this.id, this.banner, options.size, options.format) : null;
  }

  async setName(name) {
    const baseData = await Requester.create(this._client, `/guilds/${this.id}`, 'PATCH', true, { name });
    return this._client.guilds.cache.set(this.id, new Guild(this._client, baseData));
  }

  async setOwner(id) {
    const baseData = await Requester.create(this._client, `/guilds/${this.id}`, 'PATCH', true, { owner_id: id });
    return this._client.guilds.cache.set(this.id, new Guild(this._client, baseData));
  }

  leave() {
    if (this.ownerId === this._client.user.id) throw new Error('Bot is the guild owner');
    return Requester.create(this._client, `/users/@me/guilds/${this.id}`, 'DELETE', true);
  }

  delete() {
    return Requester.create(this._client, `/guilds/${this.id}`, 'DELETE', true);
  }

  async fetch() {
    const data = await Requester.create(this._client, `/guilds/${this.id}?with_counts=true`, 'GET', true);
    return this._client.guilds.cache.set(this.id, new Guild(this._client, data));
  }

  toString() {
    return this.name;
  }

  parseData(data) {
    if (this.unavailable) {
      this.unavailable = true;
      return;
    }

    if (data.name) this.name = data.name;

    if (data.icon) this.icon = data.icon;
    if (data.splash) this.splash = data.splash;
    if (data.discovery_splash) this.discoverySplash = data.discovery_splash;
    if (data.banner) this.discoverySplash = data.banner;

    if (data.owner_id) this.ownerId = data.owner_id;
    if (data.afk_channel_id) this.afkChannelId = data.afk_channel_id;
    if (data.afk_timeout) this.afkTimeout = data.afk_timeout;
    if (data.widget_enabled) this.widgetEnabled = data.widget_enabled;
    if (data.widget_channel_id) this.widgetChannelId = data.widget_channel_id;

    if (data.verification_level) this.verificationLevel = data.verification_level;
    if (data.default_message_notifications) this.defaultMessageNotifications = data.default_message_notifications;
    if (data.explicit_content_filter) this.explicitContentFilter = data.explicit_content_filter;
    if (data.features) this.features = data.features;
    if (data.mfa_level) this.mfaLevel = data.mfa_level;

    this.large = data.large ?? false;

    this.memberCount = data.member_count ?? data.approximate_member_count ?? data.members.length;

    if (data.joined_at) {
      this.joinedTimestamp = new Date(data.joined_at).getTime();
      this.joinedAt = new Date(this.joinedTimestamp);
    }

    if (data.roles) {
      for (const role of data.roles) {
        const guildRole = new Role(this._client, role, this);
        this.roles.cache.set(guildRole.id, guildRole);
      }
    }

    if (data.channels) {
      for (const channel of data.channels) {
        switch (channel.type) {
          // Text channels
          case 0: {
            const textChannel = new TextChannel(this._client, channel, this);
            this.channels.cache.set(channel.id, textChannel);
            this._client.channels.cache.set(channel.id, textChannel);
            break;
          }
        }
      }
    }

    if (data.members) {
      for (const member of data.members) {
        const user = new User(this._client, member.user);
        const guildMember = new GuildMember(this._client, member, user, this);
        this.members.cache.set(member.user.id, guildMember);
        this._client.users.cache.set(member.user.id, user);
      }
    }
  }
}

module.exports = Guild;
