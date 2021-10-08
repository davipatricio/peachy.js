'use strict';

const Requester = require('../utils/Requester');
const LimitedMap = require('../utils/LimitedMap');
const TextChannel = require('./TextChannel');

class Guild {
	constructor (client, data) {
		this.client = client;
		this.channels = new LimitedMap(this.client.options.cache.options.GuildChannelManager);
		this.parseData(data);
	}

	async setName (name) {
		const baseData = await Requester.create(this.client, `/guilds/${this.id}`, 'PATCH', true, { name });
		return this.client.guilds.cache.set(this.id, new Guild(this.client, baseData));
	}

	async setOwner (id) {
		const baseData = await Requester.create(this.client, `/guilds/${this.id}`, 'PATCH', true, { owner_id: id });
		return this.client.guilds.cache.set(this.id, new Guild(this.client, baseData));
	}

	leave () {
		if (this.ownerId === this.client.user.id) throw new Error('Bot is the guild owner');
		return Requester.create(this.client, `/users/@me/guilds/${this.id}`, 'DELETE', true);
	}

	delete () {
		return Requester.create(this.client, `/guilds/${this.id}`, 'DELETE', true);
	}

	async fetch () {
		const data = await Requester.create(this.client, `/guilds/${this.id}`, 'GET', true);
		return this.client.guilds.cache.set(this.id, new Guild(this.client, data));
	}

	toString () {
		return this.name;
	}

	parseData (data) {
		if (!data.id) return;

		if (this.unavailable) {
			this.id = data.id;
			this.unavailable = true;
			return;
		}

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

		this.joinedTimestamp = new Date(data.joined_at).getTime();
		this.joinedAt = new Date(this.joinedTimestamp);

		if (data.channels) {
			for (const channel of data.channels) {
				switch (channel.type) {
					// Text channels
					case 0: {
						const textChannel = new TextChannel(this.client, channel, this);
						this.channels.set(channel.id, textChannel);
						this.client.channels.cache.set(channel.id, textChannel);
						break;
					}
				}
			}
		}
	}
}

module.exports = Guild;
