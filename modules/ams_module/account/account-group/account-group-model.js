const BaseModel = require('../../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'account_group_id';
	static tableName = 'm_account_group';

	static get relationMappings() {
		const AccountType = require('../account-type/account-type-model');

		return {
			account_type: {
				relation: Model.BelongsToOneRelation,
				modelClass: AccountType,
				join: {
					from: 'm_account_group.account_type_id',
					to: 'm_account_type.account_type_id',
				},
			},
		};
	}
}

module.exports = MyModel;
