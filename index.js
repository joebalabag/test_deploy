require('dotenv').config();
const path = require('path');
const setupDb = require('./database/setup');
const globalSetup = require('./helper/globals');

setupDb();
globalSetup();

global.appRoot = path.resolve(__dirname);
global.appRoute = path.resolve(__dirname + '/routes');
global.appController = path.resolve(__dirname + '/controller');
global.appHelper = path.resolve(__dirname + '/helper');
global.appMiddleware = path.resolve(__dirname + '/middleware/global');
global.appTest = path.resolve(__dirname + '/test');
global.appDb = path.resolve(__dirname + '/database');
global.appPublic = path.resolve(__dirname + '/public');
global.appModules = path.resolve(__dirname + '/modules');

// Packages
const Morgan = require('morgan');
const Express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const Logger = require(`${appHelper}/Logger`);
const Scan = require(`${appHelper}/Scan`);
//const cTVP = require(`${appHelper}/TVP`);
const http = require('http');
const net = require(`net`);
const os = require('os');
const cors = require('cors');

//FOR socket io
// const https = require('http').Server(Express);
// const io = require('socket.io')(http);

// io.on('connection', (socket) => {
// 	console.log('a user connected');
// 	socket.on('disconnect', () => {
// 		console.log('user disconnected');
// 	});

// 	socket.on('chat message', (msg) => {
// 		if (msg == 'hello') {
// 			io.emit('chat message', 'tangina');
// 		} else io.emit('chat message', msg);
// 	});
// });

// global.io = io;
// https.listen(3000, () => {
// 	console.log(`Socket.IO server running at http://localhost/`);
// });
//end of socket io

// var _DB1 = require(`${global.appDb}/dbc`);
// global.dbc = new _DB1();

const jwt = require('jsonwebtoken');
const urlshortener = require('node-url-shortener');
//add
//const http = require('http');
const WebSocket = require('ws');
const { decode } = require('punycode');
const { json } = require('body-parser');

// const swaggerUI = require('swagger-ui-express');
// const swaggerDocument = require('./swagger');

// Package instantiations
const app = new Express();
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

var publicDir = require('path').join(__dirname, '/public');
app.use(Express.static(publicDir));

global.publicdirectory = publicDir;

app.options('*', cors());

const server = http.createServer(app);
global.io = require('socket.io')(server, {
	cors: {
		origin: '*',
	},
});

const Scanner = new Scan();
const Log = new Logger();
// const TVP = new cTVP();
const ifaces = os.networkInterfaces();

global.app = app;
global.Log = Log;
// global.TVP = TVP;

// Middleware
Log.watch('Scanning and including JS files in Middleware directory');
//Log.watch(publicDir);

if (!Scanner.recursiveRouteScan(`${global.appMiddleware}`)) {
	Log.error('ERRORS HAVE BEEN FOUND IN THE FOLLOWING MIDDLEWARE FILES');
	Scanner.errorFiles.forEach((file) => {
		Log.error(`\t${file}`);
	});
}

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	bodyParser.json({
		limit: '5mb',
	})
);
app.use(Morgan('short'));

Log.watch('Scanning and including JS files in Route directory');
// Read all middlewares from routes folder
Scanner.clearFiles();
if (!Scanner.recursiveRouteScan(`${global.appModules}`)) {
	Log.error('ERRORS HAVE BEEN FOUND IN THE FOLLOWING ROUTE FILES');
	Scanner.errorFiles.forEach((file) => {
		Log.error(`\t${file}`);
	});
}

// // Sockets (Holds all tcp connections made with the api)
// var sockets = [];

// // Create a TCP socket listener
// var socket_server = net.Server(function (socket) {
// 	sockets.push(socket);
// 	socket.on('data', function (msg) {
// 		Log.log('Broadcasting message to all connected sockets');
// 		for (var i = 0; i < sockets.length; i++) {
// 			try {
// 				if (sockets[i] == socket) continue;
// 				sockets[i].write(msg);
// 			} catch (err) {
// 				Log.error(err.message);
// 			}
// 		}
// 	});

// 	socket.on('end', function () {
// 		var i = sockets.indexOf(socket);
// 		sockets.splice(i, 1);
// 	});

// 	socket.on('error', (err) => {
// 		Log.error(err.message);
// 	});
// });

//comment out lang no need naman sbng.
// socket_server.listen(process.env.SOCKET_PORT);
// Log.watch(`STARTING NOTIFICATION SERVER AT PORT ${process.env.SOCKET_PORT}`);

