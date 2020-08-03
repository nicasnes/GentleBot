const index = require('../index.js'), fs = require("fs");
var client = index.client, getMoney = index.getMoney;

module.exports = {
  name: 'money',
  description: "Provides a user with money if their balance is less than $100.",
  execute(message, args) {
    let user = client.money[message.author.username]
      // Adds 100 to a user's account if their current balance is < 100.
      if (user && user.money >= 100) { message.reply('you have too much money to do that.'); return; }
      let winnings = 100
      let curEarnings = getMoney(message.author.username);
      client.money[message.author.username] = {
        money: curEarnings + winnings
      }
      fs.writeFile("./userdata/money.json", JSON.stringify (client.money, null, 4), err=> {
        if(err) throw err;
        message.reply("money added to your account. Current balance is $" + client.money[message.author.username].money);
      });
  }
}