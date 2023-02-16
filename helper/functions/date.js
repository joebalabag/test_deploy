exports.formatDate = (date) => {
	const today = new Date(date);

	return `${('0' + (today.getUTCMonth() + 1)).slice(-2)}-${('0' + today.getUTCDate()).slice(-2)}-${today.getUTCFullYear()}`;
};

exports.formatTime = (date) => {
	const today = new Date(date);
	return `${('0' + (today.getUTCHours() % 12 || 12)).slice(-2)}:${('0' + today.getUTCMinutes()).slice(-2)}:${(
		'0' + today.getUTCSeconds()
	).slice(-2)}${today.getUTCHours() < 12 ? 'AM' : 'PM'}`;
};

// exports.formatDateTime = (date) => {
// 	const today = new Date(date);
// 	let md = `${('0' + (today.getUTCMonth() + 1)).slice(-2)}-${('0' + today.getUTCDate()).slice(-2)}-${today.getUTCFullYear()}`;
// 	let mt = `${('0' + (today.getUTCHours() % 12 || 12)).slice(-2)}:${('0' + today.getUTCMinutes()).slice(-2)}:${(
// 		'0' + today.getUTCSeconds()
// 	).slice(-2)}${today.getUTCHours() < 12 ? 'AM' : 'PM'}`;
	
// 	return md+' '+mt;
// };


exports.convertToSqlDateTime = (date) => {
	if (!date) return;
	if (date instanceof Date === false) {
		date = new Date(date);
	}

	return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T${
		date.toTimeString().split(' ')[0]
	}`;
};

exports.getCurrentDateTime = () => {
	const date = new Date();
	return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T${
		date.toTimeString().split(' ')[0]
	}`;
};

// module.exports = {
// 	formatDate,
// 	formatTime,
// 	convertToSqlDateTime,
// };
