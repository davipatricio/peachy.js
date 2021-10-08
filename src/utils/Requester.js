'use strict';

const DiscordRequest = require('discord-request');
const {
	verifyForStatusCode,
	verifyForJSONStatusCode,
} = require('./CheckAPIError');
const { apiUrl } = require('../constants/DiscordEndpoints');

module.exports.create = async (
	client,
	endpoint,
	method = 'GET',
	parseHeaders = true,
	data = undefined,
	headers = {},
) => {
	if (parseHeaders) {
		headers = Object.assign(
			{
				'Authorization': `Bot ${client.token}`,
				'Content-Type': 'application/json',
				'User-Agent': `DiscordBot (https://github.com/DenkyLabs/peachy.js/, ${
					require('../../package.json').version
				})`,
			},
			headers,
		);
	}

	const request = new DiscordRequest(client.token, {
		headers,
		version: client.options.apiVersion,
	});

	const fetchData = await request.request(endpoint, {
		method,
		body: data,
	});

	let json = null;
	try {
		json = fetchData;
	}
	catch {
		verifyForStatusCode(
			`${apiUrl(client.options.apiVersion)}${endpoint}`,
			data,
			fetchData.statusCode,
		);
		return fetchData;
	}

	// Verify if an error code was returned
	// If there was an error, one of the following methods will throw an error
	if (json.code) {
		verifyForJSONStatusCode(
			json,
			`${apiUrl(client.options.apiVersion)}${endpoint}`,
			data,
		);
	}

	verifyForStatusCode(
		`${apiUrl(client.options.apiVersion)}${endpoint}`,
		data,
		fetchData.statusCode,
	);

	return json;
};
