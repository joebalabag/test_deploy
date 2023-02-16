const { enc } = require('crypto-js');
const BaseController = require('../../base/base-controller');
const mdl = require('./beg-balance-stock-model');
const baseController = new BaseController();

class Controller extends BaseController {
	constructor() {
		super(mdl);
	}

	async create(req, res) {
		try {
			let EncodedBy = req.body.created_by;

			const is_active = true;
			const trans_status = 'PENDING';

			req.body.created_datetime = global.getCurrentDateTime();
			req.body.beg_balance_status = trans_status;
			req.body.beg_balance_status_datetime = global.getCurrentDateTime();
			req.body.is_active = is_active;
			req.body.created_by = EncodedBy;

			req.body.beg_balance_stock_line.map((item) => {
				item.is_active = is_active;
				item.created_by = EncodedBy;
				item.created_datetime = global.getCurrentDateTime();
			});

			req.body.beg_balance_stock_line.map((item) => {
				item.is_active = is_active;
				item.created_by = EncodedBy;
				item.created_datetime = global.getCurrentDateTime();
			});

			req.body.beg_balance_stock_status_log.description = trans_status;
			req.body.beg_balance_stock_status_log.is_active = is_active;
			req.body.beg_balance_stock_status_log.created_by = 'ahihi';
			req.body.beg_balance_stock_status_log.created_datetime = global.getCurrentDateTime;

			console.log(req.body);
			let t_transaction = null;
			try {
				let t_data = await mdl.transaction(async (trx) => {
					t_transaction = await mdl.query(trx).insertGraph(req.body);
				});
				//return t_data;
			} catch (e) {
				throw e;
			}

			let final_data = t_transaction;
			baseController.myUserLogging(req, final_data, res);
			//items = await items;
			return global.apiResponse(res, final_data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new Controller();
