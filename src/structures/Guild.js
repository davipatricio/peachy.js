const Requester = require('../utils/Requester');

class Guild {
	constructor (client, data) {
		this.client = client;
		this.parseData(data);
	}

	setName (name) {
		return Requester.create(this.client, `/guilds/${this.id}`, 'PATCH', true, { name });
	}

	delete () {
		return Requester.create(this.client, `/guilds/${this.id}`, 'DELETE', true);
	}

	async fetch () {
		let data = await Requester.create(this.client, `/guilds/${this.id}?with_counts=true`, 'GET', true);
		data = data.json();
		return this.client.caches.set(this.id, new Guild(this.client, data));
	}

	parseData (data) {
		if (this.unavailable) {
			this.id = data.id;
			this.unavailable = true;
		}
		else {
			this.id = data.id;
			this.name = data.name;
			this.icon = data.icon;
			this.splash = data.splash;
			this.discoverySplash = data.discovery_splash;
			this.ownerId = data.owner_id;
			this.afkChannelId = data.afk_channel_id;
			this.afkTimeout = data.afk_timeout;
			this.widgetEnabled = data.widget_enabled;
			this.widgetChannelId = data.widget_channel_id;
			this.verificationLevel = data.verification_level;
			this.defaultMessageNotifications = data.default_message_notifications;
			this.explicitContentFilter = data.explicit_content_filter;
			this.features = data.features;
			this.mfaLevel = data.mfa_level;
			this.large = data.large;
			this.memberCount = data.member_count;

			this.joinedAt = new Date(data.joined_at);
			this.joinedTimestamp = data.joined_at;
		}
	}
}

module.exports = Guild;
