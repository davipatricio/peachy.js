const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { apiUrl } = require('../constants/DiscordEndpoints');

module.exports.create = async (client, endpoint, method = 'GET', parseHeaders = true, data = '', headers = {}) => {
	if (parseHeaders) {
		headers = Object.assign({
			'Authorization': `Bot ${client.token}`,
			'Content-Type': 'application/json',
			'User-Agent': 'DiscordBot (https://github.com/DenkyLabs/peachy.js/, 0.0.1)',
		}, headers);
	}
	const body = typeof data === 'object' ? JSON.stringify(data) : data;

	return fetch(`${apiUrl(client.options.apiVersion)}${endpoint}`, {
		method,
		headers,
		body,
	}).then((response) => {
		if (response.status === 403) throw new Error('Missing Permissions');
		return response;
	});
};
