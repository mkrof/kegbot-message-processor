module.exports = function (context, req) {
	context.log('JavaScript HTTP trigger function processed a request.');

  const response = text => ({
    response_type: 'in_channel',
    text
  });

	if (req.body && req.body.token) {
    context.res = response(`Token: ${ req.body.token }`);
		// context.res = {
		// 	// status: 200, /* Defaults to 200 */
		// 	body: "Token: " + req.body.token
		// };
	} else {
    context.res = response('Token required.');
		// context.res = {
		// 	status: 400,
		// 	body: "Please pass a token on the request body"
		// };
	}
	context.done();
};
