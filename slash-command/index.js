const qs = require('qs');
const services = require('../core/services');
const text = require('../core/text');
const request = require('request-promise-native');

const getAnswer = (question, userName) => new Promise((resolve, reject) => {
  if (!question || typeof question !== 'string') {
    resolve(text.greeting(userName));
  } else if (question.toLowerCase().indexOf('cheers') > -1) {
    resolve(text.cheers());
  } else if (question.toLowerCase().indexOf('help') > -1) {
    resolve(text.help(userName));
  } else if (question.toLowerCase().indexOf('dance') > -1) {
    resolve(text.dance(userName));
  } else if (question.toLowerCase().indexOf('tap') > -1) {
    services.kegbot.taps()
      .then(taps => taps.objects.map(tap => {
        const beverage = tap.current_keg.beverage;
        return text.drinkDescription(beverage.name, beverage.style, beverage.producer.name);
      }))
      .then(messages => {
        const response = messages.length > 1 ? `A few selections, ${ userName }:\n` : '';
        resolve(response + messages.join('\n'));
      })
      .catch(() => resolve(text.technicalSupport()));
  } else if (
    question.toLowerCase().indexOf('status') > -1
    || (question.toLowerCase().indexOf('beer') > -1 && question.toLowerCase().indexOf('left') > -1)
    || (question.toLowerCase().indexOf('much') > -1 && question.toLowerCase().indexOf('left') > -1)
  ) {
    services.kegbot.kegs()
      .then(kegs => kegs.objects.filter(keg => keg.online))
      .then(online => online.map(keg => text.kegStatus(keg.beverage.name, keg.percent_full)))
      .then(messages => resolve(messages.join('\n')))
      .catch(err => resolve(text.technicalSupport());
  } else {
    resolve(text.cheers());
  }
});

module.exports = function (context, req) {
  const body = qs.parse(req.body);
  if (body.token === process.env.SLACK_TOKEN) {
    getAnswer(body.text, body.user_name)
      .then(answer => {
        context.res = services.slack.message(answer);
        context.done();
      })
      .catch(err => {
        context.log(err);
        context.done();
      });
  } else {
    context.res = 'Invalid token.'
    context.done();
  }
};
