"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var path = require('path');
var request = require('./request');
var fs = require('fs');
// const parse = require('./parse');

/**
 * @description 处理webglcontext各个属性和方法对接的链接
 * @param {*} hrefs 
 */
function generate(config, hrefs) {
  return _generate(config, 0, hrefs, []).then(function (data) {
    createJsonFile(JSON.stringify(data), config.fileName);
  })["catch"](function (err) {
    throw err;
  });
}
function _generate(config, index, hrefs, result) {
  if (index >= hrefs.length) {
    return Promise.resolve(result);
  }
  var options = Object.assign({}, config, {
    path: path.resolve(config.path, hrefs[index])
  });
  return request(options).then(function (res) {
    console.log(Math.floor((index + 1) * 100 / hrefs.length) + '%');
    var data = res.config.factory(res.config, res.content);
    if (Array.isArray(data)) {
      result = [].concat(_toConsumableArray(result), _toConsumableArray(data));
    } else {
      result.push(data);
    }
    return _generate(res.config, ++index, hrefs, result);
  })["catch"](function (err) {
    throw err;
  });
}
function createJsonFile(data, fileName) {
  var filePath = path.resolve(__dirname, '../res/' + fileName);
  fs.writeFile(filePath, data, function (err) {
    if (err) {
      throw err;
    }
  });
}
module.exports = generate;