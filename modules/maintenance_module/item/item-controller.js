const { raw } = require('objection');
const BaseController = require('../../base/base-controller');
const mdl = require('./item-model');

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
				.withGraphFetched('[company, item_category.[item_group], item_generic]')
				.modifyGraph('company', (builder) => {
					builder.select('company_id', 'name', 'description');
				})
				.modifyGraph('item_category', (builder) => {
					builder.select('item_category_id', 'item_group_id', 'description');
				})
				.modifyGraph('item_category.[item_group]', (builder) => {
					builder.select('item_group_id', 'description');
				})
				.modifyGraph('item_generic', (builder) => {
					builder.select('item_generic_id', 'description');
				})
				.where({ item_id: req.query.item_id });

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async search(req, res) {
		try {
			let data = mdl
				.query()
				.select()
				.withGraphFetched('[ item_category.[item_group], item_generic]')
				// .modifyGraph('company', (builder) => {
				// 	builder.select('company_id', 'name', 'description');
				// })
				.modifyGraph('item_category', (builder) => {
					builder.select('item_category_id', 'item_group_id', 'description');
				})
				.modifyGraph('item_category.[item_group]', (builder) => {
					builder.select('item_group_id', 'description');
				})
				.modifyGraph('item_generic', (builder) => {
					builder.select('item_generic_id', 'description');
				});

			if (Boolean(req.query.keywords) == true) {
				data = data.where(raw("description LIKE '%" + req.query.keywords + "%'")); // or item_code LIKE '" + req.query.keywords + "%'");
			}
			data = await data;

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new Controller();
