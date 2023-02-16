const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class TransLine extends BaseModel {
	static idColumn = 'transaction_line_id';
	static tableName = 'pos_transaction_line';

	static get relationMappings() {
		const POSTransaction = require('./transaction-model');
		const Itemx = require('../../maintenance_module/item/item-model'); //require('../../maintenance_module/item/item-model');
		//console.log(Itemx);
		return {
			transaction: {
				relation: Model.BelongsToOneRelation,
				modelClass: POSTransaction,
				join: {
					from: 'pos_transaction_line.transaction_id',
					to: 'pos_transaction.transaction_id',
				},
			},
			item: {
				relation: Model.BelongsToOneRelation,
				modelClass: Itemx,
				join: {
					from: 'pos_transaction_line.item_id',
					to: 'm_item.item_id',
				},
			},
		};
	}
}

module.exports = TransLine;
