
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
