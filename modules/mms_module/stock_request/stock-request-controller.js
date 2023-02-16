const BaseController = require('../../base/base-controller');
const { transaction, DataError } = require('objection');
const mdl = require('./stock-request-model');
const m_line = require('./stock-request-line-model');
const m_status = require('./stock-request-status-model');
class MyController extends BaseController {
	constructor() {
		super(mdl);
	}

	async GetStockRequestNumber() {
		try {
			let item = await mdl.query().count('* as record_count').first();
			const result = global.GenerateTransNo('SR', item.record_count);
			return result;
		} catch (err) {
			console.log(err);
			return '';
		}
	}

	async dashboard(req, res) {
		try {
			let data = mdl
				.query()
				.select()
				.withGraphFetched('stock_order_dept')
				.modifyGraph('stock_order_dept', (builder) => {
					builder.select('dept_id', 'description');
				})
				.where('company_id', req.query.company_id)
				.where('stock_request_dept_id', req.query.stock_request_dept_id)
				.where(global.dateParams('created_datetime'), '>=', req.query.date_from)
				.where(global.dateParams('created_datetime'), '<=', req.query.date_to);

			if (req.query.status != 'ALL') {
				data = data.whereRaw('stock_request_status IN (' + req.query.status + ')');
			}
			if (Boolean(req.query.keywords) == true) {
				data = data.whereRaw("stock_request_no LIKE '%" + req.query.keywords + "%'");
			}
			data = await data;
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async create(req, res) {
		try {
			let encoded_by = req.body.created_by;
			let mytrans = await transaction(mdl, m_line, m_status, async (mdl, m_line, m_status) => {
				//prepare main table

				req.body.stock_request_no = await this.GetStockRequestNumber();
				req.body.stock_request_status = 'PENDING';
				req.body.stock_request_status_datetime = global.getCurrentDateTime();
				req.body.stock_request_status_remarks = 'UPON CREATION';

				//prepare line data
				req.body.stock_request_line.forEach((element) => {
					element.created_by = encoded_by;
					element.stock_request_line_status = 'PENDING';
					element.stock_request_line_status_datetime = global.getCurrentDateTime();
					element.stock_request_line_status_remarks = 'UPON CREATION';
					element.is_active = 1;
				});
				//prepare data..
				req.body.stock_request_status_logs = {
					created_by: encoded_by,
					description: 'PENDING',
					is_active: 1,
					remarks: 'UPON CREATION',
					status_level: 1,
				};

				let output = await mdl.query().insertGraphAndFetch(req.body);
				return output;
			});

			return global.apiResponse(res, mytrans, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async view(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				.withGraphFetched('stock_request_line')
				.withGraphFetched('stock_request_status_logs')
				.withGraphFetched('stock_request_dept')
				.withGraphFetched('stock_order_dept')
				.where('stock_request_id', req.query.stock_request_id);
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async post(req, res) {
		try {
			let encoded_by = req.body.stock_request_status_by;
			let new_status = 'POSTED';
			let new_status_remarks = 'UPON POSTED';
			let new_status_level = 2;
			let mytrans = await transaction(mdl, m_line, m_status, async (mdl, m_line, m_status) => {
				//prepare main table

				req.body.stock_request_status = new_status;
				req.body.stock_request_status_datetime = global.getCurrentDateTime();
				req.body.stock_request_status_remarks = new_status_remarks;
				req.body.posted_datetime = global.getCurrentDateTime();
				req.body.posted_by = encoded_by;
				//prepare data..
				let b_status = {
					stock_request_id: req.query.stock_request_id,
					created_by: encoded_by,
					description: new_status,
					is_active: 1,
					remarks: new_status_remarks,
					status_level: new_status_level,
				};
				let t_stock_request = await mdl.query().updateAndFetchById(req.query.stock_request_id, req.body);
				let t_stock_request_status = await m_status.query().insertAndFetch(b_status);

				let t_stock_request_line = await m_line
					.query()
					.update({
						stock_request_line_status: new_status,
						stock_request_line_status_datetime: global.getCurrentDateTime(),
						stock_request_line_status_remarks: new_status_remarks,
					})
					.where('stock_request_id', req.query.stock_request_id)
					.where('stock_request_line_status', '!=', 'VOIDED')
					.returning('*');

				let output = { t_stock_request, t_stock_request_line, t_stock_request_status };
				return output;
			});

			return global.apiResponse(res, mytrans, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async void(req, res) {
		try {
			let encoded_by = req.body.stock_request_status_by;
			let new_status = 'VOIDED';
			let new_status_remarks = req.body.stock_request_status_remarks;
			let new_status_level = 0;
			let mytrans = await transaction(mdl, m_line, m_status, async (mdl, m_line, m_status) => {
				//prepare main table

				req.body.stock_request_status = new_status;
				req.body.stock_request_status_datetime = global.getCurrentDateTime();
				req.body.stock_request_status_remarks = new_status_remarks;
				req.body.posted_datetime = global.getCurrentDateTime();

				//prepare data..
				let b_status = {
					stock_request_id: req.query.stock_request_id,
					created_by: encoded_by,
					description: new_status,
					is_active: 1,
					remarks: new_status_remarks,
					status_level: new_status_level,
				};
				let t_stock_request = await mdl.query().updateAndFetchById(req.query.stock_request_id, req.body);
				let t_stock_request_status = await m_status.query().insertAndFetch(b_status);

				let t_stock_request_line = await m_line
					.query()
					.update({
						stock_request_line_status: new_status,
						stock_request_line_status_datetime: global.getCurrentDateTime(),
						stock_request_line_status_remarks: new_status_remarks,
					})
					.where('stock_request_id', req.query.stock_request_id)
					.where('stock_request_line_status', '!=', 'VOIDED')
					.returning('*');

				let output = { t_stock_request, t_stock_request_line, t_stock_request_status };
				return output;
			});

			return global.apiResponse(res, mytrans, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async update(req, res) {
		try {
			let encoded_by = req.body.updated_by;
			let mytrans = await transaction(mdl, m_line, m_status, async (mdl, m_line, m_status) => {
				//prepare main table

				// req.body.stock_request_status = new_status;
				// req.body.stock_request_status_datetime = global.getCurrentDateTime();
				// req.body.stock_request_status_remarks = new_status_remarks;
				// req.body.posted_datetime = global.getCurrentDateTime();
				let mybody = { ...req.body };
				let b_stock_request = {
					description: mybody.description,
					remarks: mybody.remarks,
					updated_by: encoded_by,
					updated_datetime: global.getCurrentDateTime(),
				};

				let t_stock_request = await mdl.query().updateAndFetchById(req.query.stock_request_id, b_stock_request);
				let b_stock_request_line_update = [],
					b_stock_request_line_insert = [];

				req.body.stock_request_line.forEach((element) => {
					if (element.stock_request_line_id > 0) {
						b_stock_request_line_update.push(
							m_line.query().updateAndFetchById(element.stock_request_line_id, {
								item_id: element.item_id,
								item_remarks: element.item_remarks,
								item_unit: element.item_unit,
								requested_qty: element.requested_qty,
								updated_by: encoded_by,
								updated_datetime: global.getCurrentDateTime(),
							})
						);
					} else {
						b_stock_request_line_insert.push({
							stock_request_id: req.query.stock_request_id,
							item_id: element.item_id,
							item_remarks: element.item_remarks,
							item_unit: element.item_unit,
							requested_qty: element.requested_qty,
							created_by: encoded_by,
							created_datetime: global.getCurrentDateTime(),
							is_active: 1,
							stock_request_line_status: 'PENDING',
							stock_request_line_status_datetime: global.getCurrentDateTime(),
							stock_request_line_status_remarks: 'UPON EDIT',
						});
					}
				});
				let t_stock_request_line_update = await Promise.all(b_stock_request_line_update);
				let t_stock_request_line_insert = await m_line.query().insertGraphAndFetch(b_stock_request_line_insert);
				let output = { t_stock_request, t_stock_request_line_update, t_stock_request_line_insert };
				return output;
			});

			return global.apiResponse(res, mytrans, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new MyController();
