const { raw, transaction } = require('objection');
const BaseController = require('../../base/base-controller');
const mdl = require('./journal-model');
const mdl_journal_entries = require('./journal-entry-model');
const mdl_journal_documents = require('./journal_document-model');
const baseController = new BaseController();

class Controller extends BaseController {
	constructor() {
		super(mdl);
	}

	async all(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				.withGraphFetched('journal_entries')
				.modifyGraph('journal_entries', (builder) => {
					builder.select(
						'account_id',
						'debit',
						'credit',
						'cost_dept_id',
						'req_dept_id',
						'cost_company_contact_id',
						'from_company_contact_id',
						'description',
						'additional_description',
						'transaction_no',
						'transaction_id',
						'transaction_idcolumn',
						'journal_datetime',
						'journal_by',
						'journal_status'
					);
				})
				.withGraphFetched('journal_document')
				.modifyGraph('journal_document', (builder) => {
					builder.select('reference_no', 'document_no', 'description', 'document_filepath', 'document_datetime');
				})
				.where({ company_id: req.query.company_id });

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async dashboard_summary(req, res) {
		try {
			let t_journalentries = await mdl
				.query()
				.select(
					raw('date_format(j.created_datetime,"%m/%d/%Y") as DailyDate'),
					'j.journal_id',
					raw('SUM(je.debit) as Debit'),
					raw('SUM(je.credit) as Credit'),
					raw('SUM(je.debit) - SUM(je.credit) as Balance')
				)
				.alias('j')
				.leftJoin('ams_journal_entries as je', 'j.journal_id', 'je.journal_id')
				.where('j.is_active', 1)
				.where(global.dateParams('j.created_datetime'), '>=', req.query.date_from)
				.where(global.dateParams('j.created_datetime'), '<=', req.query.date_to)
				.groupBy(raw('date_format(j.created_datetime,"%m/%d/%Y"), j.journal_id'));
			let t_summary = [];

			t_journalentries.reduce(function (res, value) {
				if (!res[value.DailyDate]) {
					res[value.DailyDate] = {
						DailyDate: value.DailyDate,
						JournalCount: 0,
						BalanceCount: 0,
						UnbalanceCount: 0,
						journal_list: [],
					};
					t_summary.push(res[value.DailyDate]);
				}
				return res;
			}, {});
			t_journalentries.forEach((element) => {
				t_summary.forEach((smy) => {
					if (smy.DailyDate == element.DailyDate) {
						smy.JournalCount = smy.JournalCount + 1;
						smy.journal_list.push(element);

						if (element.Balance != 0) smy.UnbalanceCount = smy.UnbalanceCount + 1;
						else smy.BalanceCount = smy.BalanceCount + 1;
					}
				});
			});

			let finaldata = { t_summary, t_journalentries };
			return global.apiResponse(res, finaldata, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async dashboard_main(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				.where(global.dateParams('created_datetime'), '>=', req.query.date_from)
				.where(global.dateParams('created_datetime'), '<=', req.query.date_to);
			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
	//with specific with related tables
	async view_specific(req, res) {
		try {
			let data = await mdl
				.query()
				.select()
				.withGraphFetched('journal_entries.[account,cost_department,req_department]') //
				.withGraphFetched('journal_document')
				.modifyGraph('journal_entries.account', (builder) => {
					builder.select('account_id', 'account_code', 'description');
				})
				.modifyGraph('journal_entries.cost_department', (builder) => {
					builder.select('dept_id', 'description');
				})
				.modifyGraph('journal_entries.req_department', (builder) => {
					builder.select('dept_id', 'description');
				})
				.where({ journal_id: req.query.journal_id });

			return global.apiResponse(res, data, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
	async UploadDocuments(req, res) {
		try {
			req.files.document_file != undefined
				? (req.body.document_file = '/journals/documents/' + req.files.document_file[0].filename)
				: delete req.body.document_file;
			req.body.created_datetime = global.getCurrentDateTime();
			req.body.is_active = 1;

			//let items = await m_journal_documents.query().insertAndFetch(req.body);
			let mydata = {
				document_no: req.body.document_no,
				reference_no: req.body.reference_no,
				description: req.body.description,
				document_datetime: req.body.document_datetime,
				created_by: req.body.created_by,
				document_file: req.body.document_file,
			};
			let items = mydata; //req.body.DocumentFile;
			return global.apiResponse(res, items, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}

	async GenerateReferenceNumber(getYear) {
		let newref;
		//console.log('year: ', getYear);
		let jv_year = getYear; //new Date().getFullYear();
		//console.log(data);
		let data = await mdl
			.query()
			.select()
			.where(raw('YEAR(created_datetime)'), '=', jv_year)
			.orderBy('journal_id', 'DESC')
			.limit(1)
			.first();

		//console.log('mdl: ', data);
		let finalref;
		let currentref;
		let remarks;
		if (data != undefined) {
			//ReferenceNumber
			//console.log('ref number:', data.reference_number);
			if (data.reference_number == null) {
				data.reference_number = 'JV' + jv_year + '-' + '0';
			}
			let numonly = parseInt(data.reference_number.substring(7, 255)) + 1;
			currentref = data.reference_numbe;
			finalref = 'JV' + jv_year + '-' + numonly;
			remarks = 'Existing';
			//console.log(numonly);
		} else {
			currentref = 'JV' + jv_year + '-' + 1;
			finalref = 'JV' + jv_year + '-' + 1;
			remarks = 'New';
		}
		let t_body = {
			CurrentReferenceNo: currentref,
			NewReferenceNumber: finalref,
			Remarks: remarks,
		};
		return t_body;
	}

	//check if all props exists
	async create(req, res) {
		try {
			let EncodedBy = req.body.created_by;

			req.body.journal_by = req.body.created_by;
			// req.body.isBalance = 1;
			// req.body.isManual = 1;
			// req.body.isPrepared = 0;
			req.body.is_active = 1;
			req.body.created_datetime = global.getCurrentDateTime();
			req.body.journal_status = 'PENDING';
			req.body.journal_datetime = global.getCurrentDateTime(); ///this may change
			let jv_entrydate = new Date(req.body.journal_datetime);

			let jvnum = await this.GenerateReferenceNumber(jv_entrydate.getFullYear());
			//console.log(jvnum);
			req.body.journal_entries.map((item) => {
				item.journal_datetime = req.body.journal_datetime;
				item.journal_by = EncodedBy;
				item.created_datetime = global.getCurrentDateTime();
				item.created_by = EncodedBy;
			});
			req.body.reference_number = jvnum.NewReferenceNumber;

			if (req.body.journal_document != null) {
				req.body.journal_document.map((item) => {
					delete item.journal_document_id;
					item.created_datetime = global.getCurrentDateTime();
					item.is_active = 1;
					item.created_by = EncodedBy;
				});
			}
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

	async update(req, res) {
		try {
			let EncodedBy = req.body.UpdatedBy;

			let mytrans = await transaction(
				mdl,
				mdl_journal_entries,
				mdl_journal_documents,
				async (mdl, mdl_journal_entries, mdl_journal_documents) => {
					let main;

					req.body.updated_datetime = global.getCurrentDateTime();
					let b_journal = { ...req.body };
					b_journal.journal_entries = undefined;

					//update journal
					let t_journal = await mdl.query().updateAndFetchById(req.query.journal_id, b_journal);
					let t_journalentries_delete;
					let b_journalentries_update = [];
					let b_journalentries_insert = [];

					let t_journalentries_update;
					let t_journalentries_insert;

					let b_journaldocuments_insert = [];
					let b_journaldocuments_update;
					let t_journaldocuments_delete;

					//remove entries nga wala na..
					let new_journalentriesid =
						req.body.journal_entries.length > 0
							? req.body.journal_entries.map((item) => item.journal_entries_id).join(',')
							: null;

					let new_journaldocumentsid =
						req.body.journal_document.length > 0
							? req.body.journal_document.map((item) => item.journal_document_id).join(',')
							: null;

					//console.log('new docs:', new_journaldocumentsid);
					if (new_journalentriesid != null) {
						t_journalentries_delete = await mdl_journal_entries
							.query()
							.delete()
							.where(raw('journal_entries_id NOT IN (' + new_journalentriesid + ')'))
							.where('journal_id', req.query.journal_id);
					}
					//for update and insert of entries
					req.body.journal_entries.forEach((element) => {
						if (element.journal_entries_id == 0) {
							//for insert.
							b_journalentries_insert.push({
								journal_id: req.query.journal_id,
								cost_dept_id: element.cost_dept_id,
								req_dept_id: element.req_dept_id,
								account_id: element.account_id,
								debit: element.debit,
								credit: element.credit,
								description: element.description,
								additional_description: element.additional_description,
								journal_datetime: req.body.journal_datetime,
								journal_by: EncodedBy,
								created_datetime: global.getCurrentDateTime(),
								transaction_no: 'NA',
								transaction_id: 1,
								created_by: EncodedBy,
								cost_company_contact_id: element.cost_company_contact_id,
								from_company_contact_id: element.from_company_contact_id,
							});
						} else {
							//for update
							b_journalentries_update.push(
								mdl_journal_entries.query().updateAndFetchById(element.journal_entries_id, {
									journal_datetime: req.body.JournalDateTime,
									cost_dept_id: element.SubDeptID,
									req_dept_id: element.ReqSubDeptID,
									account_id: element.AccountID,
									debit: element.debit,
									credit: element.credit,
									description: element.description,
									updated_by: EncodedBy,
									updated_datetime: global.getCurrentDateTime(),
								})
							);
						}
					});

					//console.log('body entry insert', b_journalentries_insert);

					//execute insert
					t_journalentries_insert = await mdl_journal_entries.query().insertGraphAndFetch(b_journalentries_insert);
					//execute update
					t_journalentries_update = await Promise.all(b_journalentries_update);

					if (req.body.journal_document?.length > 0) {
						if (new_journaldocumentsid != null) {
							t_journaldocuments_delete = await mdl_journal_documents
								.query()
								.delete()
								.where(raw('journal_document_id NOT IN (' + new_journaldocumentsid + ')'))
								.where('journal_id', req.query.journal_id);
						}
						req.body.journal_document.forEach((element) => {
							if (element.journal_document_id == 0) {
								b_journaldocuments_insert.push({
									//JournalDocumentID: element.JournalDocumentID,
									journal_id: req.query.journal_id,
									reference_no: element.reference_no,
									document_no: element.document_no,
									description: element.description,
									document_filepath: element.document_filepath,
									document_datetime: element.document_datetime,
									is_active: 1, //element.isActive,
									created_datetime: global.getCurrentDateTime(), // element.CreatedDateTime,
									created_by: element.CreatedBy,
								});
							}
						});

						t_journalentries_insert = await mdl_journal_documents.query().insertGraphAndFetch(b_journaldocuments_insert);
					}

					return (main = {
						t_journal,
						t_journalentries_insert,
						t_journalentries_update,
						t_journalentries_delete,
						t_journalentries_insert,
					});
				}
			);

			//let t_data = await mdl.query().insertGraph(req.body);

			baseController.myUserLogging(req, mytrans, res);
			//items = await items;
			return global.apiResponse(res, mytrans, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
	async Last(req, res) {
		try {
			let mydate = new Date(req.query.RecordDate);
			let items = await this.GenerateReferenceNumber(mydate.getFullYear());
			//items = await items;
			return global.apiResponse(res, items, 'OK');
		} catch (err) {
			console.log(err);
			return global.apiResponse(res, {}, 'SE', err);
		}
	}
}

module.exports = new Controller();
