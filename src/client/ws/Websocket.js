const WS = require('ws');
const Endpoints = require('../../constants/DiscordEndpoints');
const Parser = require('./parser');

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
		this.connection.on('close', (code) => Parser.close(this.client, code));
		this.connection.on('error', (error) => Parser.error(this.client, error));
		this.connection.on('open', () => Parser.open(this.client));
	}
};

module.exports = WebSocket;
