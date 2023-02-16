const BaseController = require('../../base/base-controller');
const mdl = require('./item-category-model');

class Controller extends BaseController {
	constructor() {
		super(mdl);
	}
	//with specific with related tables
	async view_specific(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				// .withGraphFetched('item_group')
				// .modifyGraph('item_group', (builder) => {
				// 	builder.select('item_group_id', 'description');
				// })
				.where({ item_category_id: req.query.item_category_id });

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async SearchByItemGroup(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				// .withGraphFetched('item_group')
				// .modifyGraph('item_group', (builder) => {
				// 	builder.select('item_group_id', 'description');
				// })
				.where({ item_group_id: req.query.item_group_id });
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new Controller();
