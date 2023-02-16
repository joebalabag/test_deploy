exports.joinStrings = function (strings, seperator = ', ') {
	return strings.filter((v) => !!v).join(seperator);
};

exports.pascalToTitleCase = function (str) {
	return str.replace(/([A-Z])/g, ' $1').trim();
};

exports.slugify = (str) => {
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
	var to = 'aaaaeeeeiiiioooouuuunc------';
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str
		.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

	return str;
};

exports.slugifyWithDateTime = (str) => {
	const date = new Date();
	const day = ('0' + (date.getMonth() + 1)).slice(-2);
	const month = ('0' + date.getDate()).slice(-2);
	const year = (new Date().getFullYear() + '').slice(-2);
	const hours = ('0' + date.getHours()).slice(-2);
	const minutes = ('0' + date.getHours()).slice(-2);
	const seconds = ('0' + date.getSeconds()).slice(-2);

	const transformedDate = day + month + year + hours + minutes + seconds;

	return this.slugify(str) + '-' + transformedDate;
};
