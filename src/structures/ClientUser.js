'use strict';

const User = require('./User');

class ClientUser extends User {
  constructor(client, data) {
    super(client, data);
    super.parseData(data);
  }

  setAFK(afk = true) {
    this.setPresence({ afk });
  }

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

  // https://discord.com/developers/docs/topics/gateway#activity-object
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
