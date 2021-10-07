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
		if (!this.banner_hash) return null;
		return Constants.userBanner(this.id, this.banner_hash, options.size, options.format);
	}

	displayAvatarURL (options = { format: 'png', size: 2048 }) {
		return Constants.userAvatar(this.id, this.avatar_hash, options.size, options.format);
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

	toString () {
		return `<@!${this.id}>`;
	}

	async createDM () {
		const data = await Requester.create(this.client, '/users/@me/channels', 'POST', true, { recipient_id: this.id });
		return data;
	}

	parseData (data) {
		if (!data) return;

		this.id = data.id;
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.tag = `${this.username}#${this.discriminator}`;
		this.bot = data.bot;

		// Avatar and banners
		this.avatar_hash = data.avatar;
		this.banner_hash = data.banner;
	}
}

module.exports = User;
