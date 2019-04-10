const parse = require('./parse');
const delEnterRegExp = /\s*\n\s*/g; //去除多余的换行
const funcRegExp = /\(.*\)/g;
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
		factory: function (config, content) {
			const $ = parse(content);
			let name = config.path.split('/').slice(-1)[0];
			let type = 'value';
			let desc = '';
			let syntax = '';
			let returnVal = 'None.';
			const params = [];
			const descEle = $('#wikiArticle > p').eq(0);
			const syntaxEle = $('#Syntax+pre').eq(0);
			const returnValcEle = $('#Return_value+p').eq(0);
			const paramsEle = $('#Parameters+dl').eq(0);
			if (descEle) {
				desc = descEle.text();
				desc = desc.replace(delEnterRegExp, () => {
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
				paramsEle.find('dt').each((index, dt) => {
					params.push({
						paramName: $(dt).text()
					});
				});
				paramsEle.find('dd').each((index, dl) => {
					if (!params[index]) {
						return;
					}
					let text = $(dl).text();
					text = text.replace(delEnterRegExp, () => {
						return ' ';
					});
					params[index].desc = text;
				});
			}
			return {
				name,
				desc,
				syntax,
				params,
				returnVal,
				type,
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
		factory: function (config, content) {
			const $ = parse(content);
			let data = [];
			$('tr').each((index, tr) => {
				let result = {};
				$(tr).find('td').each((index, td) => {
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