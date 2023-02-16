const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'purchase_request_id';
	static tableName = 'mms_purchase_request';

	// // //non mappings for now....
	static get relationMappings() {
		const Department = require('../../maintenance_module/department/department-model');
		const PurchaseRequestLine = require('./purchase-request-line-model');
		const PurchaseRequestStatus = require('./purchase-request-status-model');

		return {
			purchase_request_dept: {
				relation: Model.BelongsToOneRelation,
				modelClass: Department,
				join: {
					from: 'mms_purchase_request.purchase_request_dept_id',
					to: 'm_department.dept_id',
				},
			},
			purchase_order_dept: {
				relation: Model.BelongsToOneRelation,
				modelClass: Department,
				join: {
					from: 'mms_purchase_request.purchase_order_dept_id',
					to: 'm_department.dept_id',
				},
			},
			purchase_request_line: {
				relation: Model.HasManyRelation,
				modelClass: PurchaseRequestLine,
				join: {
					from: 'mms_purchase_request.purchase_request_id',
					to: 'mms_purchase_request_line.purchase_request_id',
				},
			},
			purchase_request_status_logs: {
				relation: Model.HasManyRelation,
				modelClass: PurchaseRequestStatus,
				join: {
					from: 'mms_purchase_request.purchase_request_id',
					to: 'mms_purchase_request_status_logs.purchase_request_id',
				},
			},
		};
	}
}

module.exports = MyModel;
