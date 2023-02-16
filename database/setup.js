const knex = require('knex');
const knexfile = require('../knexfile');
const { Model } = require('objection');
const e = require('express');

async function setupDb() {
	//try {

	const db = knex(knexfile.development);
	const connection = await Model.knex(db);
	//console.log('connect...');
	// } catch (err) {
	// 	console.log('Unable to connect...');
	// }
	// if (!knex.pool) {
	// 	console.log('Unable to connect...');
	// } //throw new Error('Not connected');
	//console.log(db.on);

	db.raw('SELECT 1')
		.then(() => {
			console.log(' ' + process.env.DB_DATABASE + ' : Database connected');
		})
		.catch((e) => {
			console.log('Database not connected');
			console.error(e);
		});
}

module.exports = setupDb;
