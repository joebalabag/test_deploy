const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'dept_id';
	static tableName = 'm_department';

	static get relationMappings() {
		const Company = require('../../maintenance_module/company/company-model');

		return {
			company: {
				relation: Model.BelongsToOneRelation,
				modelClass: Company,
				join: {
					from: 'm_department.company_id',
					to: 'm_company.company_id',
				},
			},
		};
	}
}

module.exports = MyModel;
