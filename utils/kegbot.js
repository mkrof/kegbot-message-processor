const minimist = require('minimist');
const qs = require('qs');
const kegbot = require('../slash-command');
const argv = minimist(process.argv.slice(2));
const context = require('./context');
const req = require('./slack-request');

process.env.SLACK_CHANNEL_NAMES = 'test';

const ctx = context();
ctx.then(res => console.log('response', res));

kegbot(ctx, req(argv));
