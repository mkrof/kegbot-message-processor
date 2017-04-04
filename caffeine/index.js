const https = require('https');
const request = require('request-promise-native');

const slashCommand = 'https://olson-kegbot-slack-processor.azurewebsites.net/api/slash-command?code=GnMVP80D9GFI6IBnjDqmYVgSJORPwBeA2/RKlPaEhBqRf7XLL9yopg==';
const webHookUrl = 'https://hooks.slack.com/services/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';

module.exports = function (context, timer) {

  const form = {
    payload: JSON.stringify({
      username: 'Kegbot',
      icon_url: 'https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2017-03-31/162947150962_eb39c4654cee17830ae7_72.png',
      text: "Hello from Azure!"
    })
  }

  const requests = [
    request.post(webHookUrl, { form }),
    request.get(slashCommand)
  ];

  Promise.all(requests)
    .then(() => {
      context.log('success');
      context.done()
    })
    .catch(err => {
      context.log(err.message);
      context.done();
    });

  // https.get(slashCommand, res => {
  //   context.log(`SUCCESS ${ res }` );
  //   context.done();
  // }).on('error', err => context.log(`ERROR: ${ err }`));
}
