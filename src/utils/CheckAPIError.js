'use strict';

module.exports.verifyForStatusCode = (endpoint, data, code) => {
	switch (code) {
		case 403: throw new Error(`DiscordAPIError: Missing Permissions (403)\nEndpoint: ${endpoint}\nData: ${data ?? 'empty'}`);
		case 401: throw new Error(`DiscordAPIError: Not Authorized (401)\nEndpoint: ${endpoint}\nData: ${data ?? 'empty'}`);
		case 404: throw new Error(`DiscordAPIError: Not Found (404)\nEndpoint: ${endpoint}\nData: ${data ?? 'empty'}`);
		case 400: throw new Error(`DiscordAPIError: Bad Request (400)\nEndpoint: ${endpoint}\nData: ${data ?? 'empty'}`);
	};
};

module.exports.verifyForJSONStatusCode = (jsonResponse, endpoint, data) => {
	if (jsonResponse.code) {
		throw new Error(`DiscordAPIError: ${jsonResponse.message} (${jsonResponse.code})\nEndpoint: ${endpoint}\nData: ${typeof data === 'object' ? JSON.stringify(data) : data ?? 'empty'}`);
	}
};
