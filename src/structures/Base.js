class Base {
  constructor(client, id) {
    this.id = id;
    this._client = client;
  }

  get createdAt() {
    return Base.createdAt(this.id);
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  toJSON(...props) {
    const json = {};

    if (this.id) {
      json.id = id;
      json.createdAt = this.createdAt;
    }

    for (const prop of props) {
      const value = this[prop];
      const type = typeof value;

      if (value === undefined) {
        continue;
      } else if ((type !== 'object' && type !== 'function' && type !== 'bigint') || value === null) {
        json[prop] = value;
      } else if (value.toJSON !== undefined) {
        json[prop] = value.toJSON();
      } else if (value.values !== undefined) {
        json[prop] = [...value.values()];
      } else if (type === 'bigint') {
        json[prop] = value.toString();
      } else if (type === 'object') {
        json[prop] = value;
      }
    }

    return json;
  }

  parseData(data) {
    if (!data || !data.id) return;
    this.id = data.id;
    return this;
  }

  _update(data) {
    const clone = this._clone();
    this.parseData?.(data);
    return clone;
  }

  toString() {
    return `[${this.constructor.name} (${this.id})]`;
  }

  valueOf() {
    return this.id;
  }
}

Base.createdAt = id => Math.round(id / 4194304) + 1420070400000;

module.exports = Base;
