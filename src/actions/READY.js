'use strict';

const User = require('../structures/User');

module.exports.handle = (client, { session_id, user }) => {
  client.user = new User(client, user);
  client.users.cache.set(client.user.id, client.user);
  client.api.sessionId = session_id;

  setTimeout(() => {
    client.emit('ready', client.user);
    client.ready = true;
  }, 5000).unref();
};
