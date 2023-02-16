const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'terminal_id';
	static tableName = 'pos_terminal';

	static get relationMappings() {
		const Company = require('../company/company-model');

		return {
			company: {
				relation: Model.BelongsToOneRelation,
				modelClass: Company,
				join: {
					from: 'pos_terminal.company_id',
					to: 'm_company.company_id',
				},
			},
		};
	}
}

module.exports = MyModel;
