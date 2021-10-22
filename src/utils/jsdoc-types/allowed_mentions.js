/**
 * @typedef {Object} AllowedMentions Allowed mentions object
 * @property {Array<string>} [parse=['users', 'roles', 'everyone']] - Types of mentions to be parsed
 * @property {Array<string>} [users=[]] - Snowflakes of Users to be parsed as mentions
 * @property {Array<string>} [roles=[]] - Snowflakes of Roles to be parsed as mentions
 * @property {boolean} [replied_user=true] - Whether the author of the Message being replied to should be pinged
 */
