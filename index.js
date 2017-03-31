module.exports = function (context, req) {
	context.log('JavaScript HTTP trigger function processed a request.');

	if (req.body && req.body.token) {
		context.res = {
			// status: 200, /* Defaults to 200 */
			body: "Token: " + (req.query.name || req.body.name)
		};
	} else {
		context.res = {
			status: 400,
			body: "Please pass a token on the request body"
		};
	}
	context.done();
};
