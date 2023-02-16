const BaseModel = require('../../base/base-model');
const { Model } = require('objection');

class MyModel extends BaseModel {
	static idColumn = 'menu_category_id';
	static tableName = 'pos_menu_category';

	static get relationMappings() {
		const Company = require('../company/company-model');
		const MenuItem = require('../menu-item/menu-item-model');
		return {
			company: {
				relation: Model.BelongsToOneRelation,
				modelClass: Company,
				join: {
					from: 'pos_menu_category.company_id',
					to: 'm_company.company_id',
				},
			},
			menu_item: {
				relation: Model.HasManyRelation,
				modelClass: MenuItem,
				join: {
					from: 'pos_menu_category.menu_category_id',
					to: 'pos_menu_item.menu_category_id',
				},
			},
		};
	}
}

module.exports = MyModel;
