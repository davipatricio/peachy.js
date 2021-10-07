'use strict';

function start (client) {
	if (client.api.heartbeat_timer) clearInterval(client.api.heartbeat_timer);
	client.api.heartbeat_timer = setInterval(() => {
		const heartbeatData = {
			op: 1,
			d: client.api.sequence,
		};

		client.api.last_heartbeat = Date.now();
		client.ws.connection.send(JSON.stringify(heartbeatData));
		client.emit('debug', 'Sent heartbeat to Discord.');
	}, client.api.heartbeat_interval).unref();
}

function stop (client) {
	if (client.api.heartbeat_timer) clearInterval(client.api.heartbeat_timer);
}


module.exports = {
	start,
	stop,
};
