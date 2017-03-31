const qs = require('qs');
const request = require('request-promise-native');

const getAnswer = (question, userName) => new Promise((resolve, reject) => {
  if (!question || typeof question !== 'string') {
    resolve(`Good day to you, ${ userName }. :beer:`);
  } else if (question.toLowerCase().indexOf('help' > -1)) {
    resolve(`
      Good day to you, ${ userName }. :beer:\n
      Try asking me something like:\n
      - What's on tap?\n
      - How much is left?
    `);
  } else if (question.toLowerCase().indexOf('dance' > -1)) {
    resolve(`:dancers:`);
  } else if (question.toLowerCase().indexOf('tap') > -1) {
    request({
      uri:'http://kegberry-olson.eastus2.cloudapp.azure.com:8000/api/taps',
      qs: {
        api_key: '3a2e3bb8409d4d1a9913e7f9bd166583'
      },
      json: true
    }).then(taps => taps.objects.map(tap => {
        const beverage = tap.current_keg.beverage;
        resolve(`A fine ${ beverage.style } produced by ${ beverage.producer.name }.`);
      }))
      .catch(() => resolve('Contact technical support!'));
  }
});

module.exports = function (context, req) {
  const response = text => ({
    response_type: 'in_channel',
    mrkdwn: true,
    text
  });

  const body = qs.parse(req.body);

  if (body.token === 'uMdQWoCNsKmB3lPTbvHaEA31') {
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
