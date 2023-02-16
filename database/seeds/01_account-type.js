//npx knex seed:run --specific=01_account-type.js
exports.seed = function (knex) {
	return knex('m_account_type')
		.select('*')
		.where({ account_type_id: 1 })
		.then(function (rows) {
			if (rows.length === 0) {
				// Inserts seed entries
				return knex('m_account_type').insert([{ company_id: 1 }, { company_id: 1 }]);
			}
		});
};
