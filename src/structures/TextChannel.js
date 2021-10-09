'use strict';

const Message = require('./Message');
const MakeAPIMessage = require('../utils/MakeAPIMessage');
const Requester = require('../utils/Requester');

class TextChannel {
  constructor(client, data, guild) {
    this.client = client;
    this.guild = guild;
    this.parseData(data);
  }

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

  async setName(name) {
    const data = await Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { name });
    return new TextChannel(this.client, data, this.guild);
  }

  async setPosition(position = 0) {
    const data = await Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { position });
    return new TextChannel(this.client, data, this.guild);
  }

  async setTopic(topic = null) {
    const data = await Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { topic });
    return new TextChannel(this.client, data, this.guild);
  }

  async setRateLimitPerUser(seconds = 0) {
    const data = await Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, {
      rate_limit_per_user: seconds,
    });
    return new TextChannel(this.client, data, this.guild);
  }

  async setType(type = 'GUILD_NEWS') {
    if (typeof type === 'number') {
      const data = await Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { type });
      return new TextChannel(this.client, data, this.guild);
    }

    if (!['GUILD_TEXT', 'GUILD_NEWS'].includes(type)) throw new Error('Invalid channel type');
    const data = await Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, {
      type: type === 'GUILD_TEXT' ? 0 : 5,
    });
    return new TextChannel(this.client, data, this.guild);
  }

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

  toString() {
    return `<#${this.id}>`;
  }

  parseData(data) {
    if (!data) return;

    this.id = data.id;

    this.nsfw = data.nsfw ?? false;
    this.topic = data.topic ?? null;
    this.slowmode = data.rate_limit_per_user ?? 0;

    this.lastMessageId = data.last_message_id;
    this.parentId = data.parent_id;

    this.name = data.name;
    this.type = 'GUILD_TEXT';

    this.parent = this.client.channels.cache.get(this.parentId);
  }
}

module.exports = TextChannel;
