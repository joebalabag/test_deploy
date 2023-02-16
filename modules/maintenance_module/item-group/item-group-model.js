const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'item_group_id';
	static tableName = 'm_item_group';

	static get relationMappings() {
		const Company = require('../company/company-model');

		return {
			company: {
				relation: Model.BelongsToOneRelation,
				modelClass: Company,
				join: {
					from: 'm_item_group.company_id',
					to: 'm_company.company_id',
				},
			},
		};
	}
}

module.exports = MyModel;
