const index = require('../index.js'), fs = require('fs');
var matchArray = index.matchArray, betArray = index.betArray, client = index.client, getMoney = index.getMoney;

module.exports = {
  name: 'report',
  description: "Reports the results of a match and processes the bet.",
  execute(message, args) {
    if (matchArray.length === 0)  { message.reply('there is no ongoing match.'); return;}
    if (args.length !== 3) { message.reply("improper syntax. Try .help!"); return; }
    let teamOneScore = args[1].substring(0, args[1].indexOf("-"));
    let teamTwoScore = args[1].substring(args[1].indexOf("-") + 1);
    let matchIndex = parseInt(args[2]) - 1;

    betArray = betArray.reduce(function(arrayOfBetsExcludingMatchIndex, curBet) {
      // If the bet index is the match being reported, then process the bet.
      if (curBet.getGameIndex() === matchIndex) {
        processBet(curBet, teamOneScore, teamTwoScore, message.channel);
      }
      // Otherwise, the bet should remain in the array. 
      else { 
        arrayOfBetsExcludingMatchIndex.push(curBet);
      }
      return arrayOfBetsExcludingMatchIndex;
    }, []);
    // Remove the match being reported from the array.
    matchArray.splice(matchIndex, 1);
  }
}

function processBet(bet, teamOneActual, teamTwoActual, channel) { 
  let factor = -1;
  let keyword = "lost";
  if (bet.getTeamOne() === teamOneActual && bet.getTeamTwo() === teamTwoActual) {
    factor = 2;
    keyword = "gained";
  } else if (teamOneActual > teamTwoActual === bet.getTeamOne() > bet.getTeamTwo()) {
    factor = 1.2;
    keyword = "gained";
  }
  client.money[bet.getUsername()] = {
    money: getMoney(bet.getUsername()) + (factor * bet.getBetAmount())
  }
  fs.writeFile("./userdata/money.json", JSON.stringify (client.money, null, 4), err=> {
    if(err) throw err;
    channel.send(bet.getUsername() + " " + keyword + " $" + (Math.abs(factor * bet.getBetAmount())) + ". Their new balance is $" + getMoney(bet.getUsername()) + ".");
  });
}


