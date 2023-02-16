const BaseModel = require('../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'subscription_type_id';
	static tableName = 'm_subscription_type';

	// // // //non mappings for now....
	// static get relationMappings() {
	// 	const Employee = require('../../hris_module/employee/employee-model');

	// 	return {
	// 		employee: {
	// 			relation: Model.BelongsToOneRelation,
	// 			modelClass: Employee,
	// 			join: {
	// 				from: 'PatientDoctor.DoctorID',
	// 				to: 'Employee.EmployeeID',
	// 			},
	// 		},
	// 	};
	// }
}

module.exports = MyModel;
