'use strict';

const Role = require("../structures/Role");
const BaseManager = require("./BaseManager");


class RoleManager extends BaseManager {
	constructor (limit) {
		super(Role, limit)
	}
}

module.exports = RoleManager;
