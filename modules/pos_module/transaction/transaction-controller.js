const BaseController = require('../../base/base-controller');
const mdl = require('./transaction-model');
const { transaction, DataError, compose } = require('objection');
const m_line = require('./transaction-line-model');
const { raw } = require('objection');
class Controller extends BaseController {
	constructor() {
		super(mdl);
	}

	async GetTransactionNumber(company_id) {
		try {
			let item = await mdl.query().count('transaction_id as record_count').where('company_id', company_id).first();
			const result = global.GenerateTransNo('TN', item.record_count);
			return result;
		} catch (err) {
			console.log(err);
			return '';
		}
	}
	async view_specific(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				.withGraphFetched('transaction_line.item')
				.modifyGraph('transaction_line.item', (builder) => {
					builder.select('item_id', 'item_code', 'item_barcode', 'description', 'selling_based_price', 'selling_markup_pct');
				})
				.withGraphFetched('discount_scheme')
				.modifyGraph('discount_scheme', (builder) => {
					builder.select('discount_scheme_id', 'code', 'description', 'percentage');
				})
				.withGraphFetched('company')
				.modifyGraph('company', (builder) => {
					builder.select('company_id', 'name', 'description');
				})
				.where({ transaction_id: req.query.transaction_id });

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async onlyActive(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				.withGraphFetched('company')
				.modifyGraph('company', (builder) => {
					builder.select('company_id', 'name', 'description');
				})
				.where({ is_active: 1 })
				.where({ company_id: req.query.company_id });
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async all(req, res) {
		try {
			let data = mdl
				.query()
				.select()
				.withGraphFetched('company')
				.modifyGraph('company', (builder) => {
					builder.select('company_id', 'name', 'description');
				})
				.where(global.dateParams('created_datetime'), '>=', req.query.date_from)
				.where(global.dateParams('created_datetime'), '<=', req.query.date_to)

				//.where({ is_active: 1 })
				.where({ company_id: req.query.company_id });

			if (Boolean(req.query.keywords) == true) {
				data = data.whereRaw("transaction_no LIKE '%" + req.query.keywords + "%'");
			}
			data = await data;
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async check_trans(req, res) {
		try {
			let data = await this.GetTransactionNumber(1);

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
	async touchscreen_paynow(req, res) {
		try {
			let encoded_by = req.body.created_by;
			let date_now = global.getCurrentDateTime();
			req.body.transaction_no = await this.GetTransactionNumber(req.body.company_id);
			req.body.transaction_status = 'DONE';
			req.body.end_transaction_datetime = date_now;
			req.body.end_transaction_by = encoded_by;

			let data = await mdl.query().insertGraphAndFetch(req.body);

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
	async grocery_paynow(req, res) {
		try {
			let encoded_by = req.body.created_by;
			let date_now = global.getCurrentDateTime();
			req.body.transaction_no = await this.GetTransactionNumber(req.body.company_id);
			req.body.transaction_status = 'DONE';
			req.body.end_transaction_datetime = date_now;
			req.body.end_transaction_by = encoded_by;

			let data = await mdl.query().insertGraphAndFetch(req.body);

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
	async order_paylater(req, res) {
		try {
			let encoded_by = req.body.created_by;
			let date_now = global.getCurrentDateTime();
			req.body.transaction_no = await this.GetTransactionNumber(req.body.company_id);
			req.body.transaction_status = 'INPROGRESS';
			req.body.end_transaction_datetime = date_now;
			req.body.end_transaction_by = encoded_by;

			let data = await mdl.query().insertGraphAndFetch(req.body);

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async void_transaction(req, res) {
		try {
			let encoded_by = req.body.voided_by;
			console.log('sulod');
			console.log(mdl);
			// let t_trans = await mdl
			// 	.query()
			// 	.update({
			// 		is_active: 0,
			// 		void_remarks: req.body.void_remarks,
			// 		transaction_status: 'VOIDED',
			// 		voided_by: encoded_by,
			// 		voided_datetime: global.getCurrentDateTime(),
			// 	})
			// 	.where('transaction_id', req.body.transaction_id);
			// let t_trans_line = await m_line
			// 	.query()
			// 	.update({
			// 		is_active: 0,
			// 		voided_by: encoded_by,
			// 		voided_datetime: global.getCurrentDateTime(),
			// 		void_remarks: req.body.void_remarks,
			// 	})
			// 	.where('transaction_id', req.body.transaction_id);
			// let mytrans = { t_trans, t_trans_line };
			//let mytrans = await transaction(mdl, m_line, async (mdl, m_line) => {
			let mytrans = await transaction(mdl, m_line, async (mdl, m_line) => {
				console.log('test');
				//let t_trans = '';
				let main;
				let t_trans = await mdl
					.query()
					.update({
						is_active: 0,
						void_remarks: req.body.void_remarks,
						transaction_status: 'VOIDED',
						voided_by: encoded_by,
						voided_datetime: global.getCurrentDateTime(),
					})
					.where('transaction_id', req.body.transaction_id);
				let t_trans_line = await m_line
					.query()
					.update({
						is_active: 0,
						voided_by: encoded_by,
						voided_datetime: global.getCurrentDateTime(),
						void_remarks: req.body.void_remarks,
					})
					.where('transaction_id', req.body.transaction_id);

				return (main = { t_trans, t_trans_line });
			});

			return global.apiResponse(res, mytrans, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
	async void_transaction_line(req, res) {
		try {
			let encoded_by = req.body.voided_by;

			let data = await m_line
				.query()
				.update({
					is_active: 0,
					voided_by: encoded_by,
					voided_datetime: global.getCurrentDateTime(),
					void_remarks: req.body.void_remarks,
				})
				.where('transaction_line_id', req.body.transaction_line_id);

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async order_paylater_dashboard(req, res) {
		try {
			let data = await mdl.query().select().where('company_id', req.query.company_id).where('transaction_status', 'INPROGRESS');

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async order_paylater_add_on(req, res) {
		try {
			console.log('start');
			let encoded_by = req.body.created_by;
			let mytrans = await transaction(mdl, m_line, async (mdl, m_line) => {
				let main;

				//console.log('start main');
				let t_trans = await mdl
					.query()
					.update({
						amount_gross: req.body.amount_gross,
						amount_vat: req.body.amount_vat,
						amount_discount: req.body.amount_discount,
						amount_net: req.body.amount_net,
						updated_by: encoded_by,
						updated_datetime: global.getCurrentDateTime(),
					})
					.where('transaction_id', req.body.transaction_id);

				//console.log('success main');

				//add new item
				//console.log('start add');
				let t_trans_line_add = await m_line.query().insertGraph(req.body.add_transaction_line);
				//console.log('end add');

				let translineid_remove;
				let t_trans_line_remove;

				//remove items
				if (req.body.remove_transaction_line.length > 0) {
					//console.log('start remove');
					translineid_remove = req.body.remove_transaction_line.map((item) => item.transaction_line_id).join(',');
					t_trans_line_remove = await m_line
						.query()
						.delete()
						.where(raw('transaction_line_id IN (' + translineid_remove + ')'))
						.where('transaction_id', req.body.transaction_id);
					//console.log('end remove');
				}
				let b_trans_line_update = [];
				let t_trans_line_update;
				//update existing item if may changes
				if (req.body.update_transaction_line.length > 0) {
					req.body.update_transaction_line.forEach((element) => {
						b_trans_line_update.push(
							m_line
								.query()
								.update({
									item_id: element.item_id,
									qty: element.qty,
									unit: element.unit,
									amount_selling: element.amount_selling,
									amount_vatable: element.amount_vatable,
									amount_discount: element.amount_discount,
									amount_net: element.amount_net,
									menu_category: element.menu_category,
									stock_category: element.stock_category,
									stock_issuance_line_id: element.stock_issuance_line_id,
									cost: element.cost,
									updated_datetime: global.getCurrentDateTime(),
									updated_by: encoded_by,
								})
								.where('transaction_line_id', element.transaction_line_id)
								.where('transaction_id', req.body.transaction_id)
						);
					});

					//console.log('start update');
					t_trans_line_update = await Promise.all(b_trans_line_update);
					//console.log('end update');
				}

				return (main = { t_trans, t_trans_line_add, t_trans_line_remove, t_trans_line_update });
				//return t_trans;
			});

			return global.apiResponse(res, mytrans, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async order_paylater_payment(req, res) {
		try {
			let encoded_by = req.body.created_by;
			let data = await mdl.query().updateAndFetchById(req.body.transaction_id, {
				transaction_status: 'DONE',
				cash_onhand: req.body.cash_onhand,
				updated_by: encoded_by,
				updated_datetime: global.getCurrentDateTime(),
			});

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async reports_daily(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				.withGraphFetched('company')
				.modifyGraph('company', (builder) => {
					builder.select('company_id', 'name', 'description');
				})
				.where({ is_active: 1 })
				.where({ company_id: req.query.company_id })
				.where(global.dateParams('created_datetime'), '=', req.query.date_from);
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new Controller();
