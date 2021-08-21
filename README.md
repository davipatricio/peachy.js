# denky.js
Uma biblioteca minimalista em desenvolvimento criada para interagir com a API v9 do Discord.

Com o foco em simplicidade e performance. Para que qualquer um sem muitos conhecimentos consiga criar um bot ou self bot decente para o Discord.

O código ainda não está disponível publicamente pois a biblioteca está incompleta.

# Exemplo
```js
const DenkyJS = require('./index');
const client = new DenkyJS.Client({
    token: 'Token do seu bot',
    
    // Desabilitar alguns eventos podem melhorar a performance de bots grandes
    // Lista de eventos: https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events
    disabledEvents: ['TYPING_START'],
    
    shards: 1,
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    
    // Você pode limitar o cache de certas coisas para diminuir o consumo de memória.
    // Deixar alguns itens em 0 ou em um valor baixo, poderá fazer com que algumas propriedades não estejam disponíveis sem o metódo fetch.
    caches: {
        guilds: Infinity, // Pode quebrar o bot, não recomendável desabilitar.
        channels: 0, // Caso desativado, não será possível ver propriedades e permissões de um canal através do cache.
        roles: 2500, // Caso desativado, não será possível ver propriedades, permissões e permissões de membros através do cache.
        users: 100, // Caso desativado, não será possível obter algumas informações de usuários através do cache.
        membersPerGuild: 1000, // Caso desativado, não será possível obter algumas informações de membros através do cache.
        emojis: 0 // Caso desativado, não será possível procurar emojis através do cache.
    }
});

client.login();

client.on('MESSAGE_CREATE', async (msg) => {
   if (msg.content === '!ping') msg.channel.send(`Pong! ${client.ping}ms.`);
   if (msg.content === '!say') {
    await msg.delete();
    msg.channel.send(msg.content.slice(4));
   }
   if (msg.content === '!servidores') msg.channel.send(`Estou em ${client.guilds.cache.size} servidores!`);
});

client.on('INTERACTION_CREATE', async (interaction) => {
   if (interaction.type !== 'CHAT_COMMAND') return;
   await interaction.deferUpdate()
   if (interaction.commandName === 'ping') interaction.editReply(`Pong! ${client.ping}ms.`);
   if (interaction.commandName === 'say') interaction.editReply(`> ${interaction.options.getString('texto')}`);
});


client.once('READY', () => console.log('O bot foi iniciado com sucesso!'));
```

## To-Do
 - [ ] Gateway
    - [x] Heartbeat
    - [x] Hello
    - [x] Ready
    - [ ] Reconexão
    - [ ] Resumir sessão
    - [ ] Rate Limits
        - [ ] Rate Limits por shards
 - [x] Intents
    - [x] Bitfield
    - [x] Gerar intents
    - [x] Array de intents 
 - [ ] Shards
    - [x] Shards internas
    - [ ] Shards por processos
    - [ ] Max Concurrency
 - [ ] Cache
    - [x] Cache de canais
    - [x] Cache de servidores
    - [ ] Cache de cargos
    - [ ] Cache de membros
    - [ ] Cache de emojis
    - [ ] Cache de usuários
    - [ ] Cache customizavél
 - [ ] Compactação
 - [ ] Geradores
     - [ ] Embeds
     - [ ] Botões
     - [ ] Menus
     - [ ] Anexos
 - [ ] Suportes
     - [ ] Threads
     - [ ] Interações
     - [ ] Botões
     - [ ] Menus
     - [ ] Coletores
     - [ ] Audit Logs
     - [ ] Templates
     - [ ] Invites
     - [ ] Stage Instances
     - [ ] Voz
     - [ ] Permissões

## Eventos suportados
 - [x] MESSAGE_CREATE
 - [x] GUILD_CREATE
 - [x] GUILD_DELETE
 - [x] READY
 - [x] HELLO
 - [ ] GUILD_UPDATE
 - [ ] GUILD_BAN_ADD
 - [ ] GUILD_BAN_REMOVE
 - [ ] GUILD_EMOJIS_CREATE
 - [ ] GUILD_EMOJIS_DELETE
 - [ ] GUILD_EMOJIS_UPDATE
 - [ ] GUILD_EMOJI_UPDATE
 - [ ] GUILD_INTEGRATIONS
 - [ ] GUILD_ROLE_CREATE
 - [ ] INTERACTION_CREATE
 - [ ] VOICE_STATE_UPDATE
 - [ ] USER_UPDATE
 - [ ] MESSAGE_UPDATE
 - [ ] TYPING_START
 - [ ] THREAD_CREATE
 - [ ] THREAD_DELETE
 - [ ] THREAD_LIST_SYNC
 - [ ] THREAD_MEMBER_UPDATE
 - [ ] THREAD_MEMBERS_UPDATE
 - [ ] STAGE_INSTANCE_CREATE
 - [ ] STAGE_INSTANCE_DELETE
 - [ ] STAGE_INSTANCE_UPDATE
 - [ ] GUILD_ROLE_DELETE
 - [ ] GUILD_ROLE_UPDATE
 - [ ] CHANNEL_CREATE
 - [ ] CHANNEL_DELETE
 - [ ] CHANNEL_UPDATE
 - [ ] WEBHOOKS_UPDATE
