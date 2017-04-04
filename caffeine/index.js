const https = require('https');
const request = require('request-promise-native');

const slashCommand = 'https://olson-kegbot-slack-processor.azurewebsites.net/api/slash-command?code=GnMVP80D9GFI6IBnjDqmYVgSJORPwBeA2/RKlPaEhBqRf7XLL9yopg==';
const webHookUrl = 'https://hooks.slack.com/services/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';

module.exports = function (context, timer) {

  const form = {
  };

  const getPayload = messages => ({
    payload: JSON.stringify({
      username: 'Kegbot',
      icon_url: 'https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2017-03-31/162947150962_eb39c4654cee17830ae7_72.png',
      text: ':rotating_light:\n' + messages.join('\n')
    })
  });

  Promise.all([
    request({
      uri:'http://kegberry-olson.eastus2.cloudapp.azure.com:8000/api/kegs',
      qs: {
        api_key: '3a2e3bb8409d4d1a9913e7f9bd166583'
      },
      json: true
    }).then(kegs => kegs.objects.filter(keg => keg.online))
      .then(online => online.map(keg => {
        if (keg.percent_full < 70) {
          return `${ keg.beverage.name }: *${ keg.percent_full.toPrecision(3) }%*`;
        } 
      }))
      .then(messages => {
        if (messages && messages.length > 0) {
          return request.post(webHookUrl, { form: getPayload(messages) })
        } else {
          return 'Enough beer.'
        }
      }),
    request.get(slashCommand)
  ]).then(() => {
      context.log('success');
      context.done()
    })
    .catch(err => {
      context.log(err.message);
      context.done();
    });

  // https.get(slashCommand, res => {
  //   context.log(`SUCCESS ${ res }` );
  //   context.done();
  // }).on('error', err => context.log(`ERROR: ${ err }`));
}
