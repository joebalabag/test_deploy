const sql = require('mysql');

class DBConnection {
	constructor() {
		this.pool = new sql.createConnection({
			driver: 'mysql2',
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			server: process.env.DB_SERVER,
			database: process.env.DB_DATABASE,
			options: {
				encrypt: false,
				trustedConnection: true,
			},
		});
		this.connect();
	}

	async connect() {
		await new Promise((resolve, reject) => {
			try {
				this.pool.connect(() => {
					resolve(this.pool.connected);
				});
			} catch (err) {
				reject(err.message);
			}
		}).then((connection_state) => {
			Log.log(
				process.env.DB_DATABASE + ` Database Connection State: ${connection_state == false ? `No Connection` : `Connected`}`
			);
			if (!connection_state) {
				Log.error(`API Cannot connect to Server`);
				//Log.error(`Please check your database configuration at ./database/dbconnect.js`);
			}
		});
	}
}
module.exports = DBConnection;
