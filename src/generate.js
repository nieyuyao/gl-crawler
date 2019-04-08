const path = require('path');
const request = require('./request');
const fs = require('fs');
// const parse = require('./parse');

/**
 * @description 处理webglcontext各个属性和方法对接的链接
 * @param {*} hrefs 
 */
function generate(config, hrefs) {
	return _generate(config, 0, hrefs, [])
		.then(data => {
			createJsonFile(JSON.stringify(data), config.fileName);
		})
		.catch(err => {
			throw err;
		});
}
function _generate(config, index, hrefs, result) {
	if (index >= hrefs.length) {
		return Promise.resolve(result);
	}
	const options = Object.assign({}, config, {
		path: path.resolve(config.path, hrefs[index])
	});
	return request(options)
		.then(res => {
			console.log((Math.floor((index + 1) * 100 / hrefs.length)) + '%');
			const data = res.config.factory(res.config, res.content);
			if (Array.isArray(data)) {
				result = [...result, ...data];
			} else {
				result.push(data);
			}
			return _generate(res.config, ++index, hrefs, result);
		})
		.catch(err => {
			throw err;
		});
}
function createJsonFile(data, fileName) {
	const filePath = path.resolve(__dirname, '../res/' + fileName);
	fs.writeFile(filePath, data, err => {
		if (err) {
			throw err;
		}
	});
}
module.exports = generate;