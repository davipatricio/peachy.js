'use strict';

const HTTPS = require('https');
const Zlib = require('zlib');

const { verifyForStatusCode, verifyForJSONStatusCode } = require('./CheckAPIError');
const { apiUrl } = require('../constants/DiscordEndpoints');

// "data" defaults to undefined because GET requests don't have a body
module.exports.create = async (
  client,
  endpoint,
  method = 'GET',
  parseHeaders = true,
  data = undefined,
  headers = {},
) => {
  let parsedHeaders = headers;
  if (parseHeaders) {
    parsedHeaders = {
      Authorization: `Bot ${client.token}`,
      'Content-Type': 'application/json',
      'User-Agent': `DiscordBot (https://github.com/DenkyLabs/peachy.js/, ${require('../../package.json').version})`,
      ...headers,
    };
  }

  const body = typeof data === 'object' ? JSON.stringify(data) : data;
  const fetchData = await new Requester(client.token, {
    headers: parsedHeaders,
  }).request(endpoint, {
    method,
    body,
  });

  let json = null;
  try {
    json = fetchData;
  } catch {
    verifyForStatusCode(`${apiUrl(client.options.apiVersion)}${endpoint}`, data, fetchData.statusCode);
    return fetchData;
  }

  // Verify if an error code was returned from Discord API
  // If there was an error, one of the following methods will throw an error
  if (json.message || json.code) verifyForJSONStatusCode(json, `${apiUrl(client.options.apiVersion)}${endpoint}`, data, method);
  
  verifyForStatusCode(`${apiUrl(client.options.apiVersion)}${endpoint}`, data, fetchData.statusCode, method);

  return json;
};

class MultipartData {
  constructor(boundaryName) {
    this.buffers = [];
    this._boundary = `----------------${boundaryName}`;
  }

  append(name, data, filename) {
    var str = `\r
    --${this._boundary}\r
    Content-Disposition: form-data; name="${name}"`;

    if (filename) str += `; filename="${filename}"`;

    if (ArrayBuffer.isView(data)) {
      str += '\r\nContent-Type: application/octet-stream';
      if (!(data instanceof Uint8Array)) data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    } else if (typeof data === 'object') {
      str += '\r\nContent-Type: application/json';
      data = Buffer.from(JSON.stringify(data));
    } else {
      data = Buffer.from(`${data}`);
    }
    this.buffers.push(Buffer.from(`${str}\r\n\r\n`));
    this.buffers.push(data);
  }

  finish() {
    this.buffers.push(Buffer.from(`\r\n--${this.boundary}--`));
    return this.buffers;
  }
}

module.exports.MultipartData = MultipartData;

class Requester {
  constructor(token, options) {
    this.restVersion = options.version ?? 9;
    this.url = `/api/v${String(this.restVersion)}`;
    this.domain = options.domain ?? 'discord.com';
    this.timeout = options.requestTimeout ?? 15000;
    this._headers = options.headers;
    this._token = token;
  }

  request(endpoint, options) {
    options = {
      auth: options?.auth ?? true,
      method: options?.method ?? 'GET',
      body: typeof options?.body === 'object' ? JSON.stringify(options.body) : options?.body,
    };

    return new Promise((resolve, reject) => {
      let body = options?.body;
      const url = `${this.url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

      const req = HTTPS.request(
        {
          path: url,
          hostname: this.domain,
          auth: options?.auth ? this._token : null,
          headers: this._headers,
          method: options?.method,
          timeout: this.timeout,
        },
        res => {
          let data = '';

          let _res = res;
          if (res.headers['content-encoding']?.includes('gzip')) {
            _res = res.pipe(Zlib.createGunzip());
          } else if (res.headers['content-encoding']?.includes('deflate')) {
            _res = res.pipe(Zlib.createInflate());
          }

          _res
            ?.on('data', chunk => {
              data += chunk;
            })
            .on('error', err => {
              req.destroy(err);
              reject(err);
            })
            .once('end', () => {
              try {
                data = JSON.parse(data);
                resolve(data);
                // eslint-disable-next-line no-empty
              } catch (err) {}
            });
        },
      );

      req.setHeader('Content-Type', 'application/json');
      if (body) {
        if (body.reason) {
          let reason = body.reason;

          try {
            if (reason.includes('%') && !reason.includes(' ')) reason = decodeURIComponent(reason);
            // eslint-disable-next-line no-empty
          } catch {}

          req.setHeader('X-Audit-Log-Reason', encodeURIComponent(reason));

          if (
            (options.method !== 'PUT' || !url.includes('/bans')) &&
            (options.method !== 'POST' || !url.includes('/prune'))
          ) {
            delete body.reason;
          } else {
            body.reason = reason;
          }
        }

        if (body.attachments) {
          const MD = new MultipartData('Peachy');
          req.setHeader('Content-Type', `multipart/form-data; boundary=${MD._boundary}`);
          for (const attach of body.attachments) {
            if (!attach.attachment) return;

            MD.append(attach.name, attach.attachment, attach.name);
          }

          MD.append('payload_json', body);
          body = MD.finish();
        }

        if (Array.isArray(body)) {
          for (const chunk of body) {
            req.write(chunk);
          }
          req.end();
        } else {
          req.write(body);
          req.end();
        }
      } else {
        req.end();
      }
    });
  }
}
