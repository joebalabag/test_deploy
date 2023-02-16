const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'stock_issuance_status_id';
	static tableName = 'mms_stock_issuance_status_logs';

	// // // //non mappings for now....
	// static get relationMappings() {
	// 	const department = require('../../maintenance_module/department/department-model');

	// 	return {
	// 		stock_request_dept: {
	// 			relation: Model.BelongsToOneRelation,
	// 			modelClass: department,
	// 			join: {
	// 				from: 'mms_stock_request.stock_request_dept_id',
	// 				to: 'm_department.dept_id',
	// 			},
	// 		},
	// 		stock_order_dept: {
	// 			relation: Model.BelongsToOneRelation,
	// 			modelClass: department,
	// 			join: {
	// 				from: 'mms_stock_request.stock_order_dept_id',
	// 				to: 'm_department.dept_id',
	// 			},
	// 		},
	// 	};
	// }
}

module.exports = MyModel;
