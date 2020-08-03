const Discord = require('discord.js'), index = require('../index.js');
var matchArray = index.matchArray;

module.exports = {
  name: 'matches',
  description: "Displays all ongoing matches.",
  execute(message, args) {
    embedMatches(message.channel); 
  }
}

function embedMatches(channel) {
  let embed = new Discord.MessageEmbed()
      .setTitle('Ongoing Matches')
      .setColor(0x64ff4c)
  for (let i = 0; i < matchArray.length; ++i) {
    embed.addField('Match ' + (i+1).toString(), 'Game: ' + matchArray[i].game + '\nProposed by: ' + matchArray[i].user);
  }
  if (matchArray.length === 0) {
    embed.setDescription('There are currently no ongoing matches.');
  }
  channel.send(embed);
}