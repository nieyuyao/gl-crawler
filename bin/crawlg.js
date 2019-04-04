#!/usr/bin/env node
"use strict";

var parse = require('./parse');

var config = require('./config');

var request = require('./request');

var generate = require('./generate');

console.log('waiting...');
request(config).then(function (val) {
  console.log('crawling...');
  var $ = parse(val);
  var alist = $('#wikiArticle dt a');
  var result = alist.map(function (index, aitem) {
    var code = $(aitem).find('code');

    if (code && $(code).text().indexOf('WebGLRenderingContext' > -1)) {
      return $(aitem).attr('href');
    }

    return '';
  }).get();
  generate(result);
})["catch"](function (err) {
  throw err;
});