'use strict';

function exportMethods(methods, extra) {
  var methodName, methodPath;

  for (const method of methods) {
    methodName = method.split('/').slice(-1);
    methodPath = method;
    module.exports[methodName] = require(methodPath);
  }

  for (const ex of extra) {
    module.exports[ex[0]] = ex[1];
  }
}

exportMethods(
  [
    // Client
    './src/client/RestClient',
    './src/client/Client',

    // Strucures
    './src/structures/MessageEmbed',
    './src/structures/Guild',
    './src/structures/Message',
    './src/structures/TextChannel',
    './src/structures/User',

    // Managers
    './src/managers/EmojiManager',
    './src/managers/GuildManager',
    './src/managers/GuildChannelManager',
    './src/managers/RoleManager',
    './src/managers/UserManager',

    // Utils
    './src/utils/Utils',
    './src/Utils/Requester',
    './src/Utils/LimitedMap',
    './src/Utils/Intents',
    './src/Utils/CacheFactory',
  ],
  [['version', require('./package.json').version]],
);
