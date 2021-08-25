# peachy.js
A minimalist and perfomance-focused library in development designed to interact with Discord API.

With a focus on simplicity and performance. So that anyone without much knowledge can create a decent bot for Discord.

# Example
```js
const Peachy = require('./index');
const client = new Peachy.Client({
    // Disabling some events can eventually improve performance on bots on many servers in combination with intents
    // Event list: https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events
    disabledEvents: ['TYPING_START'],
    
    shards: 1,
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

client.on('MESSAGE_CREATE', async (msg) => {
   if (msg.content === '!ping') msg.channel.send(`Pong! ${client.ping}ms.`);
   if (msg.content === '!say') {
    await msg.delete();
    msg.channel.send(msg.content.slice(4));
   }
   if (msg.content === '!servidores') msg.channel.send(`I'm in ${client.guilds.cache.size} guilds!`);
});

client.on('INTERACTION_CREATE', async (interaction) => {
   if (interaction.type !== 'CHAT_COMMAND') return;
   await interaction.deferUpdate()
   if (interaction.commandName === 'ping') interaction.editReply(`Pong! ${client.ping}ms.`);
   if (interaction.commandName === 'say') interaction.editReply(`> ${interaction.options.getString('text')}`);
});


client.once('READY', () => console.log('Connected to Discord!'));
```
