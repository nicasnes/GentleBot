const index = require('../index.js');
var matchArray = index.matchArray;

module.exports = {
  name: 'startmatch',
  description: "Begins a match on which bets can be placed",
  execute(message, args) {
    let game = args[1] === undefined ? "unknown" : message.content.substring(message.content.indexOf(" ") + 1);;
    matchArray.push({game: game, user: message.author.username});
    message.channel.send("A match of " + game + " has started with match number " + matchArray.length + "!");
  }
}

