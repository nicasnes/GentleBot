/*
  Gentlebot Version: 0.5
*/

// Initialize global variables and set the bot to online.
const Discord = require('discord.js'), cheerio = require('cheerio'), request = require('request'), fs = require("fs");
const client = new Discord.Client();

// Insert the bot's token here 
const token = 'TOKEN_HERE';

// The message prefix can be modified so as to not interfere with other bots.
const prefix = '.';
var matchArray = [];
var betArray = [];

client.money = require("./money.json");
client.on('ready', () => { 
  console.log("Bot is online.");
})

client.login(token);

// Process a message received by a client
client.on('message', message => {
  if (message.author.bot || message.content.substring(0,1) !== prefix) return;

  // Create args, a String[] where each entry is a part of message split at spaces.
  let args = message.content.slice(prefix.length).split(' ');
  switch(args[0]) {
    case 'help': 
      embedHelp(message.channel);
      break;
    case 'userinfo':
      embedUserInfo(message.author, message.channel);
      break;
    case 'img':
      if (args.length !== 1) {
        displayFirstImage(message);
      } else { 
        message.reply("add an image description such as " + prefix + "img person");
      }
      break;
    case 'money':
      let user = client.money[message.author.username]
      // Adds 100 to a user's account if their current balance is < 100.
      if (user && user.money >= 100) { message.reply('you have too much money to do that.'); return; }
      let winnings = 100
      let curEarnings = getMoney(message.author.username);
      client.money[message.author.username] = {
        money: curEarnings + winnings
      }
      fs.writeFile("./money.json", JSON.stringify (client.money, null, 4), err=> {
        if(err) throw err;
        message.reply("money added to your account. Current balance is $" + client.money[message.author.username].money);
      });
      break;
    case 'startmatch':
      // Begins a match which bets can be placed on.
      let game = args[1] === undefined ? "unknown" : message.content.substring(message.content.indexOf(" ") + 1);;
      matchArray.push({game: game, user: message.author.username});
      message.channel.send("A match of " + game + " has started with match number " + matchArray.length + "!");
      break;
    case 'bet':
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
      break;
    case 'report':
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
      }, [])
      // Remove the match being reported from the array.
      matchArray.splice(matchIndex, 1);
      break;
    case 'matches':
      embedMatches(message.channel);
      break;
    case 'viewbets': 
      embedBets(message);
      break;
    case 'balance': 
      message.reply('your balance is $' + getMoney(message.author.username));
      break;
    case 'gamble':
      if (!args[1]) { return; }
      amount = Number(args[1]);
      let factor = 1;
      let userMoney = Number(getMoney(message.author.username))
      if (amount > userMoney) {
        message.reply('you don\'t have enough money for that!');
        return;
      }
      if (Math.random() > 0.5) { 
        message.reply('you won! Your balance is now $' + (userMoney+amount));
      } else { 
        factor = -1;
        message.reply('you lost. Your balance is now $' + (userMoney-amount))
      }
      client.money[message.author.username] = {
        money: userMoney + (factor * amount)
      }
      fs.writeFile("./money.json", JSON.stringify (client.money, null, 4), err=> {
        if(err) throw err;
      });
      break;
  }

}) 

// embedUserInfo(username: User, channel: TextChannel): undefined
function embedUserInfo(username, channel) {
  let embed = new Discord.MessageEmbed()
      .setTitle('User Information')
      .setColor(0x64ff4c)
      .setThumbnail(username.displayAvatarURL())
      .addField('Name', username.username);
  channel.send(embed);
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

function embedMatches(channel) {
  let embed = new Discord.MessageEmbed()
      .setTitle('Ongoing Matches')
      .setColor(0x64ff4c)
  for (let i = 0; i < matchArray.length; ++i) {
    embed.addField('Match ' + (i+1).toString(), 'Game: ' + matchArray[i].game + '\nProposed by: ' + matchArray[i].user);
  }
      
  channel.send(embed);
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

function getMoney(username) {
  let userInJSON = client.money.hasOwnProperty(username);
  return userInJSON ? client.money[username].money : 0;
}


function displayFirstImage(message){
  let args = message.content.slice(prefix.length).split(" ");
  var search  = message.content.substring(message.content.indexOf(" ") + 1);
  var options = {
      url: "http://results.dogpile.com/serp?qc=images&q=" + search,
      method: "GET",
      headers: {
          "Accept": "text/html",
          "User-Agent": "Chrome"
      }
  };

  request(options, function(error, response, responseBody) {
      if (error) {
          return;
      }
      $ = cheerio.load(responseBody);
      var links = $(".image a.link");
      var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
      if (!urls.length) {
          return;
      }
      // Send result
      message.channel.send(urls[0]);

  });

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
  fs.writeFile("./money.json", JSON.stringify (client.money, null, 4), err=> {
    if(err) throw err;
    channel.send(bet.getUsername() + " " + keyword + " $" + (Math.abs(factor * bet.getBetAmount())) + ". Their new balance is $" + getMoney(bet.getUsername()) + ".");
  });

}