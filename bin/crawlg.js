#!/usr/bin/env node
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var parse = require('./parse');

var configs = require('./configs');

var request = require('./request');

var generate = require('./generate');

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return request(configs.arrConfig).then(function (res) {
            console.log('crawling attrs...');
            var $ = parse(res.content);
            var alist = $('#wikiArticle dt a');
            var hrefs = alist.map(function (index, aitem) {
              var code = $(aitem).find('code');

              if (code && $(code).text().indexOf('WebGLRenderingContext' > -1)) {
                return $(aitem).attr('href');
              }

              return '';
            }).get();
            return generate(res.config, hrefs); //result为新生成的链接列表
          })["catch"](function (err) {
            throw err;
          });

        case 2:
          console.log('crawling constants...');
          _context.next = 5;
          return generate(configs.constantConfig, ['/en-US/docs/Web/API/WebGL_API/Constants']);

        case 5:
          console.log('ok');

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();