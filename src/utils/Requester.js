const fetch = import('node-fetch');
const { apiUrl } = require('../constants/DiscordEndpoints');

module.exports.create = (client, endpoint, method = 'GET', parseHeaders = true, data = '', headers = {}) => {
	if (parseHeaders) {
		headers = Object.assign({
			'Authorization': `Bot ${client.token}`,
			'Content-Type': 'application/json',
			'User-Agent': 'DiscordBot (https://github.com/DenkyLabs/peachy.js/, 0.0.1)',
		}, headers);
	}

	return fetch(`${apiUrl}/${endpoint}`, {
		method,
		headers,
		body: typeof data === 'string' && data.length ? JSON.stringify(data) : data,
	});
};
