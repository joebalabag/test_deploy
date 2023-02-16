const cluster = require('cluster');

if (cluster.isMaster) {
	console.log('Initializing API');
	console.log('Creating cluster for load balancing');
	var cpuCount = require('os').cpus().length;
	console.log(`This API will be ${cpuCount} cores`);
	console.log(`Forking API to each core...`);

	for (var i = 0; i < cpuCount; i++) {
		cluster.fork();
	}
	console.log('Cluster creation finished');

	cluster.on('exit', function () {
		console.log(`A CLUSTER WORKER HAS EXITED, CREATING NEW CLUSTER`);
		cluster.fork();
	});
} else {
	require('./app');
}
