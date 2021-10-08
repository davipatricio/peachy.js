'use strict';

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { verifyForStatusCode, verifyForJSONStatusCode } = require('./CheckAPIError');
const { apiUrl } = require('../constants/DiscordEndpoints');

// "data" defaults to undefined because GET requests don't have a body
module.exports.create = async (client, endpoint, method = 'GET', parseHeaders = true, data = undefined, headers = {}) => {
	if (parseHeaders) {
		headers = Object.assign({
			'Authorization': `Bot ${client.token}`,
			'Content-Type': 'application/json',
			'User-Agent': `DiscordBot (https://github.com/DenkyLabs/peachy.js/, ${require('../../index').version})`,
		}, headers);
	}

	const body = typeof data === 'object' ? JSON.stringify(data) : data;
	const fetchData = await fetch(`${apiUrl(client.options.apiVersion)}${endpoint}`, {
		method,
		headers,
		body,
	});

	let json = null;
	try {
		json = await fetchData.json();
	}
	catch {
		verifyForStatusCode(`${apiUrl(client.options.apiVersion)}${endpoint}`, data, fetchData.status);
		return fetchData;
	}

	// Verify if an error code was returned from Discord API
	// If there was an error, one of the following methods will throw an error
	if (json.code) verifyForJSONStatusCode(json, `${apiUrl(client.options.apiVersion)}${endpoint}`, data);
	verifyForStatusCode(`${apiUrl(client.options.apiVersion)}${endpoint}`, data, fetchData.status);

	return json;
};
