
module.exports.authorizeUser = (req, res, next) => {
	req.app.db.models.User.findOne({ s3Token: req.headers["authorization"] }, (err, user) => {
		if (err) {
			return res.status(200).json({ status: false, message: 'Please check all fields' });
		}
		else {
			if (user == null) {
				res.status(401).json({ status: false, message: 'Invalid api token' });
			}
			else {
				req.userName = user.userName;
				next();
			}
		}
	});
};