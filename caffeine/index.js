const slack = require('../core/services/slack');

module.exports = function (context, timer) {
  Promise.all([
    slack.wakeSlashCommand();
  ]).then(() => {
      context.log('success');
      context.done()
    })
    .catch(err => {
      context.log(err.message);
      context.done();
    });
}
