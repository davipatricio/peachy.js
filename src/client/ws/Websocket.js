const WS = require('ws');
const Endpoints = require('../../constants/DiscordEndpoints');
const Parser = require('./Parser');

class WebSocket {
	constructor (client) {
		this.client = client;
	}

	async connect () {
		this.connection = new WS(Endpoints.gatewayUrl(9, 'json'));
		this.prepareEvents();
	}

	prepareEvents () {
		this.connection.on('message', (message) => Parser.message(this.client, message));
	}
};

module.exports = WebSocket;
