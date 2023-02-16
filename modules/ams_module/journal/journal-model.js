const BaseModel = require('../../base/base-model');
const { Model, QueryBuilder } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'journal_id';
	static tableName = 'ams_journal';

	static get relationMappings() {
		const JournalEntry = require('../journal/journal-entry-model');
		const JournalDocument = require('../journal/journal_document-model');

		return {
			journal_entries: {
				relation: Model.HasManyRelation,
				modelClass: JournalEntry,
				join: {
					from: 'ams_journal.journal_id',
					to: 'ams_journal_entries.journal_id',
				},
			},
			journal_document: {
				relation: Model.HasManyRelation,
				modelClass: JournalDocument,
				join: {
					from: 'ams_journal.journal_id',
					to: 'ams_journal_document.journal_id',
				},
			},
		};
	}
}

module.exports = MyModel;
