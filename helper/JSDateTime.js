class JSDateTime {
	constructor() {}

	//
	// <summary>
	// Converts date time to JS DateTime (ISO Format)
	// </summary>
	//
	Convert(dateTime) {
		dateTime = dateTime.toISOString();
		if (dateTime.indexOf('T') >= 0) {
			var date = dateTime.split('T');
			var dateTime = date[0] + ' ' + date[1].split('.')[0];
			if (dateTime.indexOf('Z') >= 0) {
				dateTime = dateTime.split('Z')[0];
			}
		}

		var dateTime = dateTime.split(' ');
		var date = dateTime[0].split('-');
		var time = dateTime[1].split(':');

		return new Date(date[2], date[1] - 1, date[0], time[0], time[1], 0, 0);
	}

	//
	// <summary>
	// Gets current DateTime (ISO Format)
	// </summary>
	//
	GetNow() {
		return new Date();
	}
}

module.exports = JSDateTime;
