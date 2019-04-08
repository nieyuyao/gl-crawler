#!/usr/bin/env node
const parse = require('./parse');
const configs = require('./configs');
const request = require('./request');
const generate = require('./generate');
(async function () {
	await request(configs.arrConfig)
			.then(res => {
				console.log('crawling attrs...');
				const $ = parse(res.content);
				const alist = $('#wikiArticle dt a');
				const hrefs = alist.map((index, aitem) => {
					const code = $(aitem).find('code');
					if (code && $(code).text().indexOf('WebGLRenderingContext' > -1)) {
						return $(aitem).attr('href');
					}
					return '';
				}).get();
				return generate(res.config, hrefs); //result为新生成的链接列表
			})
			.catch(err => {
				throw err;
			});
	console.log('crawling constants...');
	await generate(configs.constantConfig, ['/en-US/docs/Web/API/WebGL_API/Constants']);
	console.log('ok');
})();