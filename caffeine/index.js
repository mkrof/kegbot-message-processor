const https = require('https');
const request = require('request-promise-native');

const slashCommand = 'https://olson-kegbot-slack-processor.azurewebsites.net/api/slash-command?code=GnMVP80D9GFI6IBnjDqmYVgSJORPwBeA2/RKlPaEhBqRf7XLL9yopg==';

module.exports = function (context, timer) {

  Promise.all([
    request.get(slashCommand)
  ]).then(() => {
      context.log('success');
      context.done()
    })
    .catch(err => {
      context.log(err.message);
      context.done();
    });
}
