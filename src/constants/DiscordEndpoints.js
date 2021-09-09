module.exports = {

	// API
	gatewayUrl: (version, encoding) => `wss://gateway.discord.gg/?v=${version}&encoding=${encoding}`,
	apiUrl: (version) => `https://discord.com/api/v${version}`,

	// Images
	userBanner: (userId, hash, size, format = 'png') => `https://cdn.discordapp.com/banners/${userId}/${hash}.${format}?size=${size}`,
	userAvatar: (userId, hash, size, format = 'png') => `https://cdn.discordapp.com/avatars/${userId}/${hash}.${format}?size=${size}`,
};
