'use strict';

const User = require('../structures/User');
const BaseManager = require('./BaseManager');

class UserManager extends BaseManager {
	constructor (limit) {
		super(User, limit);
	}
}

module.exports = UserManager;
