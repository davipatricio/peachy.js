'use strict';

const MakeAPIMessage = require('../utils/MakeAPIMessage');
const Requester = require('../utils/Requester');

class Message {
  constructor(client, data) {
    this.client = client;
    this.parseData(data);
  }

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
    return null;
  }

  async reply(content) {
    if (typeof content === 'string') {
      const data = await Requester.create(this.client, `/channels/${this.channelId}/messages`, 'POST', true, {
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
      return new Message(this.client, data);
    }

    content.message_reference = {
      message_id: this.id,
      channel_id: this.channelId,
      guild_id: this.channel.guildId,
      fail_if_not_exists: this.client.options.failIfNotExists,
    };

    if (!content.allowed_mentions) content.allowed_mentions = this.client.options.allowedMentions;

    const data = await Requester.create(
      this.client,
      `/channels/${this.channelId}/messages`,
      'POST',
      true,
      MakeAPIMessage.transform(content),
    );
    return new Message(this.client, data);
  }

  delete() {
    return Requester.create(this.client, `/channels/${this.channelId}/messages/${this.id}`, 'DELETE', true);
  }

  toString() {
    return this.content;
  }

  parseData(data) {
    if (!data) return;
    const User = require('./User');

    this.id = data.id;

    if (data.channel_id) {
      this.channel = this.client.channels.cache.get(data.channel_id);
      this.channelId = data.channel_id;
    }

    if (data.guild_id) {
      this.guild = this.client.guilds.cache.get(data.guild_id);
      this.guildId = data.guild_id;
    }

    this.content = data.content ?? null;
    this.embeds = data.embeds;
    this.tts = data.tts ?? false;
    this.pinned = data.pinned;
    this.type = data.type;
    this.webhook_id = data.webhook_id;

    if (!this.webhook_id) {
      this.author = new User(this.client, data.author);
      this.member = this.guild ? this.guild.members.cache.get(this.author.id) : null;
    }
  }
}

module.exports = Message;
