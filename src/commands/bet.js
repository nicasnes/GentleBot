const index = require('../index.js');
var matchArray = index.matchArray, betArray = index.betArray, getMoney = index.getMoney; 

module.exports = {
  name: 'bet',
  description: "Places a bet on a particular match",
  execute(message, args) {
    // If the syntax for bet is improper, refer the user to .help.
    if (args.length < 4) { 
      message.reply("Improper syntax... try .help!"); 
      return; 
    }
    // Parse the user's message into four variables and store this as a bet in betArray.
    let teamOne = args[1].substring(0, args[1].indexOf("-")),
    teamTwo = args[1].substring(args[1].indexOf("-") + 1),
    gameIndex = parseInt(args[2]) - 1,
    betAmount = parseInt(args[3]);
    if (betAmount > getMoney(message.author.username)) { 
      message.reply("You don't have enough money to place that bet. Current balance is $" + getMoney()) 
      return;
    }
    if (matchArray[gameIndex]) {
      betArray.push(
        new Bet(message.author.username, teamOne, teamTwo, gameIndex, betAmount)
      );
      message.reply("you placed a bet for $" + args[3] + " on match " + args[2] + " in game: " + matchArray[gameIndex].game + ".");
    } else {
      message.reply("the match you selected is invalid. Type .matches to see ongoing matches.");
    }
  }
}

class Bet {
  constructor(username, teamOne, teamTwo, gameIndex, betAmount) {
    this.getUsername = () => username;
    this.getTeamOne = () => teamOne;
    this.getTeamTwo = () => teamTwo;
    this.getGameIndex = () => gameIndex;
    this.getBetAmount = () => betAmount;
  }
}
