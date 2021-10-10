'use strict';

const Base = require('../structures/Base');
const LimitedMap = require('../utils/LimitedMap');
const { isConstructor } = require('../utils/Utils');

class BaseManager {
  constructor(base, limit = Infinity, url, client) {
    this.cache = new LimitedMap(limit);
    this.base = base;

    if (url) this._url = url;
    if (client) this._client = client;
  }

  _add(data, ...extra) {
    if (isConstructor(data, extra)) {
      data = new this.base(data, extra);
    }

    if (typeof data.id !== 'string') throw new Error('Invalid data id.');

    return this.cache.set(data.id, data);
  }

  fetch(options) {
    let id = typeof options === 'string' ? options : options.id;

    const checkClientAndURL = action => {
      if (!this._url || !this._client) return null;
      else return action;
    };

    if (options.getFromCache && this.cache.has(id)) {
      return this.cache.get(id);
    } else if (options.forge) {
      return checkClientAndURL(
        this._client.makeRequest(this._url + id).then(data => new this.base(this._client, data)),
      );
    }

    return checkClientAndURL(this._client.makeRequest(this._url + id));
  }

  forge(options) {
    return this.fetch({
      getFromCache: true,
      forge: true,
      id: typeof options === 'string' ? options : options.id,
    });
  }

  toString() {
    return `Manager(${this.base.name})`;
  }

  toJSON() {
    return Base.prototype.toJSON.call(this, 'fetch', 'forge', '_url');
  }

  _clone() {
    return Base.prototype._clone.call(this);
  }
}

module.exports = BaseManager;
