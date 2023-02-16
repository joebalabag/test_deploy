const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'item_generic_id';
	static tableName = 'm_item_generic';

	static get relationMappings() {
		const Company = require('../../maintenance_module/company/company-model');
		const Item = require('../item/item-model');
		return {
			company: {
				relation: Model.BelongsToOneRelation,
				modelClass: Company,
				join: {
					from: 'm_item_generic.company_id',
					to: 'm_company.company_id',
				},
			},
			item: {
				relation: Model.HasManyRelation,
				modelClass: Item,
				join: {
					from: 'm_item_generic.item_generic_id',
					to: 'm_item.item_generic_id',
				},
			},
		};
	}
}

module.exports = MyModel;
