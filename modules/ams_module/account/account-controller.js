const BaseController = require('../../base/base-controller');
const mdl = require('./account-model');

class Controller extends BaseController {
	constructor() {
		super(mdl);
	}
	async test(req, res) {
		try {
			let items = mdl.query().withGraphFetched('bank_account(onlyActive)').withGraphFetched('account_subgroup(onlyActive)');

			items = await items;
			return global.apiResponse(res, items, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new Controller();
