const request = require('request-promise-native');

const slashCommandUrl = 'https://olson-kegbot-slack-processor.azurewebsites.net/api/slash-command?code=GnMVP80D9GFI6IBnjDqmYVgSJORPwBeA2/RKlPaEhBqRf7XLL9yopg==';

const message = text => ({
  response_type: 'in_channel',
  mrkdwn: true,
  text
})

module.exports = {
  message,
  wakeSlashCommand: () => request.get(slashCommandUrl)
};
