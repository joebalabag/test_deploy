const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'beg_balance_stock_id';
	static tableName = 'mms_begbalance_stock';

	static get relationMappings() {
		const BegBalanceStockLine = require('./beg-balance-stock-line-model');
		const BegBalanceStockStatusLogs = require('./beg-balance-stock-status-logs-model');
		return {
			beg_balance_stock_line: {
				relation: Model.HasManyRelation,
				modelClass: BegBalanceStockLine,
				join: {
					from: 'mms_begbalance_stock.beg_balance_stock_id',
					to: 'mms_begbalance_stock_line.beg_balance_stock_id',
				},
			},
			beg_balance_stock_status_log: {
				relation: Model.HasManyRelation,
				modelClass: BegBalanceStockStatusLogs,
				join: {
					from: 'mms_begbalance_stock.beg_balance_stock_id',
					to: 'mms_begbalance_stock_status_logs.beg_balance_stock_id',
				},
			},
		};
	}
}

module.exports = MyModel;
