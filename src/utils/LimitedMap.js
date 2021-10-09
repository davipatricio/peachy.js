'use strict';

class LimitedMap extends Map {
  constructor(limit) {
    super();
    this.limit = limit;
  }

  set(key, value) {
    if (this.limit <= 0) return value;
    if (this.size >= this.limit) {
      this.delete(this.keys().next().value);
    }

    super.set(key, value);
    return value;
  }

  keyArray() {
    return [...this.keys()];
  }

  valueArray() {
    return [...this.values()];
  }

  // Returns an array with random items
  random(items = 1) {
    if (items < 1 || this.size === 0) return [];
    if (items === 1) return this.valueArray()[Math.floor(Math.random() * this.size)];

    if (items > this.size) return this.valueArray();

    // Select N random items
    const keys = [];
    for (let i = 0; i < items; i++) {
      keys.push(this.keyArray()[Math.floor(Math.random() * this.size)]);
    }
    return keys;
  }
}

module.exports = LimitedMap;
