"use strict";

/**
 * @description 解析html
 */
var cheerio = require('cheerio');

function parse(doc) {
  return cheerio.load(doc);
}

module.exports = parse;