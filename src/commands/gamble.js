const index = require('../index.js'), fs = require('fs');
var getMoney = index.getMoney, client = index.client;

module.exports = {
  name: 'gamble',
  description: "Allows a user to gamble their money.",
  execute(message, args) {
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
      fs.writeFile("./userdata/money.json", JSON.stringify (client.money, null, 4), err=> {
        if(err) throw err;
      });
  }
}