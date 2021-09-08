module.exports = {
	gatewayUrl: (version, encoding) => `wss://gateway.discord.gg/?v=${version}&encoding=${encoding}`,
	apiUrl: (version) => `https://discord.com/api/v${version}`,
};
