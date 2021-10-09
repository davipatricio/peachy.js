'use strict';

const User = require('../structures/User');
const LimitedMap = require('../utils/LimitedMap');
const Requester = require('../utils/Requester');

class UserManager {
  constructor(client, limit) {
    this.cache = new LimitedMap(limit);
    this.client = client;
  }

  async fetch(id) {
    if (this.cache.has(id)) return this.cache.get(id);
    const data = await Requester.create(this.client, `/users/${id}`, 'GET', true);
    return new User(this.client, data);
  }
}

module.exports = UserManager;
