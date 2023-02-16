const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'stock_request_id';
	static tableName = 'mms_stock_request';

	// // //non mappings for now....
	static get relationMappings() {
		const Department = require('../../maintenance_module/department/department-model');
		const StockRequestLine = require('./stock-request-line-model');
		const StockRequestStatus = require('./stock-request-status-model');

		return {
			stock_request_dept: {
				relation: Model.BelongsToOneRelation,
				modelClass: Department,
				join: {
					from: 'mms_stock_request.stock_request_dept_id',
					to: 'm_department.dept_id',
				},
			},
			stock_order_dept: {
				relation: Model.BelongsToOneRelation,
				modelClass: Department,
				join: {
					from: 'mms_stock_request.stock_order_dept_id',
					to: 'm_department.dept_id',
				},
			},
			stock_request_line: {
				relation: Model.HasManyRelation,
				modelClass: StockRequestLine,
				join: {
					from: 'mms_stock_request.stock_request_id',
					to: 'mms_stock_request_line.stock_request_id',
				},
			},
			stock_request_status_logs: {
				relation: Model.HasManyRelation,
				modelClass: StockRequestStatus,
				join: {
					from: 'mms_stock_request.stock_request_id',
					to: 'mms_stock_request_status_logs.stock_request_id',
				},
			},
		};
	}
}

module.exports = MyModel;
