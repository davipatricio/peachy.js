'use strict';

const BaseManager = require('./BaseManager');
class UserManager extends BaseManager {
	constructor (limit) {
		super(limit);
	}
}

module.exports = UserManager;
