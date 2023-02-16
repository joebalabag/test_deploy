const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'beg_balance_stock_line_id';
	static tableName = 'mms_begbalance_stock_line';

	static get relationMappings() {
		const BegBalanceStock = require('./beg-balance-stock-model');
		return {
			beg_balance_stock: {
				relation: Model.BelongsToOneRelation,
				modelClass: BegBalanceStock,
				join: {
					from: 'mms_begbalance_stock_line.beg_balance_stock_id',
					to: 'mms_begbalance_stock.beg_balance_stock_id',
				},
			},
		};
	}
}

module.exports = MyModel;
