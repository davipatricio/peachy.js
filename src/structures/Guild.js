'use strict';

const DataManager = require('./DataManager');
const GuildMember = require('./GuildMember');
const Role = require('./Role');
const TextChannel = require('./TextChannel');
const User = require('./User');
const Constants = require('../constants/DiscordEndpoints');
const GuildChannelManager = require('../managers/GuildChannelManager');
const GuildMemberManager = require('../managers/GuildMemberManager');
const RoleManager = require('../managers/RoleManager');
const Requester = require('../utils/Requester');

/**
 * Represents a guild (or a server) on Discord
 * @extends {DataManager}
 * @param {Client} client The instantiating client
 * @param {Object} data The raw data for the guild
 */
class Guild extends DataManager {
  constructor(client, data) {
    super(client);

    this.channels = new GuildChannelManager(this.client, this.client.options.cache.GuildChannelManager);
    this.members = new GuildMemberManager(this.client, this, this.client.options.cache.GuildMemberManager);
    this.roles = new RoleManager(this.client, this.client.options.cache.RoleManager);

    this.parseData(data);
  }

  /**
   * The URL to this guild's icon
   * @param {ImageOptions} options - Options for the Image URL
   * @returns {string|null}
   */
  displayIconURL(options = { format: 'png', size: 2048 }) {
    return this.icon ? Constants.guildIcon(this.id, this.icon, options.size, options.format) : null;
  }

  /**
   * The URL to this guild's splash
   * @param {ImageOptions} options - Options for the Image URL
   * @returns {string|null}
   */
  displaySplashURL(options = { format: 'png', size: 2048 }) {
    return this.splash ? Constants.guildSplash(this.id, this.splash, options.size, options.format) : null;
  }

  /**
   * The URL to this guild's discovery icon
   * @param {ImageOptions} options - Options for the Image URL
   * @returns {string|null}
   */
  displayDiscoverySplashURL(options = { format: 'png', size: 2048 }) {
    return this.discoverySplash
      ? Constants.guildDiscoverySplash(this.id, this.discoverySplash, options.size, options.format)
      : null;
  }

  /**
   * The URL to this guild's banner
   * @param {ImageOptions} options - Options for the Image URL
   * @returns {string|null}
   */
  displayBannerURL(options = { format: 'png', size: 2048 }) {
    return this.banner ? Constants.guildBanner(this.id, this.banner, options.size, options.format) : null;
  }

  /**
   * Edits the name of the guild (requires MANAGE_GUILD permission)
   * @param {string} name - The new Guild name
   * @returns {Promise<Error|Guild>}
   */
  async setName(name) {
    const baseData = await Requester.create(this.client, `/guilds/${this.id}`, 'PATCH', true, { name });
    return this.client.guilds.cache.set(this.id, new Guild(this.client, baseData));
  }

  /**
   * Sets a new owner of the guild (bot should be the guild owner)
   * @param {string} id - ID of new guild owner
   * @returns {Promise<Error|Guild>}
   */
  async setOwner(id) {
    const baseData = await Requester.create(this.client, `/guilds/${this.id}`, 'PATCH', true, { owner_id: id });
    return this.client.guilds.cache.set(this.id, new Guild(this.client, baseData));
  }

  /**
   * Leaves the current guild
   * @returns {Promise<Error|Guild>}
   */
  leave() {
    if (this.ownerId === this.client.user.id) throw new Error('Bot is the guild owner');
    return Requester.create(this.client, `/users/@me/guilds/${this.id}`, 'DELETE', true);
  }

  /**
   * Leaves the current guild (bot should be the guild owner)
   * @returns {Promise<Error|Guild>}
   */
  delete() {
    return Requester.create(this.client, `/guilds/${this.id}`, 'DELETE', true);
  }

  /**
   * Fetches the current guild
   * @returns {Promise<Error|Guild>}
   */
  async fetch() {
    const data = await Requester.create(this.client, `/guilds/${this.id}?with_counts=true`, 'GET', true);
    return this.client.guilds.cache.set(this.id, new Guild(this.client, data));
  }

  /**
   * Returns the guild name
   * @returns {string}
   */
  toString() {
    return this.name;
  }

  parseData(data) {
    if (!data.id) return;
    this.id = data.id;

    if (this.unavailable) {
      this.unavailable = true;
      return;
    }

    this.name = data.name ?? null;

    this.icon = data.icon ?? null;
    this.splash = data.splash;
    this.discoverySplash = data.discovery_splash ?? null;
    this.discoverySplash = data.banner ?? null;

    this.ownerId = data.owner_id ?? null;
    this.afkChannelId = data.afk_channel_id ?? null;
    this.afkTimeout = data.afk_timeout ?? null;
    this.widgetEnabled = data.widget_enabled ?? null;
    this.widgetChannelId = data.widget_channel_id ?? null;

    this.verificationLevel = data.verification_level ?? null;

    this.defaultMessageNotifications = data.default_message_notifications ?? null;
    this.explicitContentFilter = data.explicit_content_filter ?? null;
    this.features = data.features ?? [];
    this.mfaLevel = data.mfa_level ?? null;

    this.large = data.large ?? false;

    this.memberCount = data.member_count ?? data.approximate_member_count ?? data.members.length ?? 0;

    if (data.joined_at) {
      this.joinedTimestamp = new Date(data.joined_at).getTime();
      this.joinedAt = new Date(this.joinedTimestamp);
    }

    if (data.roles) {
      for (const role of data.roles) {
        const guildRole = new Role(this.client, role, this);
        this.roles.cache.set(guildRole.id, guildRole);
      }
    }

    if (data.channels) {
      for (const channel of data.channels) {
        switch (channel.type) {
          // Text channels
          case 0: {
            const textChannel = new TextChannel(this.client, channel, this);
            this.channels.cache.set(channel.id, textChannel);
            this.client.channels.cache.set(channel.id, textChannel);
            break;
          }
        }
      }
    }

    if (data.members) {
      for (const member of data.members) {
        const user = new User(this.client, member.user);
        const guildMember = new GuildMember(this.client, member, user, this);
        this.members.cache.set(member.user.id, guildMember);
        this.client.users.cache.set(member.user.id, user);
      }
    }

    // Cache guild
    this.client.guilds.cache.set(data.id, this);
  }
}

module.exports = Guild;
