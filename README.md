# peachy.js
A minimalist and perfomance-focused library in development designed to interact with Discord API.

With a focus on simplicity and performance. So that anyone without much knowledge can create a decent bot for Discord.

# Installation

##### Node.js 16.0.0 or newer is required.

```sh-session
npm install peachy.js
yarn add peachy.js
pnpm add peachy.js
```

### Optional packages
- [bufferutil](https://www.npmjs.com/package/bufferutil) for a much faster WebSocket connection (`npm install bufferutil`)
- [utf-8-validate](https://www.npmjs.com/package/utf-8-validate) in combination with `bufferutil` for much faster WebSocket processing (`npm install utf-8-validate`)

---

# Simple example
```js
const Peachy = require('peachy.js');
const client = new Peachy.Client();

client.on('MESSAGE_CREATE', async (msg) => {
   if (msg.content === '!ping') msg.channel.send(`Pong! ${client.ping}ms.`);
});

client.login('Bot token');
```
---

## Advanced example
```js
const Peachy = require('peachy.js');
const client = new Peachy.Client({
    // Disabling some events can eventually improve performance on bots on many servers in combination with intents
    // Event list: https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events
    disabledEvents: ['TYPING_START'],
    
    shardId: 0, // Should start at 0. Useful for large bots in multiple machines
    shardCount: 1 // How many shards spawn

    intents: ['GUILDS', 'GUILD_MESSAGES'],
    
    // You can limit the caching of certain items to decrease memory consumption.
    // Leaving some items at 0 or at a very low value may cause some properties not to be available without the 'fetch' method.
    caches: {
        guilds: Infinity, // May break the entire bot, not recommended to disable.
        channels: Infinity, // If disabled, you won't be able to see properties and permissions for a channel through the cache.
        roles: 2500, // If disabled, you won't be able to see member properties, permissions through the cache.
        users: 100, // If disabled, you won't be able to get some information from users through the cache.
        membersPerGuild: 1000, // If disabled, you won't be able to get some member information through the cache.
        emojis: 0 // If disabled, you won't be able to search for emojis through the cache.
    }
});

client.login('Bot token');

client.on('messageCreate', async (msg) => {
   if (msg.content === '!ping') msg.channel.send(`Pong! ${client.ping}ms.`);
   if (msg.content === '!say') {
    await msg.delete();
    msg.channel.send(msg.content.slice(4));
   }
   if (msg.content === '!servers') msg.channel.send(`I'm in ${client.guilds.cache.size} guilds!`);
});


client.once('READY', () => console.log('Connected to Discord!'));
```
