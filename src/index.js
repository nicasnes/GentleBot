/*
  Gentlebot Version: 0.510
*/

// Initialize global variables and set the bot to online.
const Discord = require('discord.js'), fs = require("fs");
const client = new Discord.Client();

// Insert the bot's token here 
const token = 'INSERT_TOKEN_HERE';

// The message prefix can be modified so as to not interfere with other bots.
const prefix = '.';
var matchArray = [];
var betArray = [];

module.exports = { 
  matchArray: matchArray,
  betArray: betArray,
  prefix: prefix,
  client: client,
  getMoney: getMoney
}

client.money = require("./userdata/money.json");

client.on('ready', () => { 
  console.log("Bot is online.");
})
client.login(token);

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('message', message => {
  if (message.author.bot || message.content.substring(0,1) !== prefix) return;

  // Create args, a String[] where each entry is a part of message split at spaces.
  let args = message.content.slice(prefix.length).split(' ');
  switch(args[0]) {
    case 'help': 
      client.commands.get('help').execute(message, args);
      break;
    case 'userinfo':
      client.commands.get('userinfo').execute(message, args);
      break;
    case 'img':
      client.commands.get('img').execute(message, args);
      break;
    case 'money':
      client.commands.get('money').execute(message, args);
      break;
    case 'startmatch':
      client.commands.get('startmatch').execute(message, args);
      break;
    case 'bet':
      client.commands.get('bet').execute(message, args);
      break;
    case 'report':
      client.commands.get('report').execute(message, args);
      break;
    case 'matches':
      client.commands.get('matches').execute(message, args);
      break;
    case 'viewbets': 
      client.commands.get('viewbets').execute(message, args);
      break;
    case 'balance': 
      client.commands.get('balance').execute(message, args);
      break;
    case 'gamble':
      client.commands.get('gamble').execute(message, args);
      break;
  }

}) 


function getMoney(username) {
  let userInJSON = client.money.hasOwnProperty(username);
  return userInJSON ? client.money[username].money : 0;
}