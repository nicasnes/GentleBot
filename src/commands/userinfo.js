const Discord = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: "Displays the sender's username and profile picture",
  execute(message, args) {
    embedUserInfo(message.author, message.channel);
  }
}

function embedUserInfo(username, channel) {
  let embed = new Discord.MessageEmbed()
      .setTitle('User Information')
      .setColor(0x64ff4c)
      .setThumbnail(username.displayAvatarURL())
      .addField('Name', username.username);
  channel.send(embed);
}