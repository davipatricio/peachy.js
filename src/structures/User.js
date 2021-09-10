const Constants = require('../constants/DiscordEndpoints');

class User {
	constructor (client, data) {
		this.client = client;
		this.parseData(data);
	}

	displayBannerURL (options = { format: 'png', size: 2096 }) {
		if (!this.banner_hash) return null;
		return Constants.userBanner(this.id, this.banner_hash, options.size, options.format);
	}

	displayAvatarURL (options = { format: 'png', size: 2096 }) {
		return Constants.userAvatar(this.id, this.banner_hash, options.size, options.format);
	}

	parseData (data) {
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
