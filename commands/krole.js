require ('dotenv').config()
const Discord = require('discord.js');
const usedCommand = new Set();
const config = process.env;

module.exports.run = async (bot, message, args) => {
    if(usedCommand.has(message.author.id)){
        message.reply("You cannot use " + config.prefix + "krole command beacuse of the cooldown.")
    } else {
            //check if no perm
            if(!message.member.hasPermission("ADMINISTRATOR")){
              return message.reply("You don't have `ADMINISTRATOR` permission to do that!");
            }      
            let mentionedrole = message.mentions.roles.firstKey()
            const withoutPrefix = message.content.slice(config.prefix.length);
            const split = withoutPrefix.split(/ +/);
            const command = split[0];
            const args = split.slice(1);
            let id = args[0];
        
            if (!args.length){
              return message.channel.send(` ${message.author}, please kindly input a role!`);
            }
            else if (!id.startsWith('<@&') && id.endsWith('>')) {
              return message.channel.send(` ${message.author}, You didn't mention a role!`);
            }
            //[view the id before deleting] message.channel.send(`Role ID: `+ mentionedrole);
                //gather the latest data first
                message.guild.members.fetch()
                //count members will be kicked
                var memberscount = message.guild.roles.cache.get(mentionedrole).members.size;
                message.reply('The bot will kick ('+ memberscount +') users from ' + `<@&`+mentionedrole+`>` + ' role.\n'+ 'Confirm with a thumb up or deny with a thumb down.')    
                message.react('👍').then(r => {
                message.react('👎');
                  });
                // confirmation of the task
                message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                { max: 1, time: 30000 }).then(collected => {
                      if (collected.first().emoji.name == '👍') {
                              message.reply('Kicking the members...');
                              let members = message.guild.roles.cache.get(mentionedrole).members
                              members.forEach(m => {
                                m.kick()
                                .catch(console.error);
                              });
                      }
                      else
                              message.reply('Operation canceled.');
                  }).catch(() => {
                      message.reply('No reaction after 30 seconds, operation canceled');
                  });
        usedCommand.add(message.author.id);
        setTimeout(() => {
            usedCommand.delete(message.author.id);
        }, 21600000); 
    }
}

module.exports.config = {
    name: "krole",
    description: "",
    usage: "?krole",
    accessableby: "Admins",
    aliases: []
}