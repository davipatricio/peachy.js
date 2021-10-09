'use strict';

const MessageEmbed = require('../structures/MessageEmbed');

module.exports.transform = data => {
  if (data.embeds) {
    data.embeds?.map(embed => {
      if (embed instanceof MessageEmbed) {
        return embed.toJSON();
      }
      return embed;
    });
  }

  data.content ??= '';
  data.tts ??= false;

  return data;
};
