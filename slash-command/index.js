const qs = require('qs');
const services = require('../core/services');
const text = require('../core/text');
const request = require('request-promise-native');
const osmosis = require('osmosis');

const getAnswer = (body) => new Promise((resolve, reject) => {
  const question = body.text;
  const userName = body.user_name;
  if (!question || typeof question !== 'string') {
    resolve(text.greeting(userName));
  } else if (question.toLowerCase().indexOf('request body') > -1) {
    resolve(Object.keys(body).map(key => `${ key }: ${ body[key] }\n`).join(''));
  } else if (question.toLowerCase().indexOf('cheers') > -1) {
    resolve(text.cheers());
  } else if (question.toLowerCase().indexOf('help') > -1) {
    resolve(text.help(userName));
  } else if (question.toLowerCase().indexOf('dance') > -1) {
    resolve(text.dance(userName));
  } else if (question.toLowerCase().indexOf('total wine') > -1) {
    const beers = [];
    osmosis.get('http://www.totalwine.com/beer/kegs/c/41520?pagesize=200')
      .find('h2.plp-product-title > a')
      .set('beer')
      .data(function(data) {
        beers.push(data.beer);
      }).done(() => {
        resolve(
          beers.join('\n');
        );
      });
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
      .catch(err => resolve(text.technicalSupport()));
  } else {
    resolve(text.cheers());
  }
});

module.exports = function (context, req) {
  const body = qs.parse(req.body);

  if (process.env.SLACK_CHANNEL_NAMES.split(' ').indexOf(body.channel_name) === -1) {
    context.log(`Kegbot not available in #${ body.channel_name }`);
    context.done();
    //} else if (body.token === process.env.SLACK_TOKEN) {
  } else if (true) {
    getAnswer(body)
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
