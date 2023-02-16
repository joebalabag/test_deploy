const BaseController = require('../../base/base-controller');
const { transaction, DataError } = require('objection');
const mdl = require('./purchase-request-model');
const m_line = require('./purchase-request-line-model');
const m_status = require('./purchase-request-status-model');
class MyController extends BaseController {
	constructor() {
		super(mdl);
	}

	async GetTransactionNumber() {
		try {
			let item = await mdl.query().count('* as record_count').first();
			const result = global.GenerateTransNo('PR', item.record_count);
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
				.withGraphFetched('purchase_order_dept')
				.modifyGraph('purchase_order_dept', (builder) => {
					builder.select('dept_id', 'description');
				})
				.where('company_id', req.query.company_id)
				.where('purchase_request_dept_id', req.query.purchase_request_dept_id)
				.where(global.dateParams('created_datetime'), '>=', req.query.date_from)
				.where(global.dateParams('created_datetime'), '<=', req.query.date_to);

			if (req.query.status != 'ALL') {
				data = data.whereRaw('purchase_request_status IN (' + req.query.status + ')');
			}
			if (Boolean(req.query.keywords) == true) {
				data = data.whereRaw("purchase_request_no LIKE '%" + req.query.keywords + "%'");
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

				req.body.purchase_request_no = await this.GetTransactionNumber();
				req.body.purchase_request_status = 'PENDING';
				req.body.purchase_request_status_datetime = global.getCurrentDateTime();
				req.body.purchase_request_status_remarks = 'UPON CREATION';

				//prepare line data
				req.body.purchase_request_line.forEach((element) => {
					element.created_by = encoded_by;
					element.purchase_request_line_status = 'PENDING';
					element.purchase_request_line_status_datetime = global.getCurrentDateTime();
					element.purchase_request_line_status_remarks = 'UPON CREATION';
					element.is_active = 1;
				});
				//prepare data..
				req.body.purchase_request_status_logs = {
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
				.withGraphFetched('purchase_request_line')
				.withGraphFetched('purchase_request_status')
				.withGraphFetched('purchase_request_dept')
				.modifyGraph('purchase_request_dept', (builder) => {
					builder.select('dept_id', 'description');
				})
				.withGraphFetched('purchase_order_dept')
				.modifyGraph('purchase_order_dept', (builder) => {
					builder.select('dept_id', 'description');
				})
				.where('purchase_request_id', req.query.purchase_request_id);
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async post(req, res) {
		try {
			let encoded_by = req.body.purchase_request_status_by;
			let new_status = 'POSTED';
			let new_status_remarks = 'UPON POSTED';
			let new_status_level = 2;
			let mytrans = await transaction(mdl, m_line, m_status, async (mdl, m_line, m_status) => {
				//prepare main table

				req.body.purchase_request_status = new_status;
				req.body.purchase_request_status_datetime = global.getCurrentDateTime();
				req.body.purchase_request_status_remarks = new_status_remarks;
				req.body.posted_datetime = global.getCurrentDateTime();
				req.body.posted_by = encoded_by;

				//prepare data..
				let b_status = {
					purchase_request_id: req.query.purchase_request_id,
					created_by: encoded_by,
					description: new_status,
					is_active: 1,
					remarks: new_status_remarks,
					status_level: new_status_level,
				};
				let t_purchase_request = await mdl.query().updateAndFetchById(req.query.purchase_request_id, req.body);
				let t_purchase_request_status = await m_status.query().insertAndFetch(b_status);

				let t_purchase_request_line = await m_line
					.query()
					.update({
						purchase_request_line_status: new_status,
						purchase_request_line_status_datetime: global.getCurrentDateTime(),
						purchase_request_line_status_remarks: new_status_remarks,
					})
					.where('purchase_request_id', req.query.purchase_request_id)
					.where('purchase_request_line_status', '!=', 'VOIDED')
					.returning('*');

				let output = { t_purchase_request, t_purchase_request_line, t_purchase_request_status };
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
			let encoded_by = req.body.purchase_request_status_by;
			let new_status = 'VOIDED';
			let new_status_remarks = req.body.purchase_request_status_remarks;
			let new_status_level = 0;
			let mytrans = await transaction(mdl, m_line, m_status, async (mdl, m_line, m_status) => {
				//prepare main table

				req.body.purchase_request_status = new_status;
				req.body.purchase_request_status_datetime = global.getCurrentDateTime();
				req.body.purchase_request_status_remarks = new_status_remarks;
				req.body.posted_datetime = global.getCurrentDateTime();

				//prepare data..
				let b_status = {
					purchase_request_id: req.query.purchase_request_id,
					created_by: encoded_by,
					description: new_status,
					is_active: 1,
					remarks: new_status_remarks,
					status_level: new_status_level,
				};
				let t_purchase_request = await mdl.query().updateAndFetchById(req.query.purchase_request_id, req.body);
				let t_purchase_request_status = await m_status.query().insertAndFetch(b_status);

				let t_purchase_request_line = await m_line
					.query()
					.update({
						purchase_request_line_status: new_status,
						purchase_request_line_status_datetime: global.getCurrentDateTime(),
						purchase_request_line_status_remarks: new_status_remarks,
					})
					.where('purchase_request_id', req.query.purchase_request_id)
					.where('purchase_request_line_status', '!=', 'VOIDED')
					.returning('*');

				let output = { t_purchase_request, t_purchase_request_line, t_purchase_request_status };
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

				// req.body.purchase_request_status = new_status;
				// req.body.purchase_request_status_datetime = global.getCurrentDateTime();
				// req.body.purchase_request_status_remarks = new_status_remarks;
				// req.body.posted_datetime = global.getCurrentDateTime();
				let mybody = { ...req.body };
				let b_purchase_request = {
					description: mybody.description,
					remarks: mybody.remarks,
					updated_by: encoded_by,
					updated_datetime: global.getCurrentDateTime(),
				};

				let t_purchase_request = await mdl.query().updateAndFetchById(req.query.purchase_request_id, b_purchase_request);
				let b_purchase_request_line_update = [],
					b_purchase_request_line_insert = [];

				req.body.purchase_request_line.forEach((element) => {
					if (element.purchase_request_line_id > 0) {
						b_purchase_request_line_update.push(
							m_line.query().updateAndFetchById(element.purchase_request_line_id, {
								item_id: element.item_id,
								item_remarks: element.item_remarks,
								item_unit: element.item_unit,
								requested_qty: element.requested_qty,
								updated_by: encoded_by,
								updated_datetime: global.getCurrentDateTime(),
							})
						);
					} else {
						b_purchase_request_line_insert.push({
							purchase_request_id: req.query.purchase_request_id,
							item_id: element.item_id,
							item_remarks: element.item_remarks,
							item_unit: element.item_unit,
							requested_qty: element.requested_qty,
							created_by: encoded_by,
							created_datetime: global.getCurrentDateTime(),
							is_active: 1,
							purchase_request_line_status: 'PENDING',
							purchase_request_line_status_datetime: global.getCurrentDateTime(),
							purchase_request_line_status_remarks: 'UPON EDIT',
						});
					}
				});
				let t_purchase_request_line_update = await Promise.all(b_purchase_request_line_update);
				let t_purchase_request_line_insert = await m_line.query().insertGraphAndFetch(b_purchase_request_line_insert);
				let output = { t_purchase_request, t_purchase_request_line_update, t_purchase_request_line_insert };
				return output;
			});

			return global.apiResponse(res, mytrans, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async approve(req, res) {
		try {
			let encoded_by = req.body.purchase_request_status_by;
			let new_status = 'APPROVED';
			let new_status_remarks = 'UPON APPROVAL';
			let new_status_level = 3;
			let mytrans = await transaction(mdl, m_line, m_status, async (mdl, m_line, m_status) => {
				//prepare main table

				req.body.purchase_request_status = new_status;
				req.body.purchase_request_status_datetime = global.getCurrentDateTime();
				req.body.purchase_request_status_remarks = new_status_remarks;
				req.body.approved_datetime = global.getCurrentDateTime();
				req.body.approved_by = new_status;

				req.body.approved_datetime = global.getCurrentDateTime();

				//prepare data..
				let b_status = {
					purchase_request_id: req.query.purchase_request_id,
					created_by: encoded_by,
					description: new_status,
					is_active: 1,
					remarks: new_status_remarks,
					status_level: new_status_level,
				};
				let t_purchase_request = await mdl.query().updateAndFetchById(req.query.purchase_request_id, req.body);
				let t_purchase_request_status = await m_status.query().insertAndFetch(b_status);

				let t_purchase_request_line = await m_line
					.query()
					.update({
						purchase_request_line_status: new_status,
						purchase_request_line_status_datetime: global.getCurrentDateTime(),
						purchase_request_line_status_remarks: new_status_remarks,
					})
					.where('purchase_request_id', req.query.purchase_request_id)
					.where('purchase_request_line_status', '!=', 'VOIDED')
					.returning('*');

				let output = { t_purchase_request, t_purchase_request_line, t_purchase_request_status };
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
