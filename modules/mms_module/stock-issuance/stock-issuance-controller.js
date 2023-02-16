const BaseController = require('../../base/base-controller');
const { transaction, DataError } = require('objection');
const mdl = require('./stock-issuance-model');

class MyController extends BaseController {
	constructor() {
		super(mdl);
	}

	async GetTransactionNumber(company_id) {
		try {
			let item = await mdl.query().count('transaction_id as record_count').where('company_id', company_id).first();
			const result = global.GenerateTransNo('TN', item.record_count);
			return result;
		} catch (err) {
			console.log(err);
			return '';
		}
	}
}

module.exports = new MyController();
