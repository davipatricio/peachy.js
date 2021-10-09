'use strict';

const WebSocket = require('ws');
const Heartbeater = require('./Heartbeater');
const Parser = require('./Parser');
const Endpoints = require('../../constants/DiscordEndpoints');

class WebSocketManager {
  constructor(client) {
    this._client = client;
  }

  connect() {
    this.connection = new WebSocket(Endpoints.gatewayUrl(this._client.options.apiVersion, 'json'));
    this.connection.on('message', message => Parser.message(this._client, message));

    this.connection.on('close', code => {
      if (!this._client.options.autoReconnect) return;
      switch (code) {
        // Discord WebSocket requesting client reconnect.
        case 1001:
          this.forceReconnect();
          break;
        case 4004:
          this._client.emit('debug', '[DEBUG] Received 4004 [Invalid Token], NOT attempting to reconnect.');
          throw new Error('DiscordAPIError: Invalid token.');
        case 4007:
          this._client.emit('debug', '[DEBUG] Received 4007 [Invalid Sequence], attempting to reconnect...');
          this.forceReconnect();
          break;
        case 4008:
          this._client.emit('debug', '[DEBUG] Received 4008 [Rate Limit], attempting to reconnect...');
          this.forceReconnect();
          break;
        case 4009:
          this._client.emit('debug', '[DEBUG] Received 4009 [Session Timeout], attempting to reconnect...');
          this.forceReconnect(false);
          break;
        case 4013:
          this._client.emit('debug', '[DEBUG] Received 4013 [Invalid Intents], NOT attempting to reconnect.');
          throw new Error('DiscordAPIError: Invalid intents.');
        case 4014:
          this._client.emit('debug', '[DEBUG] Received 4013 [Disallowed Intents], NOT attempting to reconnect.');
          throw new Error('DiscordAPIError: Disallowed intents.');
        default:
          this.forceReconnect(false);
          break;
      }
    });
  }

  forceReconnect(resume = true) {
    Heartbeater.stop(this._client);
    this.connection?.close(resume ? 4000 : 1000);
    this._client.api.sessionId = resume ? this._client.api.sessionId : null;

    this._client.reconnect();
    this._client.api.should_resume = resume;
  }
}

module.exports = WebSocketManager;
