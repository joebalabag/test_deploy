const BaseController = require('../../base/base-controller');
const mdl = require('./subscription-type-model');

class Controller extends BaseController {
	constructor() {
		super(mdl);
	}
	// async PatientRegistryRecord(req, res) {
	// 	try {
	// 		let items = mdl
	// 			.query()
	// 			.withGraphFetched('patientreg_forms')
	// 			.modifyGraph('patientreg_forms', (builder) => {
	// 				builder.where({ PatientRegID: req.params.PatientRegID });
	// 			});
	// 		// .whereExists(
	// 		// 	mdlm.relatedQuery('patientreg_consent').where({ PatientRegID: req.params.PatientRegID })
	// 		// );

	// 		items = await items;
	// 		return global.apiResponse(res, items, 'OK');
	// 	} catch (err) {
	// 		console.log(err);
	// 		return global.apiResponse(res, {}, 'SE', err);
	// 	}
	// }
}

module.exports = new Controller();
