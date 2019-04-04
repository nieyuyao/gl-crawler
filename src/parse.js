/**
 * @description 解析html
 */
const cheerio = require('cheerio');
function parse(doc) {
	return cheerio.load(doc);
}
module.exports = parse;
