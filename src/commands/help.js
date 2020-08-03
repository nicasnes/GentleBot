const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: "Provides useful information about Gentlebot's abilities",
  execute(message, args) {
    embedHelp(message.channel);
  }
}

function embedHelp(channel) {
  let embed = new Discord.MessageEmbed()
      .setTitle('Command Help')
      .setColor(0x64ff4c)
      .addField('.startmatch', 'Syntax: .startmatch gameName\n Begins a match with betting enabled')
      .addField('Example', '.startmatch Valorant')
      .addField('.matches', 'Syntax: !matches\n Displays match numbers, game played, and proposing user')
      .addField('.bet', 'Syntax: !bet score matchNumber betAmount\nPlaces a bet on an ongoing match\n The match number can be found by using !matches'
                + '\nExample: .bet 13-5 1 200')
      .addField('.report', 'Syntax: .report score matchNumber\nAll scores must be in the format: score1-score2 \nExample: .report 3-2 1')
      .addField('.viewbets', 'Syntax: .viewbets\nDisplays your ongoing bets.')
      .addField('.balance', 'Syntax: .balance\nDisplays your current balance.')
      .addField('.gamble', 'Syntax: .gamble 100\nDouble your gamble or lose it.');
  channel.send(embed);
}