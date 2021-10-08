'use strict';

function sendIdentify (client) {
	const IdentifyPayload = {
		op: 2,
		d: {
			large_threshold: client.options.large_threshold,
			compress: false,
			shards: [client.options.shardId, client.options.shardCount],
			token: client.token,
			intents: client.options.intents,
			properties: client.options.properties,
		},
	};

	client.ws.connection?.send(JSON.stringify(IdentifyPayload));
}

function sendResume (client) {
	const ResumePayload = {
		op: 6,
		d: {
			token: client.token,
			session_id: client.api.sessionId,
			seq: client.api.sequence,
		},
	};

	client.ws.connection?.send(JSON.stringify(ResumePayload));
}


module.exports = {
	sendIdentify,
	sendResume,
};
