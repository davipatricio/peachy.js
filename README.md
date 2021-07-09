# denky.js
Uma biblioteca minimalista em desenvolvimento criada para interagir com a API v9 do Discord.

Com o foco em simplicidade e performance. Para que qualquer um sem muitos conhecimentos consiga criar um bot ou self bot decente para o Discord.

O código ainda não está disponível publicamente pois a biblioteca está incompleta.

# Exemplo
```js
const DenkyJS = require('./index');
const client = new DenkyJS.Client({
    token: 'Token do seu bot',
    shards: 1,
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    
    // Você pode desabilitar o cache de certas coisas para diminuir o consumo de memória.
    // Desabilitar alguns itens, poderá fazer com que algumas propriedades não estejam disponíveis sem fetch.
    caches: {
        guilds: true, // Pode quebrar o bot, não recomendável desabilitar.
        channels: true, // Caso desativado, não será possível ver propriedades e permissões de um canal.
        roles: true, // Caso desativado, não será possível ver propriedades, permissões e permissões de membros.
        members: true, // Caso desativado, não será possível obter algumas informações de membros.
        emojis: true // Caso desativado, não será possível procurar emojis.
    }
});

client.login();
client.once('READY', () => {
    console.log('O bot foi iniciado com sucesso!');
});

client.on('MESSAGE_CREATE', (msg) => {
   if (msg.content === '!ping') message.channel.send(`Pong! ${client.ping}ms.`);
   if (msg.content === '!say') message.channel.send(`${message.content.slice(4)}`);
   if (msg.content === '!servidores') message.channel.send(`Estou em ${client.guilds.cache.size} servidores!`);
});

client.on('INTERACTION_CREATE', async (interaction) => {
   if (interaction.type !== 'APPLICATION_COMMAND') return;
   await interaction.deferUpdate()
   if (interaction.commandName === 'ping') interaction.editReply(`Pong! ${client.ping}ms.`);
   if (interaction.commandName === 'say') interaction.editReply(`${interaction.options[0].value ?? 'Nenhum texto inserido!'}`);
});

```

## To-Do
 - [ ] Gateway
    - [x] Heartbeat
    - [x] Hello
    - [x] Ready
    - [ ] Reconexão
    - [ ] Resumir sessão
    - [ ] Reconectar
    - [ ] Rate Limits
        - [ ] Rate limits por shards
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
