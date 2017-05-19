const minimist = require('minimist');
const qs = require('qs');
const kegbot = require('../slash-command');
const argv = minimist(process.argv.slice(2));

const context = () => {
  let done;
  let res;
  const p = new Promise((resolve, reject) => (done = () => resolve(res)));
  p.done = done;
  p.log = console.log;
  Object.defineProperty(p, 'res', { set(val) { res = val; } });
  return p;
};

const req = (params) => {
  const defaults = {
    text: 'help',
    user_name: 'user',
    channel_name: 'test',
    token: 1
  };

  return {
    body: qs.stringify(Object.assign({}, defaults, params))
  };
};

process.env.SLACK_CHANNEL_NAMES = 'test';

const ctx = context();
ctx.then(res => console.log('response', res));

kegbot(ctx, req(argv));
