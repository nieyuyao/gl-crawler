"use strict";

var path = require('path');

var request = require('./request');

var fs = require('fs');

var config = require('./config');

var parse = require('./parse');
/**
 * @description 处理webglcontext各个属性和方法对接的链接
 * @param {*} hrefs 
 */


function generate(hrefs) {
  _generate(0, hrefs, []).then(function (res) {
    createJsonFile(JSON.stringify(res));
  })["catch"](function (err) {
    throw err;
  });
}

function _generate(index, hrefs, result) {
  if (index >= hrefs.length) {
    return result;
  }

  var options = Object.assign({}, config, {
    path: path.resolve(config.path, hrefs[index])
  });
  return request(options).then(function (val) {
    console.log(index + 1 + '%');
    var $ = parse(val);
    var desc = '';
    var syntax = '';
    var returnVal = '';
    var descEle = $('#wikiArticle >p:first-child').eq(0);
    var syntaxEle = $('#Syntax+pre').eq(0);
    var returnValcEle = $('#Return_value+p').eq(0);

    if (descEle) {
      desc = descEle.text();
    }

    if (syntaxEle.eq(0)) {
      syntax = syntaxEle.text();
    }

    if (returnValcEle) {
      returnVal = returnValcEle.text();
    }

    result.push({
      desc: desc,
      syntax: syntax,
      returnVal: returnVal,
      url: options.host + options.path
    });
    return _generate(++index, hrefs, result);
  })["catch"](function (err) {
    // console.error('\033[0;31mrequest ' + options.host + options.path + 'error\033[0m');
    throw err;
  });
}

function createJsonFile(data) {
  var filePath = path.resolve(__dirname, '../res/webgl.json');
  fs.writeFile(filePath, data, function (err) {
    if (err) {
      throw err;
    } // console.log('\033[0;32m;file create success!\033[0m');

  });
}

module.exports = generate;