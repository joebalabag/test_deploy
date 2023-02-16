const BaseModel = require('../../base/base-model');
const { Model, QueryBuilder } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'journal_document_id';
	static tableName = 'ams_journal_document';

	static get relationMappings() {
		const Journal = require('../journal/journal-model');

		return {
			journal: {
				relation: Model.BelongsToOneRelation,
				modelClass: Journal,
				join: {
					from: 'ams_journal.journal_id',
					to: 'ams_journal_document.journal_id',
				},
			},
		};
	}
}

module.exports = MyModel;
