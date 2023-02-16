const BaseController = require('../../base/base-controller');
const mdl = require('./discount-scheme-model');

class Controller extends BaseController {
	constructor() {
		super(mdl);
	}

	async onlyActive(req, res) {
		try {
			let data = await mdl.query().select().where({ is_active: 1 }).where({ company_id: req.query.company_id });
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async all(req, res) {
		try {
			let data = await mdl.query().select().where({ company_id: req.query.company_id });
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	//with specific with related tables
	async view_specific(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				.withGraphFetched('company')
				// .modifyGraph('company', (builder) => {
				// 	builder.select('company_id', 'name', 'description');
				// })
				.where({ discount_scheme_id: req.query.discount_scheme_id });

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new Controller();
