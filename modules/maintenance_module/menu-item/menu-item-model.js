const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'menu_item_id';
	static tableName = 'pos_menu_item';

	static get relationMappings() {
		const Company = require('../company/company-model');
		const MenuCategory = require('../menu-category/menu-category-model');

		return {
			company: {
				relation: Model.BelongsToOneRelation,
				modelClass: Company,
				join: {
					from: 'pos_menu_item.company_id',
					to: 'm_company.company_id',
				},
			},
			menu_category: {
				relation: Model.BelongsToOneRelation,
				modelClass: MenuCategory,
				join: {
					from: 'pos_menu_item.menu_category_id',
					to: 'pos_menu_category.menu_category_id',
				},
			},
		};
	}
}

module.exports = MyModel;
