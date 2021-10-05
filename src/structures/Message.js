const User = require('./User');

class Message {
	constructor (client, data) {
		this.client = client;
		this.parseData(data);
	}

	parseData (data) {
		if (!data) return;
		this.id = data.id;
		this.channel = this.client.channels.cache.get(data.channel_id);

		this.content = data.content;
		this.embeds = data.embeds;
		this.tts = data.tts;
		this.pinned = data.pinned;
		this.type = data.type;

		this.author = new User(this.client, data.author);
	}
}
module.exports = Message;
