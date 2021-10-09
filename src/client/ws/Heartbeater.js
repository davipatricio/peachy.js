'use strict';

function sendImmediately(client) {
  const heartbeatData = {
    op: 1,
    d: client.api.sequence,
  };

  client.ws.connection?.send(JSON.stringify(heartbeatData));
  client.emit('debug', '[DEBUG] Sent heartbeat to Discord.');
}

function start(client) {
  // We don't want a lot of intervals send heartbeats
  // So we use a single interval to do this task
  if (client.api.heartbeat_timer) return;

  client.api.heartbeat_timer = setInterval(() => {
    // If Discord didn't respond to our last heartbeat, we shouldn't send more heartbeats
    // The library itself will handle the reconnection
    if (!client.api.heartbeat_acked) return;

    const heartbeatData = {
      op: 1,
      d: client.api.sequence,
    };

    client.api.last_heartbeat = Date.now();
    client.api.heartbeat_acked = false;

    client.ws.connection?.send(JSON.stringify(heartbeatData));
    client.emit('debug', '[DEBUG] Sent heartbeat to Discord.');

    // The client should receive an ACK in less than 15 seconds
    // If not, it should disconnect and reconnect and send Resume command
    setTimeout(() => {
      if (!client.api.heartbeat_acked) {
        client.emit('debug', "[DEBUG] Heartbeat wasn't acked in 15 seconds. Reconnecting...");

        // Close the connection with a non-1000 code so we can reconnect with the stored session id
        client.ws.connection?.close(4000);
        client.reconnect();
      }
    }, 15_000).unref();
  }, client.api.heartbeat_interval).unref();
}

function stop(client) {
  if (client.api.heartbeat_timer) clearInterval(client.api.heartbeat_timer);
  client.api.heartbeat_timer ??= null;
}

module.exports = {
  start,
  stop,
  sendImmediately,
};
