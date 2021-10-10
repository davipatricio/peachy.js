'use strict';

const CommandInteraction = require('../structures/CommandInteraction');

module.exports.handle = (client, data) => {
  let interaction = null;
  console.log(data);
  switch (data.data.type) {
    // CHAT_INPUT (slash) command
    case 1: {
      interaction = new CommandInteraction(client, data);
      break;
    }
  }

  if (interaction) client.emit('interactionCreate', interaction);
};
