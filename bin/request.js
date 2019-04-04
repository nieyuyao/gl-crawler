"use strict";

var https = require('https');

module.exports = function request(options) {
  return new Promise(function (resolve, reject) {
    var req = https.request(options, function (res) {
      var content = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        content += chunk;
      });
      res.on('end', function () {
        resolve(content);
      });
      res.on('error', function (err) {
        reject(err);
      });
    });
    req.on('error', function (err) {
      reject(err);
    });
    req.end();
  });
};