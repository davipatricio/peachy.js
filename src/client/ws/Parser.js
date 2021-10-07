'use strict';

const Heartbeat = require('./Heartbeater');
const Payloads = require('./Payloads');

function message (client, rawData) {
	const data = JSON.parse(rawData);

	const opcode = data.op;
	const eventData = data.d;
	const eventName = data.t;
	const sequence = data.s;

	client.api.sequence = sequence ?? null;

	switch (opcode) {
		// General Gateway Events
		case 0:
			client.actions.loaded[eventName]?.handle(client, eventData);
			break;

		// Gateway HELLO event
		case 10:
			client.api.heartbeat_interval = eventData.heartbeat_interval;
			client.emit('debug', `Defined heartbeat to ${eventData.heartbeat_interval}ms. Starting to Heartbeat.`);
			client.emit('connecting');
			Heartbeat.start(client, data);
			if (!client.logged_in) Payloads.sendIdentify(client);
			break;

		// Gateway HEARTBEAT ACK
		case 11:
			client.emit('debug', 'Received heartbeat ACK.');
			client.api.last_heartbeat_ack = Date.now();
			client.ping = client.api.last_heartbeat_ack - client.api.last_heartbeat;
			break;
	}
}

module.exports = {
	message,
};