//var socket_client = new net.Socket();

// Log.log(`CREATING GLOBAL NOTIFICATION CLIENT`);
// socket_client.connect(process.env.SOCKET_PORT, '127.0.0.1', function () {
// 	Log.log('A client has connected');
// });

global.notify = (message) => {
	socket_client.write(message);
	console.log(message);
};

global.responseData = (response, isforcelist = 0) => {
	if (isforcelist == 0) {
		global.RouteLogs('array # ' + response.rowsAffected.length);
		if (response.rowsAffected.length >= 1) {
			global.RouteLogs('array last # ' + response.rowsAffected[response.rowsAffected.length - 1]);
			if (response.rowsAffected[response.rowsAffected.length - 1] > 1) return response.recordsets[0];
			else return response.recordsets[0][0];
		} else return response.recordsets[0];
	} //force array ang result..
	else return response.recordsets[0];

	// else
	// {
	//     if(response.rowsAffected[0] == 1)
	//         return response.recordsets[0][0];
	//     else if(response.rowsAffected > 1)
	//         return response.recordsets[0];
	//     else
	//         return response.recordsets[0];//.recordsets[0];
	// }
};
global.GetLengthResponse = (response) => {
	//ADD MORE CONDITIONS -- if stored proc has sub queries (crud or temp tables), rows affected format changes
	//Example Rows affected : 1, 0, 0, 38 //

	//console.log(response);
	if (response.rowsAffected.length == 2) return response.rowsAffected[1];
	else if (response.rowsAffected.length > 2) return response.rowsAffected[2];
	else if (response.rowsAffected.length == 1) return response.rowsAffected[0];
	else return 0;
};

global.apiResponse = (res, response, status = 'SE', message) => {
	let messageStr = message;
	let statusNum = 200;
	let resultStatus = status;

	// console.log(message?.statusCode);
	// // console.log(message?.statusCode);
	// // console.log(response);
	// // console.log(status);
	// // console.log(message);
	// //if()
	// if (response.length > 0) {
	// 	resultStatus = 'OK';
	// 	messageStr = 'Success';
	// } else if (response == undefined) {
	// 	resultStatus = 'SE';
	// 	messageStr = 'system error.';
	// } else {
	// 	resultStatus = 'NDF';
	// 	messageStr = 'No data found.';
	// 	//possible no data found..
	// }

	////ORIGINAL ERROR MESSAGE
	if (status == 'NDF') {
		messageStr = 'No data found';
	} else if (status == 'OK') {
		messageStr = message ?? 'Success';
	} else if (typeof message != 'string') {
		resultStatus = 'VE';
		let myerr = new Error(message);
		messageStr = myerr.message;
	} else if (status == 'SE') {
		messageStr = 'Please contact system admin.';
	}

	if (Array.isArray(response) && response.length === 0) {
		resultStatus = 'NDF';
		messageStr = 'No data found';
	}

	if (response == undefined) {
		resultStatus = 'NDF';
	} else if (status == 'OK') {
		statusNum = 200;
	} else {
		statusNum = message?.statusCode ?? 500;
	}

	if (message instanceof TypeError) {
		statusNum = 500;
	}

	if (message?.statusCode == 413) {
		messageStr = 'File too large';
	}

	if (response == 1) {
		response = null;
	}

	res.status(statusNum);
	res.json({
		response,
		message: messageStr,
		result_status: resultStatus,
	});
};

server.listen(process.env.PORT, (err) => {
	if (err) Log.error(err.message);
	else Log.watch(`STARTING SERVER AT PORT ${process.env.PORT}`);
});

global.RouteLogs = (params) => {
	if (process.env.NODE_ENV == 'development') {
		//console.log("=====Parameters====");
		console.log(JSON.stringify(params, null, 4));
		//console.log("===================");
		//Log.error(err.message);
	}
};

global.ConsoleLog = (params) => {
	if (process.env.NODE_ENV == 'development') {
		//console.log("=====Parameters====");
		console.log(params);
		//console.log("===================");
		//Log.error(err.message);
	}
};

global.resultparams = (response, message, http_code) => {
	retObj = {
		'response': response,
		'message': message,
	};

	if (http_code) retObj['http_code'] = http_code == null ? 200 : http_code;
	return retObj;
};

app.use(Express.json({ limit: '5mb' }));
