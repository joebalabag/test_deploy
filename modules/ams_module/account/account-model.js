const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'account_id';
	static tableName = 'm_account';
	static get relationMappings() {
		const AccountSubGroup = require('../account/account-subgroup/account-subgroup-model');
		const BankAccount = require('../back-account/bank-account-model');

		return {
			account_subgroup: {
				relation: Model.BelongsToOneRelation,
				modelClass: AccountSubGroup,
				join: {
					from: 'm_account.account_subgroup_id',
					to: 'm_account_subgroup.account_subgroup_id',
				},
			},
			bank_account: {
				relation: Model.HasManyRelation,
				modelClass: BankAccount,
				join: {
					from: 'm_account.account_id',
					to: 'm_bank_account.account_id',
				},
			},
		};
	}
}

module.exports = MyModel;
