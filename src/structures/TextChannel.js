'use strict';

const DataManager = require('./DataManager');
const Invite = require('./Invite');
const ChannelMessageManager = require('../managers/ChannelMessageManager');
const Requester = require('../utils/Requester');

class TextChannel extends DataManager {
  constructor(client, data, guild) {
    super(client);

    this.guild = guild;
    this.messages = new ChannelMessageManager(client, this._client.options.cache.ChannelMessageManager);
    this.parseData(data);
  }

  send(content) {
    return this._client.createMessage(this.id, content);
  }

  async createInvite(options = { max_age: 86400, max_uses: 0, temporary: false, unique: false }) {
    const data = await Requester.create(this._client, `/channels/${this.id}/invites`, 'POST', true, options);
    return new Invite(this._client, data);
  }

  async setName(name, reason) {
    const data = await Requester.create(
      this._client,
      `/channels/${this.id}`,
      'PATCH',
      true,
      { name },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return new TextChannel(this._client, data, this.guild);
  }

  async setPosition(position = 0, reason) {
    const data = await Requester.create(
      this._client,
      `/channels/${this.id}`,
      'PATCH',
      true,
      { position },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return new TextChannel(this._client, data, this.guild);
  }

  async setTopic(topic = null, reason) {
    const data = await Requester.create(
      this._client,
      `/channels/${this.id}`,
      'PATCH',
      true,
      { topic },
      {
        'X-Audit-Log-Reason': reason,
      },
    );
    return new TextChannel(this._client, data, this.guild);
  }

  async setRateLimitPerUser(seconds = 0, reason) {
    const data = await Requester.create(
      this._client,
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
    return new TextChannel(this._client, data, this.guild);
  }

  async setDefaultAutoArchiveDuration(minutes = 60, reason) {
    const data = await Requester.create(
      this._client,
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
    return new TextChannel(this._client, data, this.guild);
  }

  async setType(type = 'GUILD_NEWS', reason) {
    if (typeof type === 'number') {
      const data = await Requester.create(
        this._client,
        `/channels/${this.id}`,
        'PATCH',
        true,
        { type },
        {
          'X-Audit-Log-Reason': reason,
        },
      );
      return new TextChannel(this._client, data, this.guild);
    }

    if (!['GUILD_TEXT', 'GUILD_NEWS'].includes(type)) throw new Error('Invalid channel type');
    const data = await Requester.create(
      this._client,
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
    return new TextChannel(this._client, data, this.guild);
  }

  async delete(reason) {
    const data = await Requester.create(this._client, `/channels/${this.id}`, 'DELETE', true, undefined, {
      'X-Audit-Log-Reason': reason,
    });
    return new TextChannel(this._client, data, this.guild);
  }

  async fetch() {
    const data = await Requester.create(this._client, `/channels/${this.id}`, 'GET', true);
    const channel = new TextChannel(this._client, data, this.guild);
    this.guild.channels.cache.set(data.id, channel);
    this._client.channels.cache.set(data.id, channel);
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
    this.rateLimitPerUser = data.rate_limit_per_user ?? 0;

    this.lastMessageId = data.last_message_id;
    this.parentId = data.parent_id;

    this.name = data.name;
    this.type = 'GUILD_TEXT';

    this.parent = this._client.channels.cache.get(this.parentId);

    return this
  }
}

module.exports = TextChannel;
