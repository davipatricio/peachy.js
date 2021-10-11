/**
 * @typedef {Object} ImageOptions - Image options object
 * @property {string} [format='png'] - Image format
 * @property {string} [size=2048] - Image size (any power of two between 16 and 4096)
 */

/**
 * @typedef {Object} AllowedMentions Allowed mentions object
 * @property {Array<string>} [allowedMentions.parse=['users', 'roles', 'everyone']] - Types of mentions to be parsed
 * @property {Array<string>} [allowedMentions.users=[]] - Snowflakes of Users to be parsed as mentions
 * @property {Array<string>} [allowedMentions.roles=[]] - Snowflakes of Roles to be parsed as mentions
 * @property {boolean} [AllowedMentions.replied_user=true] - Whether the author of the Message being replied to should be pinged
 */

/**
 * @typedef {Object} CacheFactory - Default cache options
 * @property {number} [CacheFactory.ChannelManager=Infinity] - How many channels will be cached
 * @property {number} [CacheFactory.ChannelMessageManager=Infinity] - How many messages will be cached
 * @property {number} [CacheFactory.EmojiManager=Infinity] - How many emojis will be cached
 * @property {number} [CacheFactory.GuildChannelManage=Infinity] - How many guild channels will be cached
 * @property {number} [CacheFactory.GuildManager=Infinity] - How many guilds will be cached
 * @property {number} [CacheFactory.GuildMemberManager=Infinity] - How many members will be cached
 * @property {number} [CacheFactory.RoleManager=Infinity] - How many roles will be cached
 * @property {number} [CacheFactory.UserManager=Infinity] - How many users will be cached.
 */
