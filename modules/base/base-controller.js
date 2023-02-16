const { pascalToTitleCase, slugifyWithDateTime, joinStrings } = require('../../helper/functions/string');

const UserLogs = require('../user/user-log-model');
const BaseModel = require('./base-model');
class BaseController {
	constructor(model) {
		this.model = model;
	}

	async index(req, res) {
		if (!this.model) return res.json('No model defined');
		try {
			let items = this.model.query();
			const page = req.query.page;
			const limit = req.query.limit;
			const search = req.query.search ? JSON.parse(req.query.search) : null;
			const withGraphFetch = req.query.withGraphFetch ? `[${req.query.withGraphFetch.join(',')}]` : null;

			if (search) {
				Object.keys(search).forEach((property) => {
					items = items.where(property, search[property]);
				});
			}
			if (withGraphFetch) {
				items = items.withGraphFetched(withGraphFetch);
			}

			if (page) {
				items = items.page(page - 1, limit ?? 10);
			}

			items = await items;
			return global.apiResponse(res, items, 'OK');
		} catch (err) {
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async onlyActive(req, res) {
		if (!this.model) return res.json('No model defined');
		try {
			let items = this.model.query().where({ is_active: 1 });
			const page = req.query.page;
			const limit = req.query.limit;
			const search = req.query.search ? JSON.parse(req.query.search) : null;
			const withGraphFetch = req.query.withGraphFetch ? `[${req.query.withGraphFetch.join(',')}]` : null;

			if (search) {
				Object.keys(search).forEach((property) => {
					items = items.where(property, search[property]);
				});
			}

			if (withGraphFetch) {
				items = items.withGraphFetched(withGraphFetch);
			}

			if (page) {
				items = items.page(page - 1, limit ?? 10);
			}
			items = await items;
			return global.apiResponse(res, items, 'OK');
		} catch (err) {
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async create(req, res) {
		let item = undefined;
		let user =
			req.user?.datacenter.CompleteName ?? joinStrings([req.user?.datacenter.Firstname, req.user?.datacenter.Lastname], ' ');
		let payload = {};
		try {
			const slugColumn = req.query?.slug;
			if (Array.isArray(req.body)) {
				payload = req.body.map((item) => ({
					created_datetime: convertToSqlDateTime(new Date(), new Date()),
					created_by: user,
					...item,
				}));
			} else {
				payload = {
					created_datetime: convertToSqlDateTime(new Date(), new Date()),
					created_by: user,
					...req.body,
				};
			}

			if (slugColumn) {
				if (typeof slugColumn == 'string') {
					payload.Slug = slugifyWithDateTime(req.body[slugColumn]);
				} else {
					payload[slugColumn.column] = slugifyWithDateTime(req.body[slugColumn.target]);
				}
			}

			Object.keys(payload).forEach((property) => {
				if (payload[property] === 'true') {
					payload[property] = 1;
				} else if (payload[property] === 'false') {
					payload[property] = 0;
				}
			});
			if (req.files) {
				Object.keys(req.files).forEach((fieldName) => {
					req.files[fieldName].forEach((file) => {
						payload[file.fieldname] =
							req.protocol + '://' + req.get('host') + file?.destination?.replace('./public', '') + file?.filename;
					});
				});
			} else if (req.file) {
				payload[req.file.fieldname] =
					req.protocol + '://' + req.get('host') + req.file?.destination?.replace('./public', '') + req.file?.filename;
			}
			//console.log(payload);
			item = await this.model.query().insertGraph(payload);

			if (process.env.NODE_ENV == 'development') {
				//console.log(res);
				//console.log(res.req.rawHeaders);
				console.log(res.req.method); //[0].method);
				//console.log(res.req.url);
				console.log(res.req.originalUrl);
				console.log(res.req.body);
			}
			//userlog
			//myUserLogging(req, item, res);
			// userLogging(
			// 	req.user?.POSUseraccessID,
			// 	'CREATE',
			// 	'FAILED',
			// 	JSON.stringify(payload),
			// 	joinStrings([item], ' '),
			// 	joinStrings([this.constructor.name.replace('Controller', ''), 'insert'], ' '),
			// 	user
			// );
			return global.apiResponse(res, item, 'OK', 'Successfully created');
		} catch (err) {
			//userlog
			console.log(err);
			//myUserLogging(req, err, res);
			return global.apiResponse(res, {}, 'SE', this.err);
		}
	}

	async show({ params }, res) {
		const { id } = params;
		try {
			const item = await this.model.query().findById(id);
			if (!item) {
				const modelName = pascalToTitleCase(this.constructor.name.replace('Controller', ''));
				return res.status(404).send({ message: `${modelName} not found` });
			}
			return global.apiResponse(res, item, 'OK');
		} catch (err) {
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async update(req, res) {
		const { id } = req.params;
		const slugColumn = req.query.slug;
		let user =
			req.user?.datacenter.CompleteName ?? joinStrings([req.user?.datacenter.Firstname, req.user?.datacenter.Lastname], ' ');
		let payload = {};
		let item = undefined;
		let err;
		if (Array.isArray(req.body)) {
			payload = req.body.map((item) => ({
				updated_datetime: convertToSqlDateTime(new Date(), new Date()),
				updated_by: user,
				...item,
			}));
		} else {
			payload = {
				updated_datetime: convertToSqlDateTime(new Date(), new Date()),
				updated_by: user,
				...req.body,
			};
		}

		if (slugColumn) {
			if (typeof slugColumn == 'string') {
				payload.Slug = slugifyWithDateTime(req.body[slugColumn]);
			} else {
				payload[slugColumn.column] = slugifyWithDateTime(req.body[slugColumn.target]);
			}
		}
		Object.keys(payload).forEach((property) => {
			if (payload[property] === 'true') {
				payload[property] = 1;
			} else if (payload[property] === 'false') {
				payload[property] = 0;
			}
		});

		if (req.files) {
			Object.keys(req.files).forEach((fieldName) => {
				req.files[fieldName].forEach((file) => {
					payload[file.fieldname] =
						req.protocol + '://' + req.get('host') + file?.destination?.replace('./public', '') + file?.filename;
				});
			});
		} else if (req.file) {
			payload[req.file.fieldname] =
				req.protocol + '://' + req.get('host') + req.file?.destination?.replace('./public', '') + req.file?.filename;
		}

		try {
			item = await this.model.query().updateAndFetchById(id, payload);
			//userlog
			//myUserLogging(req, item, res);
			if (!item) {
				const modelName = pascalToTitleCase(this.constructor.name.replace('Controller', ''));
				return res.status(404).send({ message: `${modelName} not found` });
			}

			return global.apiResponse(res, item, 'OK', 'Successfully updated');
		} catch (err) {
			console.log(err);
			//userlog
			myUserLogging(req, err, res);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	// async delete({ params }, res) {
	// 	const { id } = params;
	// 	try {
	// 		const result = await this.model.query().deleteById(id);
	// 		if (!result) {
	// 			const modelName = pascalToTitleCase(this.constructor.name.replace('Controller', ''));
	// 			return res.status(404).send({ message: `${modelName} not found` });
	// 		}
	// 		return global.apiResponse(res, result, 'OK', 'Successfully Deleted');
	// 	} catch (err) {
	// 		return global.apiResponse(res, {}, 'SE', err);
	// 	}
	// }

	// async delete(req, res) {
	// 	const { id } = req.params;
	// 	let result = undefined;
	// 	try {
	// 		result = await this.model.query().patchAndFetchById(id, {
	// 			IsActive: 0,
	// 			UpdatedBy: user?.Useraccess,
	// 		});
	// 		userLogging(
	// 			req.user?.POSUseraccessID,
	// 			'CREATE',
	// 			'SUCCESS',
	// 			JSON.stringify([result]),
	// 			'',
	// 			joinStrings([this.constructor.name.replace('Controller', ''), 'insert'], ' '),
	// 			user
	// 		);
	// 		if (!result) {
	// 			const modelName = pascalToTitleCase(this.constructor.name.replace('Controller', ''));
	// 			return res.status(404).send({ message: `${modelName} not found` });
	// 		}
	// 		return global.apiResponse(res, result, 'OK', 'Successfully Deleted');
	// 	} catch (err) {
	// 		userLogging(
	// 			req.user?.POSUseraccessID,
	// 			'CREATE',
	// 			'FAILED',
	// 			JSON.stringify(payload),
	// 			joinStrings([res, 'SE', err], ' '),
	// 			joinStrings([this.constructor.name.replace('Controller', ''), 'insert'], ' '),
	// 			user
	// 		);
	// 		return global.apiResponse(res, {}, 'SE', err);
	// 	}
	// }
	async soft_delete(req, res) {
		const { id } = req.params;
		const slugColumn = req.query.slug;

		let payload = {};

		if (Array.isArray(req.body)) {
			payload = req.body.map((item) => ({
				is_active: 0,
				updated_datetime: convertToSqlDateTime(new Date(), new Date()),
				//UpdatedBy: req.user?.Name,
				...item,
			}));
		} else {
			payload = {
				is_active: 0,
				updated_datetime: convertToSqlDateTime(new Date(), new Date()),
				//UpdatedBy: req.user?.Name,
				...req.body,
			};
		}

		if (slugColumn) {
			if (typeof slugColumn == 'string') {
				payload.Slug = slugifyWithDateTime(req.body[slugColumn]);
			} else {
				payload[slugColumn.column] = slugifyWithDateTime(req.body[slugColumn.target]);
			}
		}

		Object.keys(payload).forEach((property) => {
			if (payload[property] === 'true') {
				payload[property] = 1;
			} else if (payload[property] === 'false') {
				payload[property] = 0;
			}
		});

		if (req.files) {
			Object.keys(req.files).forEach((fieldName) => {
				req.files[fieldName].forEach((file) => {
					payload[file.fieldname] =
						req.protocol + '://' + req.get('host') + file?.destination?.replace('./public', '') + file?.filename;
				});
			});
		} else if (req.file) {
			payload[req.file.fieldname] =
				req.protocol + '://' + req.get('host') + req.file?.destination?.replace('./public', '') + req.file?.filename;
		}

		try {
			const item = await this.model.query().updateAndFetchById(id, payload);

			if (!item) {
				const modelName = pascalToTitleCase(this.constructor.name.replace('Controller', ''));
				return res.status(404).send({ message: `${modelName} not found` });
			}
			//userlog
			//myUserLogging(req, item, res);
			return global.apiResponse(res, item, 'OK', 'Successfully Voided');
		} catch (err) {
			console.log(err);
			//userlog
			myUserLogging(req, err, res);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async hard_delete({ params }, res) {
		const { id } = params;
		try {
			const result = await this.model.query().deleteById(id);
			if (!result) {
				const modelName = pascalToTitleCase(this.constructor.name.replace('Controller', ''));
				return res.status(404).send({ message: `${modelName} not found` });
			}
			//userlog
			myUserLogging(req, result, res);
			return global.apiResponse(res, result, 'OK', 'Successfully Deleted');
		} catch (err) {
			//userlog
			myUserLogging(req, err, res);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async myUserLogging(req, result_payload, res) {
		let req_payload = req.body;
		// console.log(res.req.method); //[0].method);
		// //console.log(res.req.url);
		// console.log(res.req.originalUrl);
		// console.log(res.req.body);
		let user = 'Postman';
		//req.user?.datacenter.CompleteName ?? joinStrings([req.user?.datacenter.Firstname, req.user?.datacenter.Lastname], ' ');
		let mycreatedby;
		let transtatus;
		if (result_payload instanceof Error) {
			transtatus = 'ERROR';
		} else {
			transtatus = 'SUCCESS';
		}
		// if (result_payload.code == undefined) transtatus = 'SUCCESS';
		// else transtatus = 'ERROR';
		//mycreatedby = (req_payload.body.CreatedBy == undefined)

		//romer edit
		if (req_payload.created_by != undefined) {
			mycreatedby = req_payload.created_by;
		}
		if (req_payload.updated_by != undefined) {
			mycreatedby = req_payload.updated_by;
		}
		if (req_payload.posted_by != undefined) {
			mycreatedby = req_payload.posted_by;
		}
		// if (req_payload.CreatedBy != undefined && req_payload.UpdatedBy == undefined && req_payload.PostedBy == undefined)
		// 	mycreatedby = req_payload.CreatedBy;
		// else if (req_payload.CreatedBy == undefined && req_payload.UpdatedBy != undefined && req_payload.PostedBy == undefined)
		// 	mycreatedby = req_payload.CreatedBy;
		// else if (req_payload.CreatedBy == undefined && req_payload.UpdatedBy == undefined && req_payload.PostedBy != undefined)
		// 	mycreatedby = req_payload.CreatedBy;
		// else mycreatedby = user;

		//console.log('adsad ' + result_payload);
		//console.log(req);
		if (result_payload != undefined) {
			//result_payload.request_params = req.params == undefined ? undefined : req.params;
		}

		//console.log(result_payload);
		//console.log(joinStrings([this.constructor.name.replace('Controller', ''), 'insert'], ' '));
		let main = {
			//UserlogID
			//UseraccessID
			SystemCategory: 'WEB',
			MainNavigation: res.req.url,
			TransactionType: res.req.method,
			TransactionStatus: transtatus,
			ApplicationVersion: null,
			RequestBody: JSON.stringify(req.body),
			Remarks: JSON.stringify(result_payload), //Boolean(result_payload.includes('{')) == true ? JSON.stringify(result_payload) : result_payload,
			Errorlogs: null,
			Queryused: joinStrings([this.constructor.name.replace('Controller', ''), 'insert'], ' '),
			CreatedBy: mycreatedby,
			CreatedDateTime: global.getCurrentDateTime(),
		};
		//console.log(main);
		await UserLogs.query().insert(main);
		//return 'OK';
		//return res.send('ok');
	}
}
async function myUserLogging(req, result_payload, res) {
	let req_payload = req.body;
	// console.log(res.req.method); //[0].method);
	// //console.log(res.req.url);
	// console.log(res.req.originalUrl);
	// console.log(res.req.body);
	let user =
		req.user?.datacenter.CompleteName ?? joinStrings([req.user?.datacenter.Firstname, req.user?.datacenter.Lastname], ' ');
	let mycreatedby;
	let transtatus;
	if (result_payload instanceof Error) {
		transtatus = 'ERROR';
	} else {
		transtatus = 'SUCCESS';
	}
	// if (result_payload.code == undefined) transtatus = 'SUCCESS';
	// else transtatus = 'ERROR';
	//mycreatedby = (req_payload.body.CreatedBy == undefined)
	if (req_payload.created_by != undefined && req_payload.UpdatedBy == undefined && req_payload.PostedBy == undefined)
		mycreatedby = req_payload.created_by;
	else if (req_payload.created_by == undefined && req_payload.UpdatedBy != undefined && req_payload.PostedBy == undefined)
		mycreatedby = req_payload.created_by;
	else if (req_payload.created_by == undefined && req_payload.UpdatedBy == undefined && req_payload.PostedBy != undefined)
		mycreatedby = req_payload.created_by;
	else mycreatedby = user;

	//result_payload.request_params = req.params;
	//console.log(result_payload);
	//console.log(joinStrings([this.constructor.name.replace('Controller', ''), 'insert'], ' '));
	let main = {
		//UserlogID
		//UseraccessID
		SystemCategory: 'WEB',
		MainNavigation: res.req.url,
		TransactionType: res.req.method,
		TransactionStatus: transtatus,
		ApplicationVersion: null,
		RequestBody: JSON.stringify(req.body),
		Remarks: JSON.stringify(result_payload),
		Errorlogs: null,
		Queryused: joinStrings([this.constructor.name.replace('Controller', ''), 'insert'], ' '),
		CreatedBy: mycreatedby,
		CreatedDateTime: global.getCurrentDateTime(),
	};
	await UserLogs.query().insert(main);
	//return 'OK';
	//return res.send('ok');
}
async function userLogging(UseraccessID, TransactionType, TransactionStatus, Remarks, Errorlogs, Queryused, CreatedBy) {
	await UserLogs.query().insert({
		UseraccessID,
		SystemCategory: 'WEB',
		TransactionType,
		TransactionStatus,
		Remarks,
		Errorlogs,
		Queryused,
		CreatedBy,
		CreatedDateTime: convertToSqlDateTime(new Date(), new Date()),
	});
}

function convertToSqlDateTime(date, time) {
	if (!date || !time) return;
	if (date instanceof Date === false) {
		date = new Date(date);
	}
	if (time instanceof Date === false) {
		time = new Date(time);
	}
	return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T${
		time.toTimeString().split(' ')[0]
	}`;
}

module.exports = BaseController;
