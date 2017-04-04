const qs = require('qs');
const request = require('request-promise-native');

const getAnswer = (question, userName) => new Promise((resolve, reject) => {
  if (!question || typeof question !== 'string') {
    resolve(`Good day to you, ${ userName }. :beer:`);
  } else if (question.toLowerCase().indexOf('cheers') > -1) {
    resolve(`:beers:`);
  } else if (question.toLowerCase().indexOf('help') > -1) {
    resolve(`
      Good day to you, ${ userName }. :beer:\n
      Try asking me something like:\n
      - What's on tap?\n
      - How much is left?
    `);
  } else if (question.toLowerCase().indexOf('dance') > -1) {
    resolve(`:dancers:`);
  } else if (question.toLowerCase().indexOf('tap') > -1) {
    request({
      uri:'http://kegberry-olson.eastus2.cloudapp.azure.com:8000/api/taps',
      qs: {
        api_key: process.env.KEGBOT_API_KEY
      },
      json: true
    }).then(taps => taps.objects.map(tap => {
        const beverage = tap.current_keg.beverage;
        return `- ${ beverage.name }, a fine ${ beverage.style } produced by ${ beverage.producer.name }.`;
      }))
      .then(messages => {
        const response = messages.length > 1 ? `A few selections, ${ userName }:\n` : '';
        resolve(response + messages.join('\n'));
      })
      .catch(() => resolve(':electric_plug::zap:Contact technical support!'));
  } else if (
    question.toLowerCase().indexOf('status') > -1
    || (question.toLowerCase().indexOf('beer') > -1 && question.toLowerCase().indexOf('left') > -1)
    || (question.toLowerCase().indexOf('much') > -1 && question.toLowerCase().indexOf('left') > -1)
  ) {
    request({
      uri:'http://kegberry-olson.eastus2.cloudapp.azure.com:8000/api/kegs',
      qs: {
        api_key: process.env.KEGBOT_API_KEY
      },
      json: true
    }).then(kegs => kegs.objects.filter(keg => keg.online))
      .then(online => online.map(keg => {
        const remaining = keg.percent_full;
        const emoji = (percentFull => {
          let e = ':scream:';
          if (percentFull > 10) e = ':dizzy_face:';
          if (percentFull > 20) e = ':cold_sweat:';
          if (percentFull > 40) e = ':worried:';
          if (percentFull > 60) e = ':slightly_smiling_face:';
          if (percentFull > 85) e = ':smile:';
          return e;
        })(remaining);
        return `- ${ keg.beverage.name } *${ remaining.toPrecision(3) }%* remaining! ${ emoji }`;
      }))
      .then(messages => {
        resolve(messages.join('\n'));
      })
      .catch(() => resolve(':electric_plug::zap:Contact technical support!'));
  } else {
    resolve(`:beers:`);
  }
});

module.exports = function (context, req) {
  const response = text => ({
    response_type: 'in_channel',
    mrkdwn: true,
    text
  });

  const body = qs.parse(req.body);

  if (body.token === process.env.SLACK_TOKEN) {
    getAnswer(body.text, body.user_name)
      .then(answer => {
        context.res = response(answer);
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
