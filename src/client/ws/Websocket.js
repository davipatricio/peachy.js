'use strict';

const WS = require('ws');
const Endpoints = require('../../constants/DiscordEndpoints');
const Parser = require('./Parser');

class WebSocket {
	constructor (client) {
		this.client = client;
	}

	async connect () {
		this.connection = new WS(Endpoints.gatewayUrl(this.client.options.apiVersion, 'json'));
		this.prepareEvents();
		return null;
	}

	prepareEvents () {
		this.connection.on('message', (message) => Parser.message(this.client, message));
	}
};

module.exports = WebSocket;
