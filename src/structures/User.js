'use strict';

const Message = require('./Message');
const Constants = require('../constants/DiscordEndpoints');
const MakeAPIMessage = require('../utils/MakeAPIMessage');
const Requester = require('../utils/Requester');

/**
 * Represents a Discord user.
 * @param {Client} client The instantiating client
 * @param {Object} data The raw data for the user
 */
class User {
  constructor(client, data) {
    this.client = client;
    this.parseData(data);
  }

  /**
   * A link to the user's banner.
   * @param {ImageOptions} options - Options for the Image URL
   * @returns {string|null}
   */
  displayBannerURL(options = { format: 'png', size: 2048 }) {
    if (!this.bannerHash) return null;
    return Constants.userBanner(this.id, this.bannerHash, options.size, options.format);
  }

  /**
   * A link to the user's avatar.
   * @param {ImageOptions} options - Options for the Image URL
   * @returns {string}
   */
  displayAvatarURL(options = { format: 'png', size: 2048 }) {
    return this.avatarHash
      ? Constants.userAvatar(this.id, this.avatarHash, options.size, options.format)
      : Constants.userDefaultAvatar(this.discriminator);
  }

  /**
   * Sends a message to the user.
   * @param {Object|string} content - Message text or message options
   * @param {string} [content.content=''] - The message text
   * @param {Array<MessageEmbed>} [content.embeds=[]] - Array of {@link MessageEmbed} or raw embed data
   * @param {boolean} [content.tts=false] - Whether or not the message should be spoken aloud
   * @param {AllowedMentions} [content.allowedMentions={@link ClientOptions}#allowedMentions] - Allowed mentions object
   */
  async send(content) {
    const dmChannelId = await this.createDM();
    if (typeof content === 'string') {
      const data = await Requester.create(this.client, `/channels/${dmChannelId.id}/messages`, 'POST', true, {
        content,
        embeds: [],
        tts: false,
        sticker_ids: [],
        components: [],
        allowed_mentions: this.client.options.allowedMentions,
      });
      return new Message(this.client, data);
    }

    if (!content.allowed_mentions) {
      content.allowed_mentions = this.client.options.allowedMentions;
    }

    const data = await Requester.create(
      this.client,
      `/channels/${dmChannelId.id}/messages`,
      'POST',
      true,
      MakeAPIMessage.transform(content),
    );
    return new Message(this.client, data);
  }

  createDM() {
    return Requester.create(this.client, '/users/@me/channels', 'POST', true, { recipient_id: this.id });
  }

  toString() {
    return `<@!${this.id}>`;
  }

  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  parseData(data) {
    if (!data) return;

    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;

    this.bot = data.bot ?? false;

    // Avatar and banners
    this.avatarHash = data.avatar;
    this.bannerHash = data.banner;
    this.accentColor = data.accent_color;

    // Cache user
    this.client.users.cache.set(data.id, this);
  }
}

module.exports = User;
