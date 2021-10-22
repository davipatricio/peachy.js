/**
 * @typedef {Object} ImageOptions - Image options object
 * @property {string} [format='png'] - Image format
 * @property {string} [size=2048] - Image size (any power of two between 16 and 4096)
 */

/**
 * @typedef {Object} AllowedMentions Allowed mentions object
 * @property {Array<string>} [parse=['users', 'roles', 'everyone']] - Types of mentions to be parsed
 * @property {Array<string>} [users=[]] - Snowflakes of Users to be parsed as mentions
 * @property {Array<string>} [roles=[]] - Snowflakes of Roles to be parsed as mentions
 * @property {boolean} [replied_user=true] - Whether the author of the Message being replied to should be pinged
 */

/**
 * @typedef {Object} CacheFactory - Default cache options
 * @property {number} [ChannelManager=Infinity] - How many channels will be cached
 * @property {number} [ChannelMessageManager=Infinity] - How many messages will be cached
 * @property {number} [EmojiManager=Infinity] - How many emojis will be cached
 * @property {number} [GuildChannelManager=Infinity] - How many guild channels will be cached
 * @property {number} [GuildManager=Infinity] - How many guilds will be cached
 * @property {number} [GuildMemberManager=Infinity] - How many members will be cached
 * @property {number} [RoleManager=Infinity] - How many roles will be cached
 * @property {number} [UserManager=Infinity] - How many users will be cached.
 */

/**
 * @typedef {Object} PresenceData
 * @property {?number} [since] - unix time (in milliseconds) of when the client went idle, or null if the client is not idle
 * @property {Array<Activity>} activities - array of {@link Activity|activity objects}
 * @property {ActivityStatus} status - the user's new {@link ActivityStatus|status}
 * @property {boolean} [afk] - whether or not the client is afk
 */

/**
 * @typedef {Object} Activity
 * @property {number} type - {@link https://discord.com/developers/docs/topics/gateway#activity-object-activity-types|activity type}
 * @property {string} name - the activity's name
 * @property {?string} [url] - stream url, is validated when type is 1
 */

/**
 * @typedef {string} ActivityStatus "online" | "idle" | "dnd" | "invisible" | "offline"
 */
