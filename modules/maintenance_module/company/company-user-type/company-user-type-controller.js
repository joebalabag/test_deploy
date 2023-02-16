const BaseController = require('../../../base/base-controller');
const mdl = require('./company-user-type-model');

class Controller extends BaseController {
	constructor() {
		super(mdl);
	}

	async view_specific(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				.withGraphFetched('company')
				.modifyGraph('company', (builder) => {
					builder.select('company_id', 'name', 'description');
				})
				.where({ company_usertype_id: req.query.company_usertype_id });

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new Controller();
