const path = require('path');
const request = require('./request');
const fs = require('fs');
const config = require('./config');
const parse = require('./parse');

/**
 * @description 处理webglcontext各个属性和方法对接的链接
 * @param {*} hrefs 
 */
function generate(hrefs) {
	_generate(0, hrefs, [])
		.then(res => {
			createJsonFile(JSON.stringify(res));
		})
		.catch(err => {
			throw err;
		});
}
function _generate(index, hrefs, result) {
	if (index >= hrefs.length) {
		return result;
	}
	const options = Object.assign({}, config, {
		path: path.resolve(config.path, hrefs[index])
	});
	return request(options)
		.then(val => {
			console.log((Math.floor((index + 1) * 100 / hrefs.length)) + '%');
			const $ = parse(val);
			let desc = '';
			let syntax = '';
			let returnVal = 'None.';
			const params = [];
			const descEle = $('#wikiArticle > p').eq(0);
			const syntaxEle = $('#Syntax+pre').eq(0);
			const returnValcEle = $('#Return_value+p').eq(0);
			const paramsEle = $('#Parameters+dl').eq(0);
			if (descEle) {
				desc = descEle.text();
			}
			if (syntaxEle.eq(0)) {
				syntax = syntaxEle.text();
			}
			if (returnValcEle) {
				returnVal = returnValcEle.text();
			}
			if (paramsEle) {
				paramsEle.find('dt').each((index, dt) => {
					params.push({
						paramName: $(dt).text()
					});
				});
				paramsEle.find('dd').each((index, dl) => {
					if (!params[index]) {
						return;
					}
					params[index].desc = $(dl).text();
				});
			}
			result.push({
				desc,
				syntax,
				params,
				returnVal,
				url: options.host + options.path
			});
			return _generate(++index, hrefs, result);
		})
		.catch(err => {
			// console.error('\033[0;31mrequest ' + options.host + options.path + 'error\033[0m');
			throw err;
		});
}
function createJsonFile(data) {
	const filePath = path.resolve(__dirname, '../res/webgl.json');
	fs.writeFile(filePath, data, err => {
		if (err) {
			throw err;
		}
		// console.log('\033[0;32m;file create success!\033[0m');
	});
}
module.exports = generate;