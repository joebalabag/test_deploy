const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (token == process.env.DEV_TOKEN) {
		next();
	} else {
		jwt.verify(token, process.env.JWT_KEY, (err, user) => {
			if (err) {
				return res.status(403).json({
					message: 'Unauthorized',
				});
			}

			req.user = user;
			next();
		});
	}
};

module.exports = authenticate;
