const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'bank_account_id';
	static tableName = 'm_bank_account';

	static get relationMappings() {
		const Account = require('../account/account-model');

		return {
			account_group: {
				relation: Model.BelongsToOneRelation,
				modelClass: Account,
				join: {
					from: 'm_bank_account.account_id',
					to: 'm_account.account_id',
				},
			},
		};
	}
}

module.exports = MyModel;
