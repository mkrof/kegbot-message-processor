const https = require('https');
const request = require('request-promise-native');

const slashCommand = 'https://olson-kegbot-slack-processor.azurewebsites.net/api/slash-command?code=GnMVP80D9GFI6IBnjDqmYVgSJORPwBeA2/RKlPaEhBqRf7XLL9yopg==';
const webHookUrl = 'https://hooks.slack.com/services/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';

module.exports = function (context, timer) {

  request.post(webHookUrl,{
    form: {
      text: 'From Azure'
    }
  });

  https.get(slashCommand, res => {
    context.log(`SUCCESS ${ res }` );
    context.done();
  }).on('error', err => context.log(`ERROR: ${ err }`));
}
