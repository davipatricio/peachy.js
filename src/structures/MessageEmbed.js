'use strict';

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

  setAuthor(name, icon = '', url = '') {
    this.author = { name, icon, url };
    return this;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setTimestamp(timestamp = Date.now()) {
    this.timestamp = timestamp;
    return this;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  setFooter(text = null, icon_url = null) {
    this.footer = { text, icon_url };
    return this;
  }

  setImage(url = null) {
    this.image = { url };
    return this;
  }

  setThumbnail(url = null) {
    this.thumbnail = { url };
    return this;
  }

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
