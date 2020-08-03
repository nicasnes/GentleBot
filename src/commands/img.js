const index = require('../index.js'), request = require('request'), cheerio = require('cheerio');
const prefix = index.prefix;

module.exports = {
  name: 'img',
  description: "Displays an image requested by the user",
  execute(message, args) {
    if (args.length !== 1) {
      displayFirstImage(message);
    } else { 
      message.reply("add an image description such as " + prefix + "img person");
    }
  }
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