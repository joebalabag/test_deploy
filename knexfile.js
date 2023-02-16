// Update with your config settings.
require('dotenv').config();

module.exports = {
	development: {
		client: 'mysql2',
		// useNullAsDefault: true,
		connection: {
			host: process.env.DB_SERVER,
			// port: 1433,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			// typeCast(field, next) {
			// 	// console.log(field.type, '============================================');
			// 	// console.log(field.string(), '!!============================================');
			// 	// Convert 1 to true, 0 to false, and leave null alone
			// 	if (field.type === 'TINY' && field.length === 1) {
			// 		const value = field.string();
			// 		return value ? value === true : null;
			// 	}
			// 	return next();
			// },

			// host : process.env.APP_HOST,
			// port : process.env.DB_PORT,
			// user : 'root',
			// password : process.env.DB_PASSWORD,
			// database : 'hybrain_test'
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: './database/migrations',
			tableName: 'migrations',
		},
		seeds: {
			directory: './database/seeds',
		},
	},
	production: {
		client: 'mysql2',
		connection: {
			host: process.env.APP_HOST,
			// port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: './database/migrations',
			tableName: 'migrations',
		},
		seeds: {
			directory: './database/seeds',
		},
	},
};
