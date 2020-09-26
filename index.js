/*
 *   Copyright (c) 2020 routerabfrage
 *   All rights reserved.
 *   https://github.com/routerabfrage/License
 */
// jshint esversion: 8
var config = require('./config.json');
var discord = require('discord.js');
var client = new discord.Client();
var fs = require('fs');
var prefix = '-';
var db = require('quick.db');

client.on('ready', async function () {
    console.log(`ready, logged in as ${client.user.tag}`);
    setInterval(() => {
        client.user.setActivity(`-help | in ${client.guilds.size} servers`, {
            type: "WATCHING"
        });
    }, 16000);
});

//logging
client.on('messageDelete', async message => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    if (message.guild) {
        if (message.author.bot) return;
        var y = db.get('messagedelete_' + message.guild.id);
        if (y !== `enabled`) return;
        var x = db.get('loggingchannel_' + message.guild.id);
        x = client.channels.get(x);
        if (message.channel == x) return;
        var embed = new discord.RichEmbed()
            .setColor('#FF0000')
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setDescription(`**Message deleted from** ${message.author} **in channel** ${message.channel} \n${message.content}`)
            .setFooter(`ID: ${client.guilds.id}`, client.guilds.iconURL)
            .setTimestamp();
        x.send(embed).catch();
    }

});

