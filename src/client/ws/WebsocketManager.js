'use strict';

const WebSocket = require('ws');
const Heartbeater = require('./Heartbeater');
const Parser = require('./Parser');
const Endpoints = require('../../constants/DiscordEndpoints');

class WebSocketManager {
  constructor(client) {
    this.client = client;
  }

  connect() {
    this.connection = new WebSocket(Endpoints.gatewayUrl(this.client.options.apiVersion, 'json'));
    this.connection.on('message', message => Parser.message(this.client, message));

    this.connection.on('close', code => {
      if (!this.client.options.autoReconnect) return;
      switch (code) {
        // Discord WebSocket requesting client reconnect.
        case 1001:
          this.forceReconnect();
          break;
        case 4004:
          this.client.emit('debug', '[DEBUG] Received 4004 [Invalid Token], NOT attempting to reconnect.');
          throw new Error('DiscordAPIError: Invalid token.');
        case 4007:
          this.client.emit('debug', '[DEBUG] Received 4007 [Invalid Sequence], attempting to reconnect...');
          this.forceReconnect();
          break;
        case 4008:
          this.client.emit('debug', '[DEBUG] Received 4008 [Rate Limit], attempting to reconnect...');
          this.forceReconnect();
          break;
        case 4009:
          this.client.emit('debug', '[DEBUG] Received 4009 [Session Timeout], attempting to reconnect...');
          this.forceReconnect(false);
          break;
        case 4013:
          this.client.emit('debug', '[DEBUG] Received 4013 [Invalid Intents], NOT attempting to reconnect.');
          throw new Error('DiscordAPIError: Invalid intents.');
        case 4014:
          this.client.emit('debug', '[DEBUG] Received 4013 [Disallowed Intents], NOT attempting to reconnect.');
          throw new Error('DiscordAPIError: Disallowed intents.');
        default:
          this.forceReconnect(false);
          break;
      }
    });
  }

  forceReconnect(resume = true) {
    Heartbeater.stop(this.client);
    this.connection?.close(resume ? 4000 : 1000);
    this.client.api.sessionId = resume ? this.client.api.sessionId : null;

    this.client.reconnect();
    this.client.api.should_resume = resume;
  }
}

module.exports = WebSocketManager;
