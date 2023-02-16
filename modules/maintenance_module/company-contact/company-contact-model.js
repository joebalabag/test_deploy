const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'company_contact_id';
	static tableName = 'm_company_contact';

	static get relationMappings() {
		const Company = require('../company/company-model');

		return {
			company: {
				relation: Model.BelongsToOneRelation,
				modelClass: Company,
				join: {
					from: 'm_company_contact.company_id',
					to: 'm_company.company_id',
				},
			},
		};
	}
}

module.exports = MyModel;
