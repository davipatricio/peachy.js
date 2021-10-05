const Requester = require('../utils/Requester');

class TextChannel {
	constructor (client, data, guild) {
		this.client = client;
		this.guild = guild;
		this.parseData(data);
	}

	async delete () {
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
		this.slowmode = data.rate_limit_per_user;

		this.lastMessageId = data.last_message_id;
		this.parentId = data.parent_id;

		this.name = data.name;
		this.type = 'GUILD_TEXT';

		this.parent = this.client.caches.channels.get(this.parentId);
	}
}

module.exports = TextChannel;
