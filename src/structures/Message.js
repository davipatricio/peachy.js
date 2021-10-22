'use strict';

const DataManager = require('./DataManager');
const MakeAPIMessage = require('../utils/MakeAPIMessage');
const Requester = require('../utils/Requester');

/**
 * Represents a message
 * @param {Object} data The data of the message
 * @param {Object} client The client.
 * @extends {DataManager}
 */
class Message extends DataManager {
  constructor(client, data) {
    super(client);

    this.parseData(data);
  }

  /**
   * Adds a reaction to the message
   * @param {string} emoji - The emoji to react with. Custom emojis should be used with `name:id`.
   * @example
   * // React with a custom emoji
   * message.react('pog:897226647890165811');
   * @example
   * // React with a unicode emoji
   * message.react('🤔');
   */
  async react(emoji) {
    if (typeof emoji !== 'string') throw new Error('Emoji should be a string (unicode emoji, emoji_name:id)');

    // Custom emojis should be sent to the api as "name:id"
    // Unicode emojis should be URL encoded
    // https://discord.com/developers/docs/resources/channel#create-reaction
    emoji = emoji.includes(':')
      ? emoji.replaceAll('<:', '').replaceAll('<a:', '').replaceAll('>', '')
      : encodeURIComponent(emoji);

    await Requester.create(
      this.client,
      `/channels/${this.channelId}/messages/${this.id}/reactions/${emoji}/@me`,
      'PUT',
      true,
    );
    // TODO: return MessageReaction
    return null;
  }

  /**
   * Send an inline reply to this message
   * @param {Object|string} content - Message text or message options
   * @param {string} [content.content=''] - The message text
   * @param {Array} [content.embeds=[]] - Array of {@link MessageEmbed} or raw embed data
   * @param {boolean} [content.tts=false] - Whether or not the message should be spoken aloud
   * @param {AllowedMentions} [content.allowedMentions={@link ClientOptions}#allowedMentions] - Allowed mentions object
   * @example
   * // Reply to the message
   * client.on('messageCreate', message => {
   *  if (message.content === 'hello') message.reply(`Hi, ${message.author}!`)
   * })
   * @returns {Promise<Message>}
   */
  async reply(content) {
    if (typeof content === 'string') {
      await Requester.create(this.client, `/channels/${this.channelId}/messages`, 'POST', true, {
        content,
        embeds: [],
        tts: false,
        sticker_ids: [],
        components: [],
        message_reference: {
          message_id: this.id,
          channel_id: this.channelId,
          guild_id: this.channel.guildId,
          fail_if_not_exists: this.client.options.failIfNotExists,
        },
        allowed_mentions: this.client.options.allowedMentions,
      });
      return this;
    }

    content.message_reference = {
      message_id: this.id,
      channel_id: this.channelId,
      guild_id: this.channel.guildId,
      fail_if_not_exists: this.client.options.failIfNotExists,
    };

    if (!content.allowed_mentions) content.allowed_mentions = this.client.options.allowedMentions;

    await Requester.create(
      this.client,
      `/channels/${this.channelId}/messages`,
      'POST',
      true,
      MakeAPIMessage.transform(content),
    );
    return this;
  }

  /**
   * Edits the content of the message
   * @param {Object|string} content - Message text or message options
   * @param {string} [content.content=''] - The message text
   * @param {Array<MessageEmbed>} [content.embeds=[]] - Array of {@link MessageEmbed} or raw embed data
   * @param {AllowedMentions} [content.allowedMentions={@link ClientOptions}#allowedMentions] - Allowed mentions object
   * @example
   * // Edit the message
   * message.edit('This is the new content!');
   * @returns {Promise<Message>}
   */
  async edit(content) {
    if (this.author.id !== this.client.user.id) throw new Error('You can only edit your own messages');
    if (typeof content === 'string') {
      await Requester.create(this.client, `/channels/${this.channelId}/messages/${this.id}`, 'PATCH', true, {
        content,
        embeds: [],
        components: [],
        allowed_mentions: this.client.options.allowedMentions,
      });
      return this;
    }

    if (!content.allowed_mentions) content.allowed_mentions = this.client.options.allowedMentions;

    await Requester.create(
      this.client,
      `/channels/${this.channelId}/messages/${this.id}`,
      'PATCH',
      true,
      MakeAPIMessage.transform(content),
    );
    return this;
  }

  /**
   * Publishes a message in an announcement channel to all channels following it
   * @returns {Promise<Message>}
   * @example
   * message.crosspost()
   */
  async crosspost() {
    const data = await Requester.create(
      this.client,
      `/channels/${this.channelId}/messages/${this.id}/crosspost`,
      'POST',
      true,
    );
    return this.parseData(data);
  }

  /**
   * Deletes the message
   * @returns {Promise<Message>}
   * @example
   * message.delete()
   */
  delete() {
    return Requester.create(this.client, `/channels/${this.channelId}/messages/${this.id}`, 'DELETE', true);
  }

  /**
   * Returns the message content
   * @returns {string}
   * @example
   * console.log(message.toString())
   */
  toString() {
    return this.content;
  }

  /**
   * The guild the message was sent in (if in a guild channel)
   * @type {?Guild}
   */
  get guild() {
    return this.guildId ? this.client.guilds.cache.get(this.guildId) : null;
  }

  /**
   * The channel the message was sent in (if in a guild channel)
   * @type {?TextChannel|NewsChannel|DMChannel}
   */
  get channel() {
    return this.channelId ? this.client.channels.cache.get(this.channelId) : null;
  }

  /**
   * Represents the author of the message as a guild member. Only available if the message comes from a guild where the author is still a member
   * @type {?GuildMember}
   */
  get member() {
    return this.guildId ? this.guild?.members.cache.get(this.author.id) : null;
  }

  parseData(data) {
    if (!data) return;
    const User = require('./User');

    this.id = data.id;

    this.channelId = data.channel_id ?? null;
    this.guildId = data.guild_id ?? null;

    if (!this.webhook_id) {
      this.author = new User(this.client, data.author);
    } else {
      this.webhook_id = data.webhook_id ?? null;
    }

    if (data.created_at) {
      this.createdTimestamp = new Date(data.created_at).getTime();
      this.createdAt = new Date(this.createdTimestamp);
    }

    this.content = data.content ?? null;
    this.embeds = data.embeds ?? [];
    this.tts = data.tts ?? false;
    this.pinned = data.pinned ?? false;
    this.type = data.type;

    // Add message to channel cache
    this.channel?.messages.cache.set(this.id, this);
  }
}

module.exports = Message;
