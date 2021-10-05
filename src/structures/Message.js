const User = require('./User');
const Requester = require('../utils/Requester');
const MakeAPIMessage = require('../utils/MakeAPIMessage');

class Message {
	constructor (client, data) {
		this.client = client;
		this.parseData(data);
	}

	async reply (content) {
		if (typeof content === 'string') {
			const data = await Requester.create(this.client, `/channels/${this.channelId}/messages`, 'POST', true, {
				content,
				embeds: [],
				tts: false,
				sticker_ids: [],
				components: [],
			});
			return new Message(this.client, data);
		}

		const data = await Requester.create(this.client, `/channels/${this.channelId}/messages`, 'POST', true, MakeAPIMessage.transform(content));
		return new Message(this.client, data);
	}

	async delete () {
		return Requester.create(this.client, `/channels/${this.channelId}/messages/${this.id}`, 'DELETE', true);
	}

	toString () {
		return this.content;
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
