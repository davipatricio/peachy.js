'use strict';

module.exports = {
  Client: require('./src/client/Client'),

  // Structures
  ClientUser: require('./src/structures/ClientUser'),
  CommandInteraction: require('./src/structures/CommandInteraction'),
  DataManager: require('./src/structures/DataManager'),
  Guild: require('./src/structures/Guild'),
  GuildMember: require('./src/structures/GuildMember'),
  Invite: require('./src/structures/Invite'),
  Message: require('./src/structures/Message'),
  MessageEmbed: require('./src/structures/MessageEmbed'),
  Role: require('./src/structures/Role'),
  TextChannel: require('./src/structures/TextChannel'),
  User: require('./src/structures/User'),

  // Managers
  ChannelManager: require('./src/managers/ChannelManager'),
  ChannelMessageManager: require('./src/managers/ChannelMessageManager'),
  EmojiManager: require('./src/managers/EmojiManager'),
  GuildChannelManager: require('./src/managers/GuildChannelManager'),
  GuildManager: require('./src/managers/GuildManager'),
  RoleManager: require('./src/managers/RoleManager'),
  UserManager: require('./src/managers/UserManager'),

  // Other
  Utils: require('./src/utils/Utils'),
  version: require('./package.json').version,
};
