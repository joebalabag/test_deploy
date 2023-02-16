const BaseModel = require('../../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'account_type_id';
	static tableName = 'm_account_type';

	static get relationMappings() {
		const AccountGroup = require('../account-group/account-group-model');

		return {
			account_group: {
				relation: Model.HasManyRelation,
				modelClass: AccountGroup,
				join: {
					from: 'm_account_type.account_type_id',
					to: 'm_account_group.account_type_id',
				},
			},
		};
	}
}

module.exports = MyModel;
