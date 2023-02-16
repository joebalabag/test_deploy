const BaseController = require('../../base/base-controller');
const { transaction, DataError } = require('objection');
const m_si = require('../stock-issuance/stock-issuance-model');
const m_sil = require('../stock-issuance/stock-issuance-line-model');
class MyController extends BaseController {
	constructor() {
		super(m_si);
	}

	async GetTransactionNumber(company_id) {
		try {
			let item = await m_si.query().count('transaction_id as record_count').where('company_id', company_id).first();
			const result = global.GenerateTransNo('TN', item.record_count);
			return result;
		} catch (err) {
			console.log(err);
			return '';
		}
	}
	async stock_list(req, res) {
		try {
			let data = m_sil
				.query()
				.select('sil.*', 'si.receiver_dept_id', 'si.stock_issuance_id', 'si.company_id', 'si.stock_issuance_no')
				.alias('sil')
				.leftJoin('mms_stock_issuance as si', 'si.stock_issuance_id', 'sil.stock_issuance_id')
				.where('si.stock_issuance_status', 'POSTED')
				.where('si.is_active', 1)
				.where('sil.item_id', req.query.item_id)
				.where('company_id', req.query.company_id)
				.orderBy('sil.item_expiry_date', 'asc');
			if (req.query.dept_id > 0) {
				data = data.where('si.receiver_dept_id', req.query.dept_id);
			}
			data = await data;

			let final_output = [];
			data.forEach((element) => {
				final_output.push({
					item_id: element.item_id,
					stock_issuance_no: element.stock_issuance_no,
					stock_issuance_id: element.stock_issuance_id,
					stock_issuance_line_id: element.stock_issuance_line_id,
					item_expiry_date: element.item_expiry_date,
					item_unit: element.item_unit,
					stock_qty: element.stock_qty,
					remain_qty: element.remain_qty,
					unit_cost: element.unit_cost,
					receiver_dept_id: element.receiver_dept_id,
				});
			});

			return global.apiResponse(res, final_output, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new MyController();
