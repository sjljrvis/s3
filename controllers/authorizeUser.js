const request = require('request');

module.exports.authorizeUser = (req, res, next) => {

	const options = {
		method: "POST",
		url: "http://tocstack.com:5555/login",
		body: {
			email: req.body.email,
			password: req.body.password
		},
		json: true
	};

	request(options, (err, response, body) => {
		if (body.status) {
			req.userName = body.userName;
			return next();
		}
		else {
			return res.json({ status: false, message: "Fatal Authentication" })
		}
	});

}
