const cors = require('cors');

//WORKING CODE
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});
