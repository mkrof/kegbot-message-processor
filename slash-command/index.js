const qs = require('qs');
const request = require('request-promise-native');

const getAnswer = (question, userName) => new Promise((resolve, reject) => {
  if (question && question.toLowerCase().indexOf('tap') > -1) {
    resolve('getting the beer list!');
    // request('http://40.70.73.9:8000/api/taps')
    //   .then(taps => taps.map(tap => {
    //     resolve(taps);
    //     const beverage = tap.current_keg.beverage;
    //     resolve(
    //       `A fine ${ beverage.style } produced by ${ beverage.producer.name }.`  
    //     );
    //   }))
    //   .catch(() => resolve('Contact technical support!'));
  } else {
    resolve(`Good day you you, ${ userName }`);
  }
})

module.exports = function (context, req) {

  const response = text => ({
    response_type: 'in_channel',
    text
  });

  const body = qs.parse(req.body);

  if (body.token === 'uMdQWoCNsKmB3lPTbvHaEA31') {
    getAnswer(body.text, body.user_name)
      .then(answer => context.res = answer)
      .catch(err => context.log(err));
  } else {
    context.res = 'Invalid token.'
  }

  context.log(req.body);
  context.res = response(req.body);

	context.done();
};
