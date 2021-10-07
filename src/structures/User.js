'use strict';

const Requester = require('../utils/Requester');
const Constants = require('../constants/DiscordEndpoints');
const MakeAPIMessage = require('../utils/MakeAPIMessage');
const Message = require('./Message');
class User {
	constructor (client, data) {
		this.client = client;
		this.parseData(data);
	}

	displayBannerURL (options = { format: 'png', size: 2048 }) {
		if (!this.bannerHash) return null;
		return Constants.userBanner(this.id, this.bannerHash, options.size, options.format);
	}

	displayAvatarURL (options = { format: 'png', size: 2048 }) {
		return this.avatarHash ? Constants.userAvatar(this.id, this.avatarHash, options.size, options.format) : Constants.userDefaultAvatar(this.discriminator);
	}

	async send (content) {
		const dmChannelId = await this.createDM();
		if (typeof content === 'string') {
			const data = await Requester.create(this.client, `/channels/${dmChannelId.id}/messages`, 'POST', true, {
				content,
				embeds: [],
				tts: false,
				sticker_ids: [],
				components: [],
				allowed_mentions: {
					parse: this.client.options.allowedMentions.parse,
					replied_user: this.client.options.allowedMentions.replied_user,
					users: this.client.options.allowedMentions.users,
					roles: this.client.options.allowedMentions.roles,
				},
			});
			return new Message(this.client, data);
		}

		if (!content.allowed_mentions) {
			content.allowed_mentions = {
				parse: this.client.options.allowedMentions.parse,
				replied_user: this.client.options.allowedMentions.replied_user,
				users: this.client.options.allowedMentions.users,
				roles: this.client.options.allowedMentions.roles,
			};
		}

		const data = await Requester.create(this.client, `/channels/${dmChannelId.id}/messages`, 'POST', true, MakeAPIMessage.transform(content));
		return new Message(this.client, data);
	}

	async createDM () {
		const data = await Requester.create(this.client, '/users/@me/channels', 'POST', true, { recipient_id: this.id });
		return data;
	}

	toString () {
		return `<@!${this.id}>`;
	}


	parseData (data) {
		if (!data) return;

		this.id = data.id;
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.tag = `${this.username}#${this.discriminator}`;

		this.bot = data.bot ?? false;

		// Avatar and banners
		this.avatarHash = data.avatar;
		this.bannerHash = data.banner;
		this.accentColor = data.accent_color;
	}
}

module.exports = User;
