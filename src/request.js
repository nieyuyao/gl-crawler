const https = require('https');
module.exports = function request(options) {
	return new Promise((resolve, reject) => {
		const req = https.request(options, res => {
			let content = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				content += chunk;
			});
			res.on('end', () => {
				resolve({
					config: options,
					content: content
				});
			});
			res.on('error', err => {
				reject(err);
			});
		});
		req.on('error', err => {
			reject(err);
		});
		req.end();
	});
};