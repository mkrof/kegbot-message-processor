module.exports = function (context, req) {

  const response = text => ({
    response_type: 'in_channel',
    text
  });

  context.log(req.body);
  context.res = response(req.body);
  
	// if (req.body && req.body.token) {
    // context.res = response(`Token: ${ req.body.token }`);
	// } else {
    // context.res = response('Token required.');
	// }
	context.done();
};
