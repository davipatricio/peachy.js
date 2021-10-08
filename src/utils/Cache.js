const EmojiManager = require("../managers/EmojiManager");
const GuildChannelManager = require("../managers/GuildChannelManager");
const GuildManager = require("../managers/GuildManager");
const RoleManager = require("../managers/RoleManager");
const UserManager = require("../managers/UserManager");

function CacheMake(options = {}) {
  const Make = {};

  Make.options = {
    EmojiManager: options.EmojiManager ?? Infinity,
    GuildChannelManager: options.GuildChannelManager ?? Infinity,
    GuildManager: options.GuildManager ?? Infinity,
    RoleManager: options.RoleManager ?? Infinity,
    UserManager: options.UserManager ?? Infinity,
    GuildMemberManager: options.GuildMemberManager ?? Infinity
  };

  Make.EmojiManager = new EmojiManager(Make.options.EmojiManager);
  Make.GuildChannelManager = new GuildChannelManager(
    Make.options.GuildChannelManager
  );
  Make.GuildManager = new GuildManager(Make.options.GuildChannelManager);
  Make.RoleManager = new RoleManager(Make.options.RoleManager);
  Make.UserManager = new UserManager(Make.options.UserManager);
  return Make;
}

CacheMake.addToClient = (client, Make) => {
  client.guilds = Make.GuildManager;
  client.emojis = Make.GuildManager;
  client.users = Make.UserManager;
  client.channels = Make.GuildChannelManager;

  return client;
};

module.exports = CacheMake;
