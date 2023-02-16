const { raw } = require('objection');
const CryptoJS = require('crypto-js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = (props) => {
	multer.diskStorage({
		destination: function (req, file, cb) {
			console.log('test only ', props);
			let path = `./public/${props?.directory || 'uploads'}/`;
			fs.mkdirSync(path, { recursive: true });
			cb(null, path);
		},
		filename: function (req, file, cb) {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
			cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
		},
	});
};

const globals = () => {
	global.formatDate = (date) => {
		const today = new Date(date);

		return `${('0' + (today.getUTCMonth() + 1)).slice(-2)}-${('0' + today.getUTCDate()).slice(-2)}-${today.getUTCFullYear()}`;
	};

	global.formatTime = (date) => {
		const today = new Date(date);
		return `${('0' + (today.getUTCHours() % 12 || 12)).slice(-2)}:${('0' + today.getUTCMinutes()).slice(-2)}:${(
			'0' + today.getUTCSeconds()
		).slice(-2)}${today.getUTCHours() < 12 ? 'AM' : 'PM'}`;
	};

	global.formatDateTime = (date) => {
		const today = new Date(date);
		let md = `${('0' + (today.getUTCMonth() + 1)).slice(-2)}-${('0' + today.getUTCDate()).slice(-2)}-${today.getUTCFullYear()}`;
		let mt = `${('0' + (today.getUTCHours() % 12 || 12)).slice(-2)}:${('0' + today.getUTCMinutes()).slice(-2)}:${(
			'0' + today.getUTCSeconds()
		).slice(-2)}${today.getUTCHours() < 12 ? 'AM' : 'PM'}`;

		return md + ' ' + mt;
	};

	global.convertToSqlDateTime = (date) => {
		if (!date) return;
		if (date instanceof Date === false) {
			date = new Date(date);
		}

		return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T${
			date.toTimeString().split(' ')[0]
		}`;
	};

	global.getCurrentDateTime = () => {
		const date = new Date();
		return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T${
			date.toTimeString().split(' ')[0]
		}`;
	};

	global.dateParams = (columnName) => {
		return raw(`CAST(${columnName} AS DATE)`);
	};

	global.getArraySum = (a) => {
		var total = 0;
		for (var i in a) {
			total += a[i];
		}
		return total;
	};

	global.groupBy = (array, key) => {
		// Return the reduced array
		return array.reduce((result, currentItem) => {
			// If an array already present for key, push it to the array. Otherwise create an array and push the object.
			(result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
			// return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
			return result;
		}, {}); // Empty object is the initial value for result object
	};

	global.groupByHeader = (array, key) => {
		// Return the reduced array
		return array.reduce((result, currentItem) => {
			// If an array already present for key, push it to the array. Otherwise create an array and push the object.
			result[currentItem[key]] = key;
			//(result[currentItem[key]] = result[currentItem[key]] || []).push( currentItem );
			// return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
			return result;
		}, {}); // Empty object is the initial value for result object
	};
	global.removeDuplicate = (arr) => {
		let result = arr.filter(function (item, pos) {
			return arr.indexOf(item) == pos;
		});
		// at first loop -> item = 1 -> so indexOf = 0 & pos = 0 -> so return data
		// at second loop -> item = 4 -> so indexOf = 1 & pos = 1 -> so return data
		// at third loop -> item = 5 -> so indexOf = 2 & pos = 2 -> so return data
		// at fourth loop -> item = 4 -> so indexOf = 1 & pos = 3 -> no return
		// at fifth loop -> item = 1 -> so indexOf = 0 & pos = 4 -> no return
		return result;
	};
	// module.exports = {
	// 	formatDate,
	// 	formatTime,
	// 	convertToSqlDateTime,
	// };
	global.zeroPadding = (num, places) => {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join('0') + num;
	};

	global.ProperName = (firstname, middlename, lastname, suffix, extension) => {
		let completename = '';
		extension = extension == null ? '' : ' ' + extension;
		let mname, suff;
		suff = suffix == null ? '' : ' ' + suffix;
		mname = middlename == null ? ' ' : ' ' + middlename.substring(0, 1) + '. ';

		completename = {
			name_fmls: firstname + mname + lastname + suff + extension,
			name_lfsm: lastname + ', ' + firstname + suff + mname + extension,
		};

		return completename;
	};

	global.PatientStatusName = (level) => {
		let description;

		if (level == 1) description = 'Active';
		else if (level == 2) description = 'Clearance For Ancillary';
		else if (level == 3) description = 'Cleared';
		else if (level == 4) description = 'For Billing';
		else if (level == 5) description = 'Final Bill';
		else if (level == 6) description = 'Settled';
		else if (level == 7) description = 'For Discharge';
		else if (level == 8) description = 'Discharge Go Home';
		else if (level == 9) description = 'Absconded';
		else if (level == 10) description = 'For Admission';
		else if (level == 11) description = 'Transfer RegisterType';
		else if (level == 12) description = 'Admitted';
		else if (level == 13) description = 'Cancel Admission';

		return description;
	};

	global.CalculateAgeYMD = (bday) => {
		let myage = '1';
		let mydate, tmpdate, myyear, mymonth, myday;
		tmpdate = bday;
		myyear = new Date() - new Date(tmpdate);
		myyear = new Date(myyear).getUTCFullYear();
		myyear = Math.abs(myyear - 1970);

		if (new Date().getMonth() > new Date(bday).getMonth()) {
			mymonth = new Date().getMonth() - new Date(bday).getMonth();
		} else if (new Date().getMonth() == new Date(bday).getMonth()) {
			mymonth = 0;
		} else {
			let data =
				new Date().getMonth() - new Date(bday).getMonth() + 12 * (new Date().getFullYear() - new Date(bday).getFullYear());
			mymonth = data > 11 ? 0 : data;
		}

		myday = new Date().getDate() >= new Date(bday).getDate() ? new Date().getDate() - new Date(bday).getDate() : 0;

		myage = {
			//Birthdate: bday,
			AgeYMD: myyear + 'Y ' + mymonth + 'M ' + myday + 'D',
			Age: myyear,
		};
		return myage;
	};

	global.encryptString = (queryString) => {
		var key = CryptoJS.enc.Utf8.parse('C*F-JaNdRgUkXp2s');
		var iv = CryptoJS.enc.Utf8.parse('&F)H@McQfTjWnZr4');
		const options = {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		};
		var ss = JSON.stringify(queryString);
		// const decrypted = JSON.parse(CryptoJS.AES.decrypt(req.query.string, key, options).toString(CryptoJS.enc.Utf8));
		const encrypt = CryptoJS.AES.encrypt(ss, 'sampleKey123');

		return encrypt;
	};

	global.decryptString = (queryString) => {
		var key = CryptoJS.enc.Utf8.parse('C*F-JaNdRgUkXp2s');
		var iv = CryptoJS.enc.Utf8.parse('&F)H@McQfTjWnZr4');
		const options = {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		};
		// const decrypted = JSON.parse(CryptoJS.AES.decrypt(req.query.string, key, options).toString(CryptoJS.enc.Utf8));
		const decrypted = JSON.parse(CryptoJS.AES.decrypt(queryString, key, options).toString(CryptoJS.enc.Utf8));

		return decrypted;
	};

	global.upload = (props) => {
		//console.log(props.directory);
		return multer({ storage: storage({ directory: props?.directory }) });
	};

	global.groupBy = (list, keyGetter) => {
		const map = new Map();
		list.forEach((item) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [item]);
			} else {
				collection.push(item);
			}
		});
		return map;
	};

	global.GenerateTransNo = (transtype, recordcount) => {
		try {
			const date = new Date();
			const yy = date.getFullYear().toString().slice(2);
			const mm = ('0' + (date.getMonth() + 1)).slice(-2);
			let transno = `${transtype}${yy}${mm}-`;

			if (recordcount != undefined || recordcount > 0) {
				transno = `${transno}${global.zeroPadding(recordcount + 1, 5)}`;
				return transno;
			} else {
				transno = `${transno}${global.zeroPadding(1, 5)}`;
				return transno;
			}
		} catch (err) {
			console.log(err);
			return '000'; //global.apiResponse(res, {}, 'SE', err);
		}
	};
};
module.exports = globals;
