const Discord = require('discord.js'), index = require('../index.js');
var betArray = index.betArray, matchArray = index.matchArray;

module.exports = {
  name: 'viewbets',
  description: "Displays all of a user's ongoing bets.",
  execute(message, args) {
    embedBets(message); 
  }
}

function embedBets(message) {
  let userBets = betArray.filter((bet) => bet.getUsername() === message.author.username);
  let embed = new Discord.MessageEmbed()
      .setTitle(message.author.username + "'s Bets")
      .setColor(0x64ff4c);
  if (userBets.length > 0)  {
    userBets.forEach(bet => {
      embed.addField('Match Info', 'Number: ' + (bet.getGameIndex() + 1) + '\nType: ' + matchArray[bet.getGameIndex()].game
           + '\nAmount: ' + bet.getBetAmount().toString()
           + '\nPredicted score: ' + bet.getTeamOne().toString() + " - " + bet.getTeamTwo().toString() + '\n ');
    });
  } else {
    embed.addField('Whoops!', 'The user has no ongoing bets.')
  }
  
  message.channel.send(embed);
}