'use strict';

const EventEmitter = require('node:events');
const { Requester } = require('../utils');

class RestClient extends EventEmitter {
	constructor () {
		super();
	}

	makeRequest (endpoint, method = 'GET', data = undefined) {
		return Requester.create(this, endpoint, method, true, data);
	}

	login (token) {
		if (!token || typeof token !== 'string') {throw new Error('No valid token was provided.');}

		this.token = token;
	}
}

module.exports = RestClient;
