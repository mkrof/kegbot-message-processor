const request = require('request-promise-native');

const requestOpts = uri => ({
  uri,
  qs: { api_key: process.env.KEGBOT_API_KEY },
  json: true
});

const taps = () => request(requestOptions(`${ process.env.KEGBOT_SERVER_URL }/api/taps`));
const kegs = () => request(requestOptions(`${ process.env.KEGBOT_SERVER_URL }/api/kegs`));

module.exports = {
  taps,
  kegs
};
