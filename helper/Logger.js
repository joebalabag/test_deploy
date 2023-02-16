/*
    Customizing Color Scheme for Logger
    Reset = "\x1b[0m"
    Bright = "\x1b[1m"
    Dim = "\x1b[2m"
    Underscore = "\x1b[4m"
    Blink = "\x1b[5m"
    Reverse = "\x1b[7m"
    Hidden = "\x1b[8m"

    FgBlack = "\x1b[30m"
    FgRed = "\x1b[31m"
    FgGreen = "\x1b[32m"
    FgYellow = "\x1b[33m"
    FgBlue = "\x1b[34m"
    FgMagenta = "\x1b[35m"
    FgCyan = "\x1b[36m"
    FgWhite = "\x1b[37m"

    BgBlack = "\x1b[40m"
    BgRed = "\x1b[41m"
    BgGreen = "\x1b[42m"
    BgYellow = "\x1b[43m"
    BgBlue = "\x1b[44m"
    BgMagenta = "\x1b[45m"
    BgCyan = "\x1b[46m"
    BgWhite = "\x1b[47m"
*/

class Logger {
	constructor() {
		this.logs = [];
		this.enableTSLog = true;
		this.enableLog = true;
		this.enableError = true;
		this.enableWatch = true;
		this.enableJSON = true;
	}

	get count() {
		return this.logs.length;
	}

	TSlog(message) {
		const timestamp = new Date().toString();
		this.logs.push({ message, timestamp });
		if (this.enableTSLog) console.log(`${timestamp} : ${message}`);
	}

	log(message) {
		if (this.enableLog) console.log('\x1b[37m\x1b[40m', `${message}`);
	}

	error(message) {
		if (this.enableError) console.log('\x1b[36m\x1b[40m', `${message}`);
	}

	watch(message) {
		if (this.enableWatch) console.log('\x1b[32m\x1b[40m', `${message}`);
	}

	JSON(message) {
		if (this.enableJSON) console.log('\x1b[33m\x1b[40m', `${JSON.stringify(message, null, 4)}`);
	}
}

module.exports = Logger;
