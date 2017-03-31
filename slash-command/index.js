const qs = require('qs');
const request = require('request-promise-native');

const getAnswer = (question, userName) => new Promise((resolve, reject) => {
  if (question && question.toLowerCase().indexOf('tap') > -1) {
    request('http://kegberry-olson.eastus2.cloudapp.azure.com:8000/api/taps')
      .then(taps => taps.map(tap => {
        const beverage = tap.current_keg.beverage;
        resolve(`A fine ${ beverage.style } produced by ${ beverage.producer.name }.`);
      }))
      .catch(() => resolve('Contact technical support!'));
  } else {
    resolve(`Good day you you, ${ userName }`);
  }
});

module.exports = function (context, req) {
  const response = text => ({
    response_type: 'in_channel',
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
