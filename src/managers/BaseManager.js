const { isConstructor } = require("../utils");
const LimitedMap = require("../utils/LimitedMap");

class BaseManager {
  constructor(base, limit = Infinity, url) {
    this.cache = new LimitedMap(limit);
    this.base = base;

    if (url) this.url = url;
  }

  _add(data, ...extra) {
    if (isConstructor(data, extra)) {
      data = new this.base(data, extra);
    }

    if (typeof data.id !== "string") throw new Error("Invalid data id.");

    return this.cache.set(data.id, data);
  }

  fetch() {
    return;
  }
  forge() {}
}

module.exports = BaseManager;
