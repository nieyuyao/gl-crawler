#!/usr/bin/env node
const parse = require('./parse');
const config = require('./config');
const request = require('./request');
const generate = require('./generate');
console.log('waiting...');
request(config)
	.then(val => {
		console.log('crawling...');
		const $ = parse(val);
		const alist = $('#wikiArticle dt a');
		const result = alist.map((index, aitem) => {
			const code = $(aitem).find('code');
			if (code && $(code).text().indexOf('WebGLRenderingContext' > -1)) {
				return $(aitem).attr('href');
			}
			return '';
		}).get();
		generate(result);
	})
	.catch(err => {
		throw err;
	});