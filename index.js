'use strict';

module.exports = {
  Client: require('./src/client/Client'),

  // Structures
  MessageEmbed: require('./src/structures/MessageEmbed'),
  Guild: require('./src/structures/Guild'),
  Message: require('./src/structures/Message'),
  TextChannel: require('./src/structures/TextChannel'),
  User: require('./src/structures/User'),

  // Managers
  EmojiManager: require('./src/managers/EmojiManager'),
  GuildManager: require('./src/managers/GuildManager'),
  GuildChannelManager: require('./src/managers/GuildChannelManager'),
  RoleManager: require('./src/managers/RoleManager'),
  UserManager: require('./src/managers/UserManager'),

  // Other
  Utils: require('./src/utils/Utils'),
  version: require('./package.json').version,
};
