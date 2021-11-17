'use strict';

const MessageEmbed = require('../structures/MessageEmbed');

class APIMessage extends null {
  /**
   * @param {Object} data - Custom message data to transform.
   * @returns {Object} - Raw message data to send to Discord.
   */
  static transform(data) {
    if (!data) throw new Error('Data should not be empty.');
    data.embeds?.map(embed => (embed instanceof MessageEmbed ? embed.toJSON() : embed));
    data.content ??= '';
    data.tts ??= false;

    return data;
  }
}

module.exports = APIMessage;
