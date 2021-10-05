const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { verifyForStatusCode, verifyForJSONStatusCode } = require('./CheckAPIError');
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
	}).then(async (response) => {
		let json;
		try {
			json = await response.json();
		}
		catch {
			verifyForStatusCode(`${apiUrl(client.options.apiVersion)}${endpoint}`, data, response.status);
			return response;
		}

		if (json.code) verifyForJSONStatusCode(json, `${apiUrl(client.options.apiVersion)}${endpoint}`, data);
		verifyForStatusCode(`${apiUrl(client.options.apiVersion)}${endpoint}`, data, response.status);
		return json;
	});
};
