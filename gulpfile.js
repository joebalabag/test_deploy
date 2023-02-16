const EXECALL = false; //if true => execute all stored procedure; else specific stored procedure..
const EXECMYFILE = false;
const AGE_THRESHOLD = 5 * 60 * 1000; // num of minutes * 60secs * 1000miliseconds

const gulp = require('gulp');
const watch = require('gulp-watch');
const path = require('path');
const fs = require('fs');

global.appHelper = path.resolve(__dirname + '/helper');

const Logger = require(`${appHelper}\\Logger`);
const JSDateTime = require(`${appHelper}\\JSDateTime`);
const Log = new Logger();
const jsdt = new JSDateTime();

global.appDb = path.resolve(__dirname + '/database');
global.appSp = path.resolve(__dirname + '/storedproc');
global.Log = Log;

// Database Classes
var _DB1 = require(`${global.appDb}\\dbc`);

dbc = new _DB1();

//
// <summary>
// Build function for recursive scan of changed stored procedures
// </summary>
//
function build() {
	Log.watch('BUILD WATCH STARTED');
	recursiveSPScan(`${global.appSp}`, local);
}

//
// <summary>
// Recursive scan for stored proc
// </summary>
//
function recursiveSPScan(filepath, pool) {
	fs.readdirSync(filepath).forEach((file) => {
		if (fs.lstatSync(filepath + `\\` + file).isDirectory()) {
			Log.log(`PERFORMING SCAN IN ${filepath}\\${file}`);
			if (file == 'bamc') pool = bamc.pool;
			else if (file == 'dbc') pool = dbc.pool;
			else pool = local.pool;

			recursiveSPScan(filepath + `\\` + file, pool);
		}
		try {
			if (file.indexOf(`.sql`) >= 0) {
				Log.log(`USING:\\${filepath}\\${file}`);

				var file_dt = getFileUpdatedDate(`${filepath}\\${file}`);
				var date = new Date();

				var includeInUpdate = true;
				if (!EXECALL) {
					if (date - new Date(file_dt) > AGE_THRESHOLD) {
						includeInUpdate = false;
					}
				}

				if (includeInUpdate) {
					Log.watch(`UPDATING ${filepath}\\${file}`);
					fs.readFile(`${filepath}\\${file}`, function read(err, data) {
						if (err) {
							Log.error(err.message);
							throw err;
						}
						content = data;
						let query_clause = content.toString('utf-8').split(/\bgo\b/gi);
						query_clause = query_clause.reverse();

						execQuery(query_clause, pool);
					});
				}
			}
		} catch (e) {
			Log.error(e.message);
		}
	});

	return;
}

//
// <summary>
// Gets the datetime (ISO Format) when the file was updated
// </summary>
//
const getFileUpdatedDate = (path) => {
	const stats = fs.statSync(path);
	return stats.mtime;
};

//
// <summary>
// Executes all queries in an sql file
// </summary>
//
async function execQuery(query_pool, db_pool) {
	try {
		let query = query_pool.pop();
		let pool_request = db_pool.request();
		let response = await pool_request.query(query, (err, result) => {
			if (err) {
				console.log(err.message);
				return 0;
			} else {
				if (query_pool.length > 0) {
					execQuery(query_pool, db_pool);
				}
				return 1;
			}
		});
	} catch {
		console.log('ERROR');
	}
}

//
// <summary>
// Creates a watcher for file changes in storedproc folder
// </summary>
//
gulp.task('watch', function () {
	var path = `${global.appSp}/**/*.*`;
	path = path.replace(/\\/g, '/');
	Log.log(`STARTING GULP WATCHER @ ${path}`);

	watch(path, function () {
		build();
	});
});
