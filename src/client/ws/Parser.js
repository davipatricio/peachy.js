'use strict';

const Heartbeat = require('./Heartbeater');
const Payloads = require('./Payloads');

function message (client, rawData) {
	const data = JSON.parse(rawData);

	const opcode = data.op;
	const eventData = data.d;
	const eventName = data.t;
	const sequence = data.s;

	// If the client is reconnecting/resuming, we don't want to override the last sequence number
	if (!client.reconnecting) client.api.sequence = sequence ?? null;

	switch (opcode) {
		// General Gateway Events (GUILD_CREATE, GUILD_DELETE etc)
		case 0:
			client.actions.loaded[eventName]?.handle(client, eventData);
			break;

		// Invalid session (we should reconnect and resume)
		case 9:
			if (client.api.should_resume) return;
			client.ws.connection.close(4000);
			Heartbeat.stop(client);
			client.reconnect();
			break;

		// Gateway HELLO event
		case 10:
			client.reconnecting = false;

			// Here we should resume the session if we have a pending resume request
			if (client.api.should_resume) {
				Payloads.sendResume(client);
				client.api.should_resume = false;
				client.api.heartbeat_interval = eventData.heartbeat_interval;
				client.emit('debug', `[DEBUG] Defined heartbeat to ${eventData.heartbeat_interval}ms. Starting to Heartbeat.`);

				// Because we're starting to heartbeat, we need to say that the last heartbeat was acked.
				client.api.heartbeat_acked = true;
				client.ready = true;
				Heartbeat.start(client);
				return Heartbeat.sendImmediately(client);
			}

			client.api.heartbeat_interval = eventData.heartbeat_interval;
			client.emit('debug', `[DEBUG] Defined heartbeat to ${eventData.heartbeat_interval}ms. Starting to Heartbeat.`);

			// Because we're starting to heartbeat, we need to say that the last heartbeat was acked.
			client.api.heartbeat_acked = true;

			Heartbeat.start(client);
			Payloads.sendIdentify(client);
			break;

		// Gateway HEARTBEAT ACK
		case 11:
			client.emit('debug', '[DEBUG] Received heartbeat ACK.');
			client.api.last_heartbeat_ack = Date.now();

			// Mark that we've received the heartbeat ACK so we can send more heartbeats.
			client.api.heartbeat_acked = true;
			client.ping = client.api.last_heartbeat_ack - client.api.last_heartbeat;
			break;
	}
}

module.exports = {
	message,
};
