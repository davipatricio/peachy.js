'use strict';

/**
 * Represents a rich embed in a message
 * @class
 * @property {string} [title] Title of the embed
 * @property {string} [description] Description of the embed
 * @property {string} [url] URL of the embed
 * @property {string} [timestamp] Timestamp of the embed
 * @property {string} [color] Color of the embed
 * @property {Object} [footer] Footer of the embed
 * @property {string} [footer.text] Text of the footer
 * @property {string} [footer.icon_url] Icon of the footer
 * @property {Object} [image] Image of the embed
 * @property {string} [image.url] URL of the image
 * @property {Object} [thumbnail] Thumbnail of the embed
 * @property {string} [thumbnail.url] URL of the thumbnail
 * @property {Array<object>} [fields] Fields of the embed
 * @property {string} [fields.name] Name of the field
 * @property {string} [fields.value] Value of the field
 * @property {boolean} [fields.inline] Whether the field is inline
 * @property {Object} [author] Author of the embed
 * @property {string} [author.name] Name of the author
 * @property {string} [author.url] URL of the author
 * @property {string} [author.icon_url] Icon of the author
 */
class MessageEmbed {
  constructor(data = {}) {
    this.title = data.title ?? null;
    this.description = data.description ?? null;
    this.url = data.url ?? null;
    this.timestamp = data.timestamp ?? null;
    this.color = data.color ?? null;
    this.footer = data.footer ?? null;
    this.image = data.image ?? null;
    this.thumbnail = data.thumbnail ?? null;
    this.author = data.author ?? null;
    this.fields = data.fields ?? [];
  }

  /**
   * Sets the author of this embed
   * @param {string|null} name - The name of the author
   * @param {string|null} icon_url - The icon URL of the author
   * @param {string|null} url - The URL of the author
   * @example
   * embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
   * @returns {MessageEmbed}
   */
  setAuthor(name = null, icon_url = '', url = '') {
    this.author = { name, icon_url, url };
    return this;
  }

  /**
   * Sets the title of this embed
   * @param {string|null} title - The title of the embed
   * @example
   * embed.setTitle('This is the title!')
   * @returns {MessageEmbed}
   */
  setTitle(title = null) {
    this.title = title;
    return this;
  }

  /**
   * Sets the description of this embed
   * @param {string|null} description - The description of the embed
   * @example
   * embed.setTitle('This is the description!')
   * @returns {MessageEmbed}
   */
  setDescription(description = null) {
    this.description = description;
    return this;
  }

  /**
   * Sets the URL of this embed
   * @param {string|null} url - The URL of the embed
   * @example
   * embed.setTitle('Click to see the documentation')
   * embed.setURL('https://peachy-js.vercel.app')
   * @returns {MessageEmbed}
   */
  setURL(url = null) {
    this.url = url;
    return this;
  }

  /**
   * Sets the timestamp of this embed
   * @param {number|null} [timestamp=Date.now()] - The timestamp of the embed
   * @example
   * embed.setTimestamp(Date.now())
   * @returns {MessageEmbed}
   */
  setTimestamp(timestamp = Date.now()) {
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Sets the color of this embed
   * @param {number|null} color - The color of the embed
   * @example
   * embed.setColor(3093151)
   * @returns {MessageEmbed}
   */
  setColor(color = null) {
    this.color = color;
    return this;
  }

  /**
   * Sets the footer of this embed
   * @param {string|null} text - The text of the footer
   * @param {string|null} icon_url - The icon of the footer
   * @example
   * embed.setFooter(`Command ran by: ${message.author.tag}`)
   * @returns {MessageEmbed}
   */
  setFooter(text = null, icon_url = null) {
    this.footer = { text, icon_url };
    return this;
  }

  /**
   * Sets the image of this embed
   * @param {string|null} url - The URL of the image
   * @example
   * embed.setImage(message.author.displayAvatarURL())
   * @returns {MessageEmbed}
   */
  setImage(url = null) {
    this.image = { url };
    return this;
  }

  /**
   * Sets the thumbnail of this embed
   * @param {string|null} url - The URL of the thumbnail
   * @example
   * embed.setThumbnail(message.author.displayAvatarURL())
   * @returns {MessageEmbed}
   */
  setThumbnail(url = null) {
    this.thumbnail = { url };
    return this;
  }

  /**
   * Add a field to this embed
   * @param {string} name - The name of the field
   * @param {string} value - The value of the field
   * @param {boolean} [inline=false] - Whether the field is inline
   * @example
   * embed.addField('Server ID:', `**${message.guild.id}**`)
   * @returns {MessageEmbed}
   */
  addField(name, value, inline = false) {
    if (!this.fields) this.fields = [];
    this.fields.push({ name, value, inline });
    return this;
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      url: this.url,
      timestamp: this.timestamp,
      color: this.color,
      footer: this.footer,
      image: this.image,
      thumbnail: this.thumbnail,
      fields: this.fields,
    };
  }
}

module.exports = MessageEmbed;
