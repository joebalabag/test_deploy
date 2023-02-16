const BaseModel = require('../base/base-model');

class Userlogs extends BaseModel {
	static idColumn = 'UserlogID';
	static tableName = 'Web_Userlogs';
}

module.exports = Userlogs;
