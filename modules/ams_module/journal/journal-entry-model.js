const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'journal_entries_id';
	static tableName = 'ams_journal_entries';

	static get relationMappings() {
		const Journal = require('../journal/journal-model');
		const Account = require('../account/account-model');
		const Department = require('../../maintenance_module/department/department-model');

		return {
			journal: {
				relation: Model.BelongsToOneRelation,
				modelClass: Journal,
				join: {
					from: 'ams_journal.journal_id',
					to: 'ams_journal_entries.journal_id',
				},
			},
			account: {
				relation: Model.HasOneRelation,
				modelClass: Account,
				join: {
					from: 'ams_journal_entries.account_id',
					to: 'm_account.account_id',
				},
			},
			cost_department: {
				relation: Model.HasOneRelation,
				modelClass: Department,
				join: {
					from: 'ams_journal_entries.cost_dept_id',
					to: 'm_department.dept_id',
				},
			},
			req_department: {
				relation: Model.HasOneRelation,
				modelClass: Department,
				join: {
					from: 'ams_journal_entries.req_dept_id',
					to: 'm_department.dept_id',
				},
			},
		};
	}
}

module.exports = MyModel;
