const User = require('./User');
const Requester = require('../utils/Requester');

class Message {
	constructor (client, data) {
		this.client = client;
		this.parseData(data);
	}

	async delete () {
		return Requester.create(this.client, `/channels/${this.channelId}/messages/${this.id}`, 'DELETE', true);
	}

	parseData (data) {
		if (!data) return;

		this.id = data.id;

		this.channel = this.client.caches.channels.get(data.channel_id);
		this.channelId = data.channel_id;

		this.content = data.content;
		this.embeds = data.embeds;
		this.tts = data.tts;
		this.pinned = data.pinned;
		this.type = data.type;

		this.author = new User(this.client, data.author);
	}
}
module.exports = Message;
