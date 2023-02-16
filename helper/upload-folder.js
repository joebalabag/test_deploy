const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = (props) =>
	multer.diskStorage({
		destination: function (req, file, cb) {
			let path = `./public/${props?.directory || 'uploads'}/`;
			fs.mkdirSync(path, { recursive: true });
			cb(null, path);
		},
		filename: function (req, file, cb) {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
			cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
		},
	});

const upload = (props) => {
	return multer({ storage: storage({ directory: props?.directory }) });
};

module.exports = upload;
