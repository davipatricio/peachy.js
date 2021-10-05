class TextChannel {
	constructor (client, data) {
		this.client = client;
		this.parseData(data);
	}

	get guild () {
		return this.client.caches.guilds.get(this.guildId);
	}

	get parent () {
		return this.client.caches.channels.get(this.parentId);
	}

	parseData (data) {
		if (!data) return;

		this.id = data.id;

		this.nsfw = data.nsfw;
		this.topic = data.topic ?? null;
		this.slowmode = data.rate_limit_per_user;

		this.lastMessageId = data.last_message_id;
		this.parentId = data.parent_id;
		this.guildId = this.guild_id;

		this.name = data.name;
		this.type = 'GUILD_TEXT';
	}
}

module.exports = TextChannel;
