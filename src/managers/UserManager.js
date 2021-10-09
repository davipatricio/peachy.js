'use strict';

const User = require('../structures/User');
const BaseManager = require('./BaseManager');

class UserManager extends BaseManager {
  constructor(client, limit) {
    super(User, limit, '/users/', client);
  }
}

module.exports = UserManager;
