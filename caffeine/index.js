const http = require('http');

const slashCommand = 'https://olson-kegbot-slack-processor.azurewebsites.net/api/slash-command?code=GnMVP80D9GFI6IBnjDqmYVgSJORPwBeA2/RKlPaEhBqRf7XLL9yopg==';

module.exports = function (context, timer) {
  http.get(slashCommand, res => {
    context.log(`SUCCESS ${ res }` );
    context.done();
  }).on('error', err => context.log(`ERROR: ${ err }`));
}
