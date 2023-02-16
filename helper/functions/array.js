exports.groupArray = (array, chunkSize) => {
	let groups = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		groups.push(array.slice(i, i + chunkSize));
	}
	return groups;
};

exports.getDistinctArray = (array, column) => {
	let unique = [];
	let distinct = [];

	for (let i = 0; i < array.length; i++) {
		if (!unique[array[i][column]]) {
			distinct.push(array[i]);
			unique[array[i][column]] = 1;
		}
	}

	return distinct;
};
