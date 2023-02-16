const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class Transaction extends BaseModel {
	static idColumn = 'transaction_id';
	static tableName = 'pos_transaction';

	static get relationMappings() {
		const POSTransactionLine = require('./transaction-line-model');
		const Company = require('../../maintenance_module/company/company-model');
		const Discount = require('../../maintenance_module/discount-scheme/discount-scheme-model');
		return {
			transaction_line: {
				relation: Model.HasManyRelation,
				modelClass: POSTransactionLine,
				join: {
					from: 'pos_transaction.transaction_id',
					to: 'pos_transaction_line.transaction_id',
				},
			},
			company: {
				relation: Model.HasOneRelation,
				modelClass: Company,
				join: {
					from: 'pos_transaction.company_id',
					to: 'm_company.company_id',
				},
			},
			discount_scheme: {
				relation: Model.HasOneRelation,
				modelClass: Discount,
				join: {
					from: 'pos_transaction.discount_scheme_id',
					to: 'm_discount_scheme.discount_scheme_id',
				},
			},
		};
	}
}

module.exports = Transaction;
