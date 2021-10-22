'use strict';

const DataManager = require('./DataManager');
const Invite = require('./Invite');
const Message = require('./Message');
const ChannelMessageManager = require('../managers/ChannelMessageManager');
const MakeAPIMessage = require('../utils/MakeAPIMessage');
const Requester = require('../utils/Requester');
class TextChannel extends DataManager {
  constructor(client, data, guild) {
    super(client);

    this.messages = new ChannelMessageManager(client, this.client.options.cache.ChannelMessageManager);
    this.parseData(data, guild);
  }

  /**
   * Sends a message to the channel.
   * @param {Object|string} content - Message text or message options
   * @param {string} [content.content=''] - The message text
   * @param {Array<MessageEmbed>} [content.embeds=[]] - Array of {@link MessageEmbed} or raw embed data
   * @param {boolean} [content.tts=false] - Whether or not the message should be spoken aloud
   * @param {AllowedMentions} [content.allowedMentions={@link ClientOptions}#allowedMentions] - Allowed mentions object
   */
  async send(content) {
    if (typeof content === 'string') {
      const data = await Requester.create(this.client, `/channels/${this.id}/messages`, 'POST', true, {
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
      `/channels/${this.id}/messages`,
      'POST',
      true,
      MakeAPIMessage.transform(content),
    );
    return new Message(this.client, data);
  }

  async createInvite(options = { max_age: 86400, max_uses: 0, temporary: false, unique: false }) {
    const data = await Requester.create(this.client, `/channels/${this.id}/invites`, 'POST', true, options);
    return new Invite(this.client, data);
  }

  /**
   * Changes the channel name.
   * @param {string} name - New channel name
   * @param {string} [reason] - Reason for changing the channel name
   */
  async setName(name, reason) {
    const data = await Requester.create(
      this.client,
      `/channels/${this.id}`,
      'PATCH',
      true,
      { name },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return new TextChannel(this.client, data, this.guild);
  }

  /**
   * Changes the channel position.
   * @param {number} [position=0] - New channel position
   * @param {string} [reason] - Reason for changing the channel position
   */
  async setPosition(position = 0, reason) {
    const data = await Requester.create(
      this.client,
      `/channels/${this.id}`,
      'PATCH',
      true,
      { position },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return new TextChannel(this.client, data, this.guild);
  }

  /**
   * Changes the channel topic.
   * @param {string} [topic=null] - New channel topic
   * @param {string} [reason] - Reason for changing the channel topic
   */
  async setTopic(topic = null, reason) {
    const data = await Requester.create(
      this.client,
      `/channels/${this.id}`,
      'PATCH',
      true,
      { topic },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return new TextChannel(this.client, data, this.guild);
  }

  /**
   * Changes the channel slowmode.
   * @param {number} [seconds=0] - New slowmode duration
   * @param {string} [reason] - Reason for changing the channel slowmode
   */
  async setRateLimitPerUser(seconds = 0, reason) {
    const data = await Requester.create(
      this.client,
      `/channels/${this.id}`,
      'PATCH',
      true,
      {
        rate_limit_per_user: seconds,
      },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return new TextChannel(this.client, data, this.guild);
  }
  
  /**
   * Sets the default auto archive duration for all newly created threads in this channel.
   * @param {number} [minutes=60] - default duration that the clients (not the API) will use for newly created threads, in minutes, to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080
   * @param {*} [reason] - Reason for changing the channel's default auto archive duration
   * @returns 
   */
  async setDefaultAutoArchiveDuration(minutes = 60, reason) {
    const data = await Requester.create(
      this.client,
      `/channels/${this.id}`,
      'PATCH',
      true,
      {
        default_auto_archive_duration: minutes,
      },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return new TextChannel(this.client, data, this.guild);
  }

  async setType(type = 'GUILD_NEWS', reason) {
    if (typeof type === 'number') {
      const data = await Requester.create(
        this.client,
        `/channels/${this.id}`,
        'PATCH',
        true,
        { type },
        {
          'X-Audit-Log-Reason': reason,
        },
      );
      return new TextChannel(this.client, data, this.guild);
    }

    if (!['GUILD_TEXT', 'GUILD_NEWS'].includes(type)) throw new Error('Invalid channel type');
    const data = await Requester.create(
      this.client,
      `/channels/${this.id}`,
      'PATCH',
      true,
      {
        type: type === 'GUILD_TEXT' ? 0 : 5,
      },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return new TextChannel(this.client, data, this.guild);
  }

  /**
   * Deletes the channel.
   * @param {string} [reason] - Reason for deleting the channel
   * @returns {Promise<TextChannel>}
   */
  async delete(reason) {
    const data = await Requester.create(this.client, `/channels/${this.id}`, 'DELETE', true, undefined, {
      'X-Audit-Log-Reason': reason,
    });
    return new TextChannel(this.client, data, this.guild);
  }

  async fetch() {
    const data = await Requester.create(this.client, `/channels/${this.id}`, 'GET', true);
    const channel = new TextChannel(this.client, data, this.guild);
    this.guild.channels.cache.set(data.id, channel);
    this.client.channels.cache.set(data.id, channel);
    return channel;
  }

  /**
   * Returns the {@link Guild} object of this channel.
   * @returns {Guild|null}
   */
  get guild() {
    return this.guildId ? this.client.guilds.cache.get(this.guildId) : null;
  }

  /**
   * Returns the channel mention
   * @example
   * <@#12345678901234567>
   * @returns {string}
   */
  toString() {
    return `<#${this.id}>`;
  }

  parseData(data, guild) {
    if (!data) return;

    this.id = data.id;

    this.nsfw = data.nsfw ?? false;
    this.topic = data.topic ?? null;
    this.rateLimitPerUser = data.rate_limit_per_user ?? 0;

    this.lastMessageId = data.last_message_id;
    this.parentId = data.parent_id;

    this.name = data.name;
    this.type = 'GUILD_TEXT';

    this.guildId = guild?.id;

    this.parent = this.client.channels.cache.get(this.parentId);

    // Cache channel
    this.client.channels.cache.set(data.id, this);
    this.guild?.channels.cache.set(data.id, this);
  }
}

module.exports = TextChannel;
