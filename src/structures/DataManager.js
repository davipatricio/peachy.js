'use strict';

class DataManager {
  constructor(client) {
    this.client = client;
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _update(data, ...params) {
    const clone = this._clone();
    this.parseData?.(data, params);
    return clone;
  }
}

module.exports = DataManager;
