'use strict';

class DataManager {
  constructor(client) {
    this.client = client;
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _update(data) {
    const clone = this._clone();
    this.parseData?.(data);
    return clone;
  }
}

module.exports = DataManager;
