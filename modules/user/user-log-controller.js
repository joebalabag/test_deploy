const JSDateTime = require('../../helper/JSDateTime');
const BaseController = require('../base/base-controller');
const baseController = new BaseController();
const mdl = require('./user-log-model');
const { raw } = require('objection');
const crypto = require('crypto');
//const e = require('express');
const localip = require('ip');

//const upload = require('../../helper/JSDateTime');
//const mdlx = require('./parts-line-model');

class UserlogController extends BaseController {
	constructor() {
		super(mdl);
	}
	async Dashboard(req, res) {
		try {
			req.params.keywords = req.params.keywords == undefined ? '' : req.params.keywords;
			let data = mdl
				.query()
				.where('CreatedDateTime', '>=', req.params.dateFrom)
				.where('CreatedDateTime', '<=', req.params.dateTo);
			// if (req.params.keywords != undefined) {
			// 	data = data.where((builder) =>
			// 		builder
			// 			.where('PQCOrderNo', 'like', '%' + req.params.keywords + '%')
			// 			.orWhere('FrameNo', 'like', '%' + req.params.keywords + '%')
			// 			.orWhere('ModelName', 'like', '%' + req.params.keywords + '%')
			// 			.orWhere('ModelCode', 'like', '%' + req.params.keywords + '%')
			// 	);
			// }
			data = await data;
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new UserlogController();
