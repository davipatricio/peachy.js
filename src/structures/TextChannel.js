'use strict';

const Requester = require('../utils/Requester');
const Message = require('./Message');
const MakeAPIMessage = require('../utils/MakeAPIMessage');

class TextChannel {
	constructor (client, data, guild) {
		this.client = client;
		this.guild = guild;
		this.parseData(data);
	}

	async send (content) {
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

		const data = await Requester.create(this.client, `/channels/${this.id}/messages`, 'POST', true, MakeAPIMessage.transform(content));
		return new Message(this.client, data);
	}

	setName (name) {
		return Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { name });
	}

	setPosition (position = 0) {
		return Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { position });
	}

	setTopic (topic = null) {
		return Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { topic });
	}

	setRateLimitPerUser (seconds = 0) {
		return Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { rate_limit_per_user: seconds });
	}

	setType (type = 'GUILD_NEWS') {
		if (typeof type === 'number') return Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { type });

		if (!['GUILD_TEXT', 'GUILD_NEWS'].includes(type)) throw new Error('Invalid channel type');
		return Requester.create(this.client, `/channels/${this.id}`, 'PATCH', true, { type: type === 'GUILD_TEXT' ? 0 : 5 });
	}

	delete () {
		return Requester.create(this.client, `/channels/${this.id}`, 'DELETE', true);
	}

	toString () {
		return `<#${this.id}>`;
	}

	parseData (data) {
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
