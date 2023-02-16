const BaseModel = require('../../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'account_subgroup_id';
	static tableName = 'm_account_subgroup';

	static get relationMappings() {
		const AccountGroup = require('../account-group/account-group-model');

		return {
			account_group: {
				relation: Model.BelongsToOneRelation,
				modelClass: AccountGroup,
				join: {
					from: 'm_account_group.account_group_id',
					to: 'm_account_subgroup.account_group_id',
				},
			},
		};
	}
}

module.exports = MyModel;
