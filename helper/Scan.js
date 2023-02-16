const fs = require('fs');
class Scan {
	constructor() {
		this.scannedFiles = [];
		this.errorFiles = [];
	}

	//
	// <summary>
	// Clears scanned and error files
	// </summary>
	//
	clearFiles() {
		this.scannedFiles = [];
		this.errorFiles = [];
	}

	//
	// <summary>
	// Scans entire directory and includes as middleware for app
	// </summary>
	//
	recursiveRouteScan(filepath) {
		fs.readdirSync(filepath).forEach((file) => {
			if (fs.lstatSync(filepath + `/` + file).isDirectory()) {
				Log.log(`PERFORMING SCAN IN ${filepath}/${file}`);
				this.recursiveRouteScan(filepath + `/` + file);
			}
			try {
				//console.log(file.indexOf(`routes.js`));
				if (file.indexOf(`routes.js`) >= 0) {
					let allow = true;
					if (file.indexOf(`.template`) >= 0) allow &= false;
					if ((process.env.ALLOW_TEST_FILES == 0 || process.env.NODE_ENV == 'production') && file.indexOf(`.test`) >= 0)
						allow &= false;
					if (allow) {
						Log.log(`USING:/${filepath}/${file}`);

						// global.app.use(require(filepath + `/` + file), require('../middleware/Auth.js'));
						global.app.use('/api', require(filepath + `/` + file));
					}
				}

				if (file.indexOf(`model.js`) >= 0 || file.indexOf(`controller.js`) >= 0) {
					let allow = true;
					if (file.indexOf(`.template`) >= 0) allow &= false;
					if ((process.env.ALLOW_TEST_FILES == 0 || process.env.NODE_ENV == 'production') && file.indexOf(`.test`) >= 0)
						allow &= false;
				}
			} catch (e) {
				Log.error(e.message);
				this.errorFiles.push(filepath + `/` + file);
			}
		});

		if (this.errorFiles.length > 0) return false;
		else return true;
	}
}

module.exports = Scan;
