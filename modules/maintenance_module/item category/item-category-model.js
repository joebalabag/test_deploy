const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'item_category_id';
	static tableName = 'm_item_category';

	static get relationMappings() {
		const ItemGroup = require('../item-group/item-group-model');
		const Item = require('../item/item-model');
		return {
			item_group: {
				relation: Model.BelongsToOneRelation,
				modelClass: ItemGroup,
				join: {
					from: 'm_item_category.item_group_id',
					to: 'm_item_group.item_group_id',
				},
			},
			item: {
				relation: Model.HasManyRelation,
				modelClass: Item,
				join: {
					from: 'm_item_category.item_category_id',
					to: 'm_item.item_category_id',
				},
			},
		};
	}
}

module.exports = MyModel;
