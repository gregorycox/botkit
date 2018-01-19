

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  usage_tip();
  process.exit(1);
}

var botkitStoragePostgres = require('botkit-storage-postgres');
var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    redirectUri: process.env.oauthRedirectUri,
    storage: botkitStoragePostgres({
      host: process.env.DBconnection,
      user: 'dbadmin',
      password: process.env.DBpassword,
      database: 'botkit'
    }),
    debug: true,
    scopes: ['bot', 'commands', 'users.profile:read'],
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri
};


// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);


controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

// no longer necessary since slack now supports the always on event bots
// // Set up a system to manage connections to Slack's RTM api
// // This will eventually be removed when Slack fixes support for bot presence
// var rtm_manager = require(__dirname + '/components/rtm_manager.js')(controller);
//
// // Reconnect all pre-registered bots
// rtm_manager.reconnect();

// Enable Dashbot.io plugin
// require(__dirname + '/components/plugin_dashbot.js')(controller);


var normalizedPath = require("path").join(__dirname, "skills");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate


if (process.env.studio_token) {
    controller.on('direct_message,direct_mention,mention', function(bot, message) {
        controller.studio.runTrigger(bot, message.text, message.user, message.channel).then(function(convo) {
            if (!convo) {
                // no trigger was matched
                // If you want your bot to respond to every message,
                // define a 'fallback' script in Botkit Studio
                // and uncomment the line below.
                // controller.studio.run(bot, 'fallback', message.user, message.channel);
            } else {
                // set variables here that are needed for EVERY script
                // use controller.studio.before('script') to set variables specific to a script
                convo.setVar('current_time', new Date());
            }
        }).catch(function(err) {
            bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
            debug('Botkit Studio: ', err);
        });
    });
} else {
    console.log('~~~~~~~~~~');
    console.log('NOTE: Botkit Studio functionality has not been enabled');
    console.log('To enable, pass in a studio_token parameter with a token from https://studio.botkit.ai/');
}

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js');
    console.log('Get Slack app credentials here: https://api.slack.com/apps')
    console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
    console.log('~~~~~~~~~~');
}

// in-memory storage to store user auth info
controller.mstorage = {"users": {}};

var lex = require('./botkit-middleware-lex.js')({
  botName: 'botkit',
  botAlias: '$LATEST'
})

controller.middleware.receive.use(lex.receive)

// Respond to all incoming text messages with the response from Lex
controller.on('message_received', function(bot, message) {
  if (message.text) {

      bot.reply(message, message.lex.message)
      console.log(`lex reply--- ${JSON.stringify(message)}`);
      }
})
