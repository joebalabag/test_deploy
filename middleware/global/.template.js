// if last character is A, middleware should be executed after
// execution of main proc

// if last character is B, middleware should be executed before
// execution of main proc

// se README.md for details
var mw_MiddlewareName_AB = (req, res, next) => {
	/*
	 *  Adding functions here will execute this middleware before execution of main proc
	 */
	next();
	/*
	 *  Adding functions here will execute this middleware after execution of main proc
	 */
};

module.exports = mw_MiddlewareName_B;
