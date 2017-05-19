const qs = require('qs');

const defaults = {
  text: 'help',
  user_name: 'user',
  channel_name: 'test',
  token: 1
};

module.exports = function (params) {
  return {
    body: qs.stringify(Object.assign({}, defaults, params))
  };
};