client.on("channelCreate", async function (channel) {
    if (!channel.guild) return;
    var y = db.get(`channelcreate_${channel.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + channel.guild.id);
    var x = client.channels.get(x);
    var embed = new discord.RichEmbed()
        .setColor('#09dc0b')
        .setAuthor(channel.guild.name, channel.guild.iconURL)
        .setTitle('Channel Created')
        .addField('Channel', channel)
        .addField('Type', channel.type)
        .setFooter(`ID: ${channel.guild.id}`, channel.guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();


});

client.on("channelDelete", async function (channel) {
    if (!channel.guild) return;
    var y = db.get(`channelcreate_${channel.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + channel.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setAuthor(channel.guild.name, channel.guild.iconURL)
        .setTitle('Channel Deleted')
        .addField('Name', channel.name)
        .addField('Type', channel.type)
        .setFooter(`ID: ${channel.guild.id}`, channel.guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();


});
client.on("emojiCreate", async function (emoji) {

    var y = db.get(`emojicreate_${emoji.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + emoji.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#09dc0b')
        .setAuthor(emoji.guild.name, emoji.guild.iconURL)
        .setTitle('Emoji Created')
        .addField('Added Emoji', emoji + ` :${emoji.name}:`)
        .setFooter(`ID: ${emoji.guild.id}`, emoji.guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();


});
client.on("emojiDelete", async function (emoji) {
    var y = db.get(`emojidelete_${emoji.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + emoji.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setAuthor(emoji.guild.name, emoji.guild.iconURL)
        .setTitle('Emoji Deleted')
        .addField('Name', `[:${emoji.name}:](${emoji.url})`)
        .setFooter(`ID: ${emoji.guild.id}`, emoji.guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();


});
client.on("guildBanAdd", async function (guild, user) {

    var y = db.get(`guildbanadd_${guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setAuthor(user.tag, user.avatarURL)
        .setDescription(`:police_officer: :lock: ${user.tag} **was banned** `)
        .setFooter(`ID: ${guild.id}`, guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();

});
client.on("guildBanRemove", async function (guild, user) {

    var y = db.get(`guildbanremove_${guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('GREEN')
        .setAuthor(user.tag, user.avatarURL)
        .setDescription(`:police_officer: :unlock: ${user.tag} **was unbanned**`)
        .setFooter(`ID: ${guild.id}`, guild.iconURL)
        .setTimestamp();
    x.send(embed).catch();
});
client.on("guildMemberAdd", async function (member) {

    var y = db.get(`guildmemberadd_${member.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + member.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('GREEN')
        .setAuthor(member.user.tag, member.user.avatarURL)
        .setDescription(`:inbox_tray: ${member.user.tag} **joined the server**`)
        .addField('Account creation', member.user.createdAt)
        .setFooter(`ID: ${member.user.id}`)
        .setTimestamp();
    x.send(embed).catch();
});
client.on("guildMemberRemove", async function (member) {
    var y = db.get(`guildmemberremove_${member.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + member.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('RED')
        .setAuthor(member.user.tag, member.user.avatarURL)
        .setDescription(`:outbox_tray: ${member.user.tag} **left the server**`)
        .setFooter(`ID: ${member.user.id}`)
        .setTimestamp();
    x.send(embed).catch();

});

client.on("messageDeleteBulk", async function (messages) {

    var y = db.get(`messagebulkdelete_${messages.random().guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + messages.random().guild.id);
    var x = client.channels.get(x);
    if (messages.random().channel == x) return;

    await messages.array().reverse().forEach(m => {
        var x = m.createdAt.toString().split(' ');
        fs.appendFile('messagebulkdelete.txt', `[${m.author.tag}], [#${m.channel.name}]: ["${m.content}"], created at [${x[0]} ${x[1]} ${x[2]} ${x[3]} ${x[4]}]\n\n`, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    });

    var embed = new discord.RichEmbed()
        .setColor('#FFD700')
        .setAuthor(messages.random().guild.name, messages.random().guild.iconURL)
        .setDescription(`**${messages.array().length} messages got deleted in** ${messages.random().channel}`)
        .setFooter(`ID: ${messages.random().guild.id}`)
        .setTimestamp();
        await x.send(embed).catch();
        await x.send(`Here is the log file for the deleted messages: \n`).catch();
        await x.send(({
            files: [{
               attachment: 'messagebulkdelete.txt'
            }]
    })).catch();

    fs.unlink('messagebulkdelete.txt', function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });

});

client.on("roleCreate", async function (role) {
    var y = db.get(`rolecreate_${role.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + role.guild.id);
    var x = client.channels.get(x);


    var embed = new discord.RichEmbed()
        .setColor('#09dc0b')
        .setAuthor(role.guild.name, role.guild.iconURL)
        .setTitle(`Role ${role.name} Created`)
        .setDescription(`Name: ${role.name} \nColor: ${role.color} \nHoisted: ${role.hoist} \nMentionable: ${role.mentionable}`)
        .setFooter(`ID: ${role.id}`)
        .setTimestamp();
    x.send(embed).catch();

});
client.on("roleDelete", async function (role) {

    var y = db.get(`roledelete_${role.guild.id}`);
    if (y !== 'enabled') return;
    var x = db.get('loggingchannel_' + role.guild.id);
    var x = client.channels.get(x);

    var embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setAuthor(role.guild.name, role.guild.iconURL)
        .setTitle(`Role ${role.name} Deleted`)
        .setDescription(`Name: ${role.name} \nColor: ${role.color} \nHoisted: ${role.hoist} \nMentionable: ${role.mentionable}`)
        .setFooter(`ID: ${role.id}`)
        .setTimestamp();

    x.send(embed).catch();

});

client.on('message', async message => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (message.content.indexOf(prefix) !== 0) return;

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }

    }

    if (command === "help") {
        if (!message.guild) return message.channel.send(`Use this command in a server, not in dm!`);
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, but you have no permission to use that Command!`);
        var embed = new discord.RichEmbed()
            .setAuthor(`Help for ${message.guild.name}`, message.guild.iconURL)
            .setTitle(`Configuration for logging in ${message.guild.name}\n`)
            .setColor('PURPLE');
        var y = await db.get(`allenabled_${message.guild.id}`);
        if (y == 'enabled') {
            embed.addField('logging deleted messages [1]', "enabled");
            embed.addField('logging created roles [2]', "enabled");
            embed.addField('logging deleted roles [3]', "enabled");
            embed.addField('logging bulk message deletes [4]', "enabled");
            embed.addField('logging member leaves/user kicks [5]', "enabled");
            embed.addField('logging member joins [6]', "enabled");
            embed.addField('logging guild bans [7]', "enabled");
            embed.addField('logging guild unbans [8]', "enabled");
            embed.addField('logging emoji creations [9]', "enabled");
            embed.addField('logging emoji deletions [10]', "enabled");
            embed.addField('logging channel creations [11]', "enabled");
            embed.addField('logging channel deletions [12]', "enabled");
            embed.addField(`----------------------`, `Commands: \n\`${prefix}enable [number]\` - enable the logging for a module\n\`${prefix}enable all\` - enable all logging modules \n \`${prefix}disable [number]\` - disable a logging module \n\`${prefix}disable all\` - disable all logging modules\n \`${prefix}reset\` - refreshes the bots entire cache for the server; everything set to default, with no logging channel`);
            var x = await db.get('loggingchannel_' + message.guild.id);
            if (x == null) embed.addField(`There is no logging channel set up for this server. To set one up, type:`, `\`${prefix}setchannel #channel\``);
            if (x !== null) {
                var y = client.channels.get(x);
                embed.addField(`----------------------`, `The current logging channel is ${y}. \n To set up another channel, type **${prefix}setchannel #channel**.`);
            }
            embed.setFooter(`Bot was made by routerabfrage!`);
        } else if (y == "disabled") {
            embed.addField('logging deleted messages [1]', "disabled");
            embed.addField('logging created roles [2]', "disabled");
            embed.addField('logging deleted roles [3]', "disabled");
            embed.addField('logging bulk message deletes [4]', "disabled");
            embed.addField('logging member leaves/user kicks [5]', "disabled");
            embed.addField('logging member joins [6]', "disabled");
            embed.addField('logging guild bans [7]', "disabled");
            embed.addField('logging guild unbans [8]', "disabled");
            embed.addField('logging emoji creations [9]', "disabled");
            embed.addField('logging emoji deletions [10]', "disabled");
            embed.addField('logging channel creations [11]', "disabled");
            embed.addField('logging channel deletions [12]', "disabled");
            embed.addField(`----------------------`, `Commands: \n\`${prefix}enable [number]\` - enable the logging for a module\n\`${prefix}enable all\` - enable all logging modules \n \`${prefix}disable [number]\` - disable a logging module \n\`${prefix}disable all\` - disable all logging modules\n \`${prefix}reset\` - refreshes the bots entire cache for the server; everything set to default, with no logging channel`);
            var x = await db.get('loggingchannel_' + message.guild.id);
            if (x == null) embed.addField(`There is no logging channel set up for this server. To set one up, type:`, `\`${prefix}setchannel #channel\``);
            if (x !== null) {
                var y = client.channels.get(x);
                embed.addField(`----------------------`, `The current logging channel is ${y}. \n To set up another channel, type **${prefix}setchannel #channel**.`);
            }
        } else {

            var x = await db.get('messagedelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging deleted messages [1]', "disabled");
            } else {
                embed.addField('logging deleted messages [1]', "enabled");
            }
            var x = await db.get('rolecreate_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging created roles [2]', "disabled");
            } else {
                embed.addField('logging created roles [2]', "enabled");
            }
            var x = await db.get('roledelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging deleted roles [3]', "disabled");
            } else {
                embed.addField('logging deleted roles [3]', "enabled");
            }
            var x = await db.get('messagebulkdelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging bulk message deletes [4]', "disabled");
            } else {
                embed.addField('logging bulk message deletes [4]', "enabled");
            }
            var x = await db.get('guildmemberremove_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging member leaves/user kicks [5]', "disabled");
            } else {
                embed.addField('logging member leaves/user kicks [5]', "enabled");
            }
            var x = await db.get('guildmemberadd_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging member joins [6]', "disabled");
            } else {
                embed.addField('logging member joins [6]', "enabled");
            }
            var x = await db.get('guildbanadd_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging guild bans [7]', "disabled");
            } else {
                embed.addField('logging guild bans [7]', "enabled");
            }
            var x = await db.get('guildbanremove_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging guild unbans [8]', "disabled");
            } else {
                embed.addField('logging guild unbans [8]', "enabled");
            }
            var x = await db.get('emojicreate_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging emoji creations [9]', "disabled");
            } else {
                embed.addField('logging emoji creations [9]', "enabled");
            }
            var x = await db.get('emojidelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging emoji deletions [10]', "disabled");
            } else {
                embed.addField('logging emoji deletions [10]', "enabled");
            }
            var x = await db.get('channelcreate_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging channel creations [11]', "disabled");
            } else {
                embed.addField('logging channel creations [11]', "enabled");
            }
            var x = await db.get('channeldelete_' + message.guild.id);
            if (x == null || x == "disabled") {
                embed.addField('logging channel deletions [12]', "disabled");
            } else {
                embed.addField('logging channel deletions [12]', "enabled");
            }
            embed.addField(`----------------------`, `Commands: \n\`${prefix}enable [number]\` - enable the logging for a module\n\`${prefix}enable all\` - enable all logging modules \n \`${prefix}disable [number]\` - disable a logging module \n\`${prefix}disable all\` - disable all logging modules\n \`${prefix}reset\` - refreshes the bots entire cache for the server; everything set to default, with no logging channel`);
            var x = await db.get('loggingchannel_' + message.guild.id);
            if (x == null) embed.addField(`There is no logging channel set up for this server. To set one up, type:`, `\`${prefix}setchannel #channel\``);
            if (x !== null) {
                var y = client.channels.get(x);
                embed.addField(`----------------------`, `The current logging channel is ${y}. \n To set up another channel, type **${prefix}setchannel #channel**.`);
            }
        }
        embed.setFooter(`Bot was made by routerabfrage!`);
        embed.addField(`----------------------\n`, `[Discord Server](https://discord.gg/DYA89WU)`);
        message.channel.send(embed);

    }

    if (command == "reset") {
        if (!message.guild) return message.reply('You have to use this command in a Server!');
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, but you have no permission to use that Command!`);
        await db.delete(`loggingchannel_${message.guild.id}`);
        await db.delete(`allenabled_${message.guild.id}`);
        await db.delete(`messagedelete_${message.guild.id}`);
        await db.delete('rolecreate_' + message.guild.id);
        await db.delete('roledelete_' + message.guild.id);
        await db.delete('messagebulkdelete_' + message.guild.id);
        await db.delete('guildmemberremove_' + message.guild.id);
        await db.delete('guildmemberadd_' + message.guild.id);
        await db.delete('guildbanadd_' + message.guild.id);
        await db.delete('guildbanremove_' + message.guild.id);
        await db.delete('emojicreate_' + message.guild.id);
        await db.delete('emojidelete_' + message.guild.id);
        await db.delete('channelcreate_' + message.guild.id);
        await db.delete('channeldelete_' + message.guild.id);
        message.channel.send(`Done, cleared all cache for this server. Type \`${prefix}help\` to setup again!`);
    }

    if (command == "disable") {

        if (!message.guild) return message.reply('You have to use this command in a Server!');
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, but you have no permission to use that Command!`);
        if (!args[0]) return message.channel.send(`You need to specify a number with the event you don't want to log. Type \`${prefix}help\``);
        var x = await db.get('loggingchannel_' + message.guild.id);
        if (x == null || x == 'none') {
            return message.channel.send(`You haven't set up a logging channel for this guild. Type \`${prefix}help\``);
        }
        if (args[0] > 12 || args[0] < 1) return message.reply(`type \`${prefix}help\` and find the number with what event u want to disable logging for`);
        switch (args[0]) {
            case "1":
                await db.set(`messagedelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging for deleted messages`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "2":
                await db.set(`rolecreate_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging for created roles`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "3":
                await db.set(`roledelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging for deleted roles`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "4":
                await db.set(`messagebulkdelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging for message bulk deletes`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "5":
                await db.set(`guildmemberremove_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging member leaves/user kicks`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "6":
                await db.set(`guildmemberadd_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging for new members`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "7":
                await db.set(`guildbanadd_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging banned users`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "8":
                await db.set(`guildbanremove_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging unbanned users`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "9":
                await db.set(`emojicreate_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging for emoji creations`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "10":
                await db.set(`emojidelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging for emoji deletions`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "11":
                await db.set(`channelcreate_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging for channel creations`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "12":
                await db.set(`channeldelete_${message.guild.id}`, 'disabled');
                message.channel.send(`Ok, disabled the logging for channel deletions`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "all":
                await db.set(`allenabled_${message.guild.id}`, 'disabled');
                await db.set(`messagedelete_${message.guild.id}`, 'disabled');
                await db.set('rolecreate_' + message.guild.id, 'disabled');
                await db.set('roledelete_' + message.guild.id, 'disabled');
                await db.set('messagebulkdelete_' + message.guild.id, 'disabled');
                await db.set('guildmemberremove_' + message.guild.id, 'disabled');
                await db.set('guildmemberadd_' + message.guild.id, 'disabled');
                await db.set('guildbanadd_' + message.guild.id, 'disabled');
                await db.set('guildbanremove_' + message.guild.id, 'disabled');
                await db.set('emojicreate_' + message.guild.id, 'disabled');
                await db.set('emojidelete_' + message.guild.id, 'disabled');
                await db.set('channelcreate_' + message.guild.id, 'disabled');
                await db.set('channeldelete_' + message.guild.id, 'disabled');
                message.channel.send(`Ok disabled logging for all events in this guild`);
        }
    }

    if (command == "enable") {
        if (!message.guild) return message.reply('You have to use this command in a Server!');
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, but you have no permission to use that Command!`);
        if (!args[0]) return message.channel.send(`You need to specify a number with the event you want to log. Type \`${prefix}help\``);
        var x = await db.get('loggingchannel_' + message.guild.id);
        if (x == null || x == 'none') {
            return message.channel.send(`You haven't set up a logging channel for this guild. Type \`${prefix}help\``);
        }
        if (args[0] > 12 || args[0] < 1) return message.reply(`Type \`${prefix}help\` and find the number with what event you want to enable logging for`);
        switch (args[0]) {
            case "1":
                await db.set(`messagedelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging for deleted messages`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "2":
                await db.set(`rolecreate_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging for created roles`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "3":
                await db.set(`roledelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging for deleted roles`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "4":
                await db.set(`messagebulkdelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging for message bulk deletes`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "5":
                await db.set(`guildmemberremove_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging member leaves/user kicks`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "6":
                await db.set(`guildmemberadd_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging for new members`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "7":
                await db.set(`guildbanadd_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging banned users`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "8":
                await db.set(`guildbanremove_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging unbanned users`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "9":
                await db.set(`emojicreate_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging for emoji creations`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "10":
                await db.set(`emojidelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging for emoji deletions`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "11":
                await db.set(`channelcreate_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging for channel creations`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "12":
                await db.set(`channeldelete_${message.guild.id}`, 'enabled');
                message.channel.send(`Ok, enabled the logging for channel deletions`);
                await db.delete(`allenabled_${message.guild.id}`);
                break;
            case "all":
                await db.set(`allenabled_${message.guild.id}`, 'enabled');

                await db.set('rolecreate_' + message.guild.id, 'enabled');
                await db.set(`messagedelete_${message.guild.id}`, 'enabled');
                await db.set('roledelete_' + message.guild.id, 'enabled');
                await db.set('messagebulkdelete_' + message.guild.id, 'enabled');
                await db.set('guildmemberremove_' + message.guild.id, 'enabled');
                await db.set('guildmemberadd_' + message.guild.id, 'enabled');
                await db.set('guildbanadd_' + message.guild.id, 'enabled');
                await db.set('guildbanremove_' + message.guild.id, 'enabled');
                await db.set('emojicreate_' + message.guild.id, 'enabled');
                await db.set('emojidelete_' + message.guild.id, 'enabled');
                await db.set('channelcreate_' + message.guild.id, 'enabled');
                await db.set('channeldelete_' + message.guild.id, 'enabled');
                message.channel.send(`Ok enabled logging for all events in this guild.`);
        }
    }

    if (command == "setchannel") {
        if (!message.guild) return message.reply('You have to use this command in a Server!');
        if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`:no_entry: Sorry, but you have no permission to use that Command!`);
        if (!args[0] || args[1]) return message.reply(`please specify the channel, like so: \`${prefix}setchannel #channel\``);

        x = message.mentions.channels.first();
        if (!x) return message.channel.send(`please specify the channel, like so: \`${prefix}setchannel #channel\``);
        await db.set(`loggingchannel_${message.guild.id}`, x.id);
        message.channel.send(`Ok, logging channel for this guild was set to ${x}`);
    }

});

client.on('error', e => {
    console.log(e);
});
client.login(config.token || process.env.TOKEN).catch(e => console.log(e));