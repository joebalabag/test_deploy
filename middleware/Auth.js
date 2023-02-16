const jwt = require('jsonwebtoken');

//WORKING CODE
module.exports = (req, res, next) => {
	routesWithoutAuth = [
		// '/v1/PatientRecords/Login'   ,
		'/v1/Access/Login',
	];

	if (routesWithoutAuth.includes(req.path)) next();
	// else if(req.path.includes('/v1/PatientRecords/Login'))
	//     next()
	else {
		try {
			// const token = req.headers.authorization.split(" ")[1];
			const token = req.headers.authorization;

			if (process.env.NODE_ENV == 'production') {
				jwt.verify(token, process.env.JWT_KEY, (error, authenticatedUser) => {
					if (error) return res.sendStatus(403);

					req.authenticatedUser = authenticatedUser;
					next();
				});
			} else if (process.env.NODE_ENV == 'development') {
				if (token == process.env.DEV_TOKEN) next();
				else {
					jwt.verify(token, process.env.JWT_KEY, (error, authenticatedUser) => {
						if (error) {
							return res.status(403).json({
								message: 'HTTP Error 403: Unable to connect, invalid token.',
							});
						}
						req.authenticatedUser = authenticatedUser;
						next();
					});
				}
			}
		} catch (error) {
			return res.status(401).json({
				message: 'Auth failed',
			});
		}
	}
};
