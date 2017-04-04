const request = require('request-promise-native');

const slashCommandUrl = process.env.SLASH_COMMAND_FUNCTION_URL;

const message = text => ({
  response_type: 'in_channel',
  mrkdwn: true,
  text
})

module.exports = {
  message,
  wakeSlashCommand: () => request.get(slashCommandUrl)
};
