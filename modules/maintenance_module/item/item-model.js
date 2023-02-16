const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class Item extends BaseModel {
	static idColumn = 'item_id';
	static tableName = 'm_item';

	static get relationMappings() {
		const Company = require('../company/company-model');
		const ItemCategory = require('../item category/item-category-model');
		const ItemGeneric = require('../item-generic/item-generic-model');
		const TransLine = require('../../pos_module/transaction/transaction-line-model');

		return {
			company: {
				relation: Model.BelongsToOneRelation,
				modelClass: Company,
				join: {
					from: 'm_item.company_id',
					to: 'm_company.company_id',
				},
			},
			item_category: {
				relation: Model.BelongsToOneRelation,
				modelClass: ItemCategory,
				join: {
					from: 'm_item.item_category_id',
					to: 'm_item_category.item_category_id',
				},
			},
			item_generic: {
				relation: Model.BelongsToOneRelation,
				modelClass: ItemGeneric,
				join: {
					from: 'm_item.item_generic_id',
					to: 'm_item_generic.item_generic_id',
				},
			},
			transaction_line: {
				relation: Model.HasManyRelation,
				modelClass: TransLine,
				join: {
					from: 'm_item.item_id',
					to: 'pos_transaction_line.item_id',
				},
			},
		};
	}
}

module.exports = Item;
