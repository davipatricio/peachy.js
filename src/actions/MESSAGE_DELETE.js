'use strict';

module.exports.handle = (client, data) => {
  const channel = client.channels.cache.get(data.channel_id);
  const message = channel?.messages.cache.get(data.id);
  if (message) message.deleted = true;
  client.emit('messageDelete', message ?? data);
};
