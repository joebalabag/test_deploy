// This middleware will log all parameters sent from the request after execution
// of main function
const fs = require('fs');

// var mw_Logger_A = (req, res, next) => {
//     var url = req.protocol + '://' + req.get('host') + req.originalUrl;

//    	const str = `logger A; Request URL: ${url}\nRequest Params: ${JSON.stringify(req.params)}\nRequest Body: ${JSON.stringify(req.body)}\n\n`;
//    	fs.appendFile('logfile.log', str, function (err) {
//       	if (err) throw err;
//    	});
//     next();
// }

// var mw_Logger_A = (req, res, next) => {
//     var url = req.protocol + '://' + req.get('host') + req.originalUrl;

//    	const str = `logger A; end of execution: ${JSON.stringify(req.params)}\nRequest Body: ${JSON.stringify(req.body)}\n\n`;
//    	fs.appendFile('logfile.log', str, function (err) {
//       	if (err) throw err;
//    	});
//     next();
// }

var mw_Logger_A = (req, res, next) => {
	next();
	Log.log('=============================================');
	Log.log('END OF EXECUTION');
	Log.log('=============================================');

	const reqStr = `\nRequest Params: ` + JSON.stringify(req.params) + `\nEnd:`;
	fs.appendFile('logfile.log', reqStr, function (err) {
		if (err) throw err;
	});
};

module.exports = mw_Logger_A;
