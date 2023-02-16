const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'stock_issuance_id';
	static tableName = 'mms_stock_issuance';

	// // // //non mappings for now....
	// static get relationMappings() {
	// 	const Department = require('../../maintenance_module/department/department-model');
	// 	const DeliveryLine = require('./delivery-line-model');
	// 	const DeliveryStatus = require('./delivery-status-model');
	// 	const PurchaseOrder = require('../purchase_request/purchase-request-model');
	// 	return {
	// 		delivery_dept: {
	// 			relation: Model.BelongsToOneRelation,
	// 			modelClass: Department,
	// 			join: {
	// 				from: 'mms_delivery.delivery_dept_id',
	// 				to: 'm_department.dept_id',
	// 			},
	// 		},
	// 		// delivery_dept: {
	// 		// 	relation: Model.BelongsToOneRelation,
	// 		// 	modelClass: Department,
	// 		// 	join: {
	// 		// 		from: 'mms_delivery.delivery_dept_id',
	// 		// 		to: 'm_department.dept_id',
	// 		// 	},
	// 		// },
	// 		delivery_line: {
	// 			relation: Model.HasManyRelation,
	// 			modelClass: PurchaseOrderLine,
	// 			join: {
	// 				from: 'mms_delivery.delivery_id',
	// 				to: 'mms_delivery_line.delivery_id',
	// 			},
	// 		},
	// 		delivery_status_logs: {
	// 			relation: Model.HasManyRelation,
	// 			modelClass: PurchaseOrderStatus,
	// 			join: {
	// 				from: 'mms_delivery.delivery_id',
	// 				to: 'mms_delivery_status_logs.delivery_id',
	// 			},
	// 		},
	// 		purchase_request: {
	// 			relation: Model.HasManyRelation,
	// 			modelClass: PurchaseRequest,
	// 			join: {
	// 				from: 'mms_delivery.purchase_request_id',
	// 				to: 'mms_purchase_request.purchase_request_id',
	// 			},
	// 		},
	// 	};
	// }
}

module.exports = MyModel;
