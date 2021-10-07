'use strict';

const WebSocket = require('ws');
const Endpoints = require('../../constants/DiscordEndpoints');
const Parser = require('./Parser');

class WebSocketManager {
	constructor (client) {
		this.client = client;
	}

	connect () {
		this.connection = new WebSocket(Endpoints.gatewayUrl(this.client.options.apiVersion, 'json'));
		this.prepareEvents();
	}

	prepareEvents () {
		this.connection.on('message', (message) => Parser.message(this.client, message));
	}
};

module.exports = WebSocketManager;
