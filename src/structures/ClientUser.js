'use strict';

const User = require('./User');

/**
 * Represents the logged in client's Discord user
 * @extends User
 * @param {Client} client The instantiating client
 * @param {Object} data The raw data for the guild
 */
class ClientUser extends User {
  constructor(client, data) {
    super(client, data);
    super.parseData(data);
  }

  /**
   * Sets/removes the AFK flag for the client user
   * @param {boolean} [afk=true] - Whether or not the user is AFK
   */
  setAFK(afk = true) {
    this.setPresence({ afk });
  }

  /**
   * Sets the activity the client user is playing
   * @param {string} name Name of the activity being played
   * @param {number} [type=0] {@link https://discord.com/developers/docs/topics/gateway#activity-object-activity-types|activity type}
   * @see https://discord.com/developers/docs/game-sdk/activities#data-models-activitytype-enum
   */
  setActivity(name, type = 0) {
    this.setPresence({
      activities: [
        {
          type,
          name,
        },
      ],
    });
  }

  /**
   * Sets the full presence of the client user.
   * @param {PresenceData} [data={ activities = [], status = 'online', afk = false }] - Data for the presence
   * @see https://discord.com/developers/docs/topics/gateway#update-presence-gateway-presence-update-structure
   */
  setPresence({ activities = [], status = 'online', afk = false }) {
    const data = {
      op: 3,
      d: {
        activities,
        status,
        afk,
        since: null,
      },
    };
    this.client.ws.connection?.send(JSON.stringify(data));
  }
}

module.exports = ClientUser;
