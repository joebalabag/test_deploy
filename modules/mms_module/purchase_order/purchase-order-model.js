const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'purchase_order_id';
	static tableName = 'mms_purchase_order';

	// // //non mappings for now....
	static get relationMappings() {
		const Department = require('../../maintenance_module/department/department-model');
		const PurchaseOrderLine = require('./purchase-order-line-model');
		const PurchaseOrderStatus = require('./purchase-order-status-model');
		const PurchaseRequest = require('../purchase_request/purchase-request-model');
		return {
			purchase_request_dept: {
				relation: Model.BelongsToOneRelation,
				modelClass: Department,
				join: {
					from: 'mms_purchase_order.purchase_request_dept_id',
					to: 'm_department.dept_id',
				},
			},
			purchase_order_dept: {
				relation: Model.BelongsToOneRelation,
				modelClass: Department,
				join: {
					from: 'mms_purchase_order.purchase_order_dept_id',
					to: 'm_department.dept_id',
				},
			},
			purchase_order_line: {
				relation: Model.HasManyRelation,
				modelClass: PurchaseOrderLine,
				join: {
					from: 'mms_purchase_order.purchase_order_id',
					to: 'mms_purchase_order_line.purchase_order_id',
				},
			},
			purchase_order_status_logs: {
				relation: Model.HasManyRelation,
				modelClass: PurchaseOrderStatus,
				join: {
					from: 'mms_purchase_order.purchase_order_id',
					to: 'mms_purchase_order_status_logs.purchase_order_id',
				},
			},
			purchase_request: {
				relation: Model.HasManyRelation,
				modelClass: PurchaseRequest,
				join: {
					from: 'mms_purchase_order.purchase_request_id',
					to: 'mms_purchase_request.purchase_request_id',
				},
			},
		};
	}
}

module.exports = MyModel;
