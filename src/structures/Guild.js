'use strict';

const Requester = require('../utils/Requester');
const Constants = require('../constants/DiscordEndpoints');
const TextChannel = require('./TextChannel');
const GuildMember = require('./GuildMember');
const User = require('./User');
const Role = require('./Role');
const GuildChannelManager = require('../managers/GuildChannelManager');
const GuildMemberManager = require('../managers/GuildMemberManager');
const RoleManager = require('../managers/RoleManager');

class Guild {
	constructor (client, data) {
		this.client = client;
		this.channels = new GuildChannelManager(this.client.options.caches.channels);
		this.members = new GuildMemberManager(this.client.options.caches.membersPerGuild);
		this.roles = new RoleManager(this.client.options.caches.membersPerGuild);
		this.parseData(data);
	}

	displayIconURL (options = { format: 'png', size: 2048 }) {
		return this.icon ? Constants.guildIcon(this.id, this.icon, options.size, options.format) : null;
	}

	displaySplashURL (options = { format: 'png', size: 2048 }) {
		return this.splash ? Constants.guildSplash(this.id, this.splash, options.size, options.format) : null;
	}

	displayDiscoverySplashURL (options = { format: 'png', size: 2048 }) {
		return this.discoverySplash ? Constants.guildDiscoverySplash(this.id, this.discoverySplash, options.size, options.format) : null;
	}

	displayBannerURL (options = { format: 'png', size: 2048 }) {
		return this.banner ? Constants.guildBanner(this.id, this.banner, options.size, options.format) : null;
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
		const data = await Requester.create(this.client, `/guilds/${this.id}?with_counts=true`, 'GET', true);
		return this.client.guilds.cache.set(this.id, new Guild(this.client, data));
	}

	toString () {
		return this.name;
	}

	parseData (data) {
		if (!data.id) return;
		this.id = data.id;

		if (this.unavailable) {
			this.unavailable = true;
			return;
		}

		if (data.name) this.name = data.name;

		if (data.icon) this.icon = data.icon;
		if (data.splash) this.splash = data.splash;
		if (data.discovery_splash) this.discoverySplash = data.discovery_splash;
		if (data.banner) this.discoverySplash = data.banner;

		if (data.owner_id) this.ownerId = data.owner_id;
		if (data.afk_channel_id) this.afkChannelId = data.afk_channel_id;
		if (data.afk_timeout) this.afkTimeout = data.afk_timeout;
		if (data.widget_enabled) this.widgetEnabled = data.widget_enabled;
		if (data.widget_channel_id) this.widgetChannelId = data.widget_channel_id;

		if (data.verification_level) this.verificationLevel = data.verification_level;
		if (data.default_message_notifications) this.defaultMessageNotifications = data.default_message_notifications;
		if (data.explicit_content_filter) this.explicitContentFilter = data.explicit_content_filter;
		if (data.features) this.features = data.features;
		if (data.mfa_level) this.mfaLevel = data.mfa_level;

		this.large = data.large ?? false;

		this.memberCount = data.member_count ?? data.approximate_member_count ?? data.members.length;

		if (data.joined_at) {
			this.joinedTimestamp = new Date(data.joined_at).getTime();
			this.joinedAt = new Date(this.joinedTimestamp);
		}

		if (data.roles) {
			for (const role of data.roles) {
				const guildRole = new Role(this.client, role, this);
				this.roles.cache.set(guildRole.id, guildRole);
			}
		}

		if (data.channels) {
			for (const channel of data.channels) {
				switch (channel.type) {
					// Text channels
					case 0: {
						const textChannel = new TextChannel(this.client, channel, this);
						this.channels.cache.set(channel.id, textChannel);
						this.client.channels.cache.set(channel.id, textChannel);
						break;
					}
				}
			}
		}

		if (data.members) {
			for (const member of data.members) {
				const user = new User(this.client, member.user);
				const guildMember = new GuildMember(this.client, member, user, this);
				this.members.cache.set(member.user.id, guildMember);
				this.client.users.cache.set(member.user.id, user);
			}
		}
	}
}

module.exports = Guild;
