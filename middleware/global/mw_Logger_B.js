// This middleware will log all parameters sent from the request prior to execution
// of main function

const fs = require('fs');

var mw_Logger_B = (req, res, next) => {
	var url = req.protocol + '://' + req.get('host') + req.originalUrl;

	//const str = `Request URL: ${url}\nRequest Params: ${JSON.stringify(req.params)}\nRequest Body: ${JSON.stringify(req.body)}\n\n`;
	const str = `\n\nStart: \nRequest URL:` + url; //\nRequest Body: ${JSON.stringify(req.body)}\n\n`;

	fs.appendFile('logfile.log', str, function (err) {
		if (err) throw err;
	});
	next();
};

// var mw_Logger_B = (req, res, next) => {
//     var url = req.protocol + '://' + req.get('host') + req.originalUrl;

//    	//const str = `Request URL: ${url}\nRequest Params: ${JSON.stringify(req.params)}\nRequest Body: ${JSON.stringify(req.body)}\n\n`;
//     const str = `\n\nRequest URL:`+url+`\nRequest Params: ${JSON.stringify(req.params)}`;//\nRequest Body: ${JSON.stringify(req.body)}\n\n`;

//     fs.appendFile('logfile.log', str, function (err) {
//       	if (err) throw err;
//    	});
//     next();
// }

// var mw_Logger_B = (req, res, next) => {
//     next();
//     Log.log("=============================================");
//     Log.log(`Executing from: ${req.url}`);
//     Log.log("=============================================");
//     const reqStr = JSON.stringify(req.params);
//     //const str = `Requesting URL: ${req.url}`;
//    fs.appendFile('logfile.log', reqStr, function (err) {
//       if (err) throw err;
//    });
// }

module.exports = mw_Logger_B;
// var mw_Logger_B = (req, res, next) => {
//     Log.log("=============================================");
//     Log.log(`Executing from: ${req.url}`);
//     Log.log("=============================================");
//     // Log.log(`PARAMS`);
//     // if(req.params)
//     // {
//     //     Log.watch(`\treq.params:`);
//     //     Log.watch(`\t${JSON.stringify(req.params)}`);
//     // }

//     // //if(req.body) {
//     //     // Log.watch(`\treq.body:`);
//     //     // Log.watch(`\t${JSON.stringify(req.body)}`);
//     // //}..

//     // if(req.query) {
//     //     Log.watch(`\treq.query:`);
//     //     Log.watch(`\t${JSON.stringify(req.query)}`);
//     // }
//     // Log.log("=============================================");

//     next();
// }

// module.exports = mw_Logger_B;
