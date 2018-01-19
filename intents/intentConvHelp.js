// Module to process the Lex help intent.  Provide some basic help messages.
//
//
module.exports = function(bot, message) {
    bot.startConversation(message,function(err,convo) {
        console.log(`help intent message---${JSON.stringify(message)}`);
        convo.say(`Sorry to hear that.  Let's see what we can do to get you started!`);
        convo.ask('Currently I can help you with one of these options, send which one you are interested in back to me: "greetings", "identify me", "identify you" and "booking a hotel"',[
        {
          pattern: 'greetings',
          callback: function(response,convo) {
            convo.say('Greetings it is!');
            convo.say('>_You can say hi or hello and I should reply accordingly:_');
            convo.next();
          }
        },
        {
          pattern: 'identify me',
          callback: function(response,convo) {
            convo.say('OK you want help with identifying yourself!');
            convo.say('>_what is my name_');
            convo.say('>_who am i_');
            convo.say(':smile_cat:');
            convo.next();
          }
        },
        {
          pattern: 'identify you',
          callback: function(response,convo) {
            convo.say('OK you want help identifying me!');
            convo.say('Here are some things you can ask:');
            convo.say('>_identify yourself_');
            convo.say('>_who are you_');
            convo.say('>_what is your name_');
            convo.say('>_uptime_');
            convo.say(':smile_cat:');
            convo.next();
          }
        },
        {
          pattern: 'booking a hotel',
          callback: function(response,convo) {
            convo.say('OK you want help with booking a hotel!');
            convo.say('Here are some things you can ask:');
            convo.say('>_Book a hotel_');
            convo.say('>_I want a make hotel reservations_');
            convo.say('>_Book a ​3 night stay in ​Chicago_');
            convo.say(':smile_cat:');
            convo.next();
          }
        },
        {
          pattern: bot.utterances.yes,
          callback: function(response,convo) {
            convo.say('Great! I will continue...');
            // do something else...
            convo.next();
          }
        },
        {
          pattern: bot.utterances.no,
          callback: function(response,convo) {
            convo.say('Perhaps later.');
            // do something else...
            convo.next();
          }
        },
        {
          pattern: 'done|nothing|nada|stop',
          callback: function(response,convo) {
            convo.say('Great! I will continue...');
            // do something else...
            convo.next();
          }
        },
        {
          default: true,
          callback: function(response,convo) {
            // just repeat the question
            convo.say('Say _Done_ if you do not need help.');
            convo.repeat();
            convo.next();
          }
        }
      ]);

      });
};
