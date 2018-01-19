
module.exports = function(bot, message) {
    bot.startConversation(message,function(err,convo) {
        console.log(`message===>${JSON.stringify(message)}`);
        convo.say(`${message.lex.response}`);

      });
};
