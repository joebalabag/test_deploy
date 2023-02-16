const fs = require('fs');
const tags = require('./docs/tags');

let schemas = {};
let paths = {};

fs.readdirSync('./docs/schemas/').forEach((file) => {
	const schemaFile = require(`./docs/schemas/${file}`);
	schemas = { ...schemas, ...schemaFile };
});

fs.readdirSync('./docs/paths/').forEach((file) => {
	const pathFile = require(`./docs/paths/${file}`);
	paths = { ...paths, ...pathFile };
});

module.exports = {
	openapi: '3.0.1',
	info: {
		'title': 'Library API',
		'version': '1.0.0',
		'description': 'A simple Express Library API',
	},
	tags,
	components: {
		schemas,
	},
	paths,
	servers: [
		{
			url: 'http://localhost:3001',
		},
	],
};
