"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var parse = require('./parse');
var delEnterRegExp = /\s*\n\s*/g; //去除多余的换行
var funcRegExp = /\(.*\)/g;
module.exports = {
  arrConfig: {
    host: 'developer.mozilla.org',
    path: '/en-US/docs/Web/API/WebGLRenderingContext',
    method: 'GET',
    rejectUnauthorized: false,
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
    },
    fileName: 'webgl.attrs.json',
    factory: function factory(config, content) {
      function splitFuncGroup(name, params, syntax, desc, returnVal, postfix, n) {
        params = params.slice(0);
        if (postfix.indexOf('v') > -1) {
          params[params.length - 1].paramName = 'value';
        } else {
          var paramDesc = params.pop().desc;
          for (var i = 1; i <= n; i++) {
            params.push({
              paramName: 'v' + (i - 1),
              desc: paramDesc
            });
          }
        }
        var splits = [];
        for (var _i = 1; _i <= n; _i++) {
          splits.push({
            name: name + _i + postfix,
            syntax: syntax,
            desc: desc,
            params: params,
            returnVal: returnVal
          });
        }
        return splits;
      }
      var $ = parse(content);
      var name = config.path.split('/').slice(-1)[0];
      var type = 'value';
      var desc = '';
      var syntax = '';
      var returnVal = 'None.';
      var params = [];
      var descEle = $('#wikiArticle > p').eq(0);
      var syntaxEle = $('#Syntax+pre').eq(0);
      var returnValcEle = $('#Return_value+p').eq(0);
      var paramsEle = $('#Parameters+dl').eq(0);
      if (descEle) {
        desc = descEle.text();
        desc = desc.replace(delEnterRegExp, function () {
          return ' ';
        });
      }
      if (syntaxEle.eq(0)) {
        syntax = syntaxEle.text();
        if (syntax.match(funcRegExp)) {
          type = 'function';
        }
      }
      if (returnValcEle) {
        returnVal = returnValcEle.text() || returnVal;
      }
      if (paramsEle) {
        paramsEle.find('dt').each(function (index, dt) {
          params.push({
            paramName: $(dt).text()
          });
        });
        paramsEle.find('dd').each(function (index, dd) {
          if (!params[index]) {
            return;
          }
          var text = $(dd).text();
          text = text.replace(delEnterRegExp, function () {
            return ' ';
          });
          params[index].desc = text;
        });
      }
      //特殊处理texImage2D
      if (name === 'texImage2D') {
        params.pop();
        var offset = params.length;
        var nextParamsEle = $('#wikiArticle > dl').eq(1);
        nextParamsEle.find('dt').each(function (index, dt) {
          params.push({
            paramName: $(dt).text()
          });
        });
        nextParamsEle.find('dd').each(function (index, dd) {
          if (index === 0) {
            return;
          }
          if (!params[index - 1 + offset]) {
            return;
          }
          var text = $(dd).text();
          text = text.replace(delEnterRegExp, function () {
            return ' ';
          });
          params[index - 1 + offset].desc = text;
        });
      }
      //特殊处理 vertexAttrib、uniformMatrix、uniform
      if (name === 'uniform') {
        return [].concat(_toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 1)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 2)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 3)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 4)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'i', 1)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'i', 2)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'i', 3)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'i', 4)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'iv', 1)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'iv', 2)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'iv', 3)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'iv', 4)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 1)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 2)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 3)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 4)));
      } else if (name === 'uniformMatrix') {
        return [].concat(_toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 1)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 2)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 3)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 4)));
      } else if (name === 'vertexAttrib') {
        params.splice(params.length - 1, 1);
        return [].concat(_toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 1)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 2)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 3)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 4)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 1)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 2)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 3)), _toConsumableArray(splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 4)));
      }
      return {
        name: name,
        desc: desc,
        syntax: syntax,
        params: params,
        returnVal: returnVal,
        type: type,
        url: config.host + config.path
      };
    }
  },
  constantConfig: {
    host: 'developer.mozilla.org',
    path: '/en-US/docs/Web/API/WebGL_API/Constants',
    method: 'GET',
    rejectUnauthorized: false,
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
    },
    fileName: 'webgl.constants.json',
    factory: function factory(config, content) {
      var $ = parse(content);
      var data = [];
      $('tr').each(function (index, tr) {
        var result = {};
        $(tr).find('td').each(function (index, td) {
          switch (index) {
            case 0:
              result.name = $(td).text() || '';
              break;
            case 1:
              result.value = $(td).text() || '';
              break;
            case 2:
              result.desc = $(td).text() || '';
              break;
          }
          result.url = config.host + config.path;
        });
        if (result.name) {
          result.type = 'constant';
          data.push(result);
        }
      });
      return data;
    }
  }
};