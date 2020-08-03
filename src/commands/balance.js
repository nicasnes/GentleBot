const index = require('../index.js');
var getMoney = index.getMoney;

module.exports = {
  name: 'balance',
  description: "Displays a user's balance.",
  execute(message, args) {
    message.channel.send(message.author.username + ', your balance is $' + getMoney(message.author.username) + ".");
  }
}