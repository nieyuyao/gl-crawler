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
			function splitFuncGroup(name, params, syntax, desc, returnVal, postfix, n) {
				params = params.slice(0);
				if (postfix.indexOf('v') > -1) {
					params[params.length - 1].paramName = 'value';
				} else {
					const paramDesc = params.pop().desc;
					for (let i = 1; i <= n; i++) {
						params.push({
							paramName: 'v' + (i-1),
							desc: paramDesc
						})
					}
				}
				let splits = [];
				for (let i = 1; i <= n; i++) {
					splits.push({
						name: name + i + postfix,
						syntax,
						desc,
						params,
						returnVal
					});
				}
				return splits;
			}
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
				paramsEle.find('dd').each((index, dd) => {
					if (!params[index]) {
						return;
					}
					let text = $(dd).text();
					text = text.replace(delEnterRegExp, () => {
						return ' ';
					});
					params[index].desc = text;
				});
			}
			//特殊处理texImage2D
			if (name === 'texImage2D') {
				params.pop();
				const offset = params.length;
				const nextParamsEle = $('#wikiArticle > dl').eq(1);
				nextParamsEle.find('dt').each((index, dt) => {
					params.push({
						paramName: $(dt).text()
					});
				});
				nextParamsEle.find('dd').each((index, dd) => {
					if (index === 0) {
						return;
					}
					if (!params[index - 1 + offset]) {
						return;
					}
					let text = $(dd).text();
					text = text.replace(delEnterRegExp, () => {
						return ' ';
					});
					params[index - 1 + offset].desc = text;
				});
			}
			//特殊处理 vertexAttrib、uniformMatrix、uniform
			if (name === 'uniform') {
				return [
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 1),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 2),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 3),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 4),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'i', 1),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'i', 2),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'i', 3),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'i', 4),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'iv', 1),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'iv', 2),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'iv', 3),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'iv', 4),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 1),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 2),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 3),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 4)
				]
				
			} else if (name === 'uniformMatrix') {
				return [
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 1),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 2),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 3),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 4)
				]
			} else if (name === 'vertexAttrib') {
				params.splice(params.length - 1, 1);
				return [
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 1),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 2),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 3),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'f', 4),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 1),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 2),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 3),
					...splitFuncGroup(name, params, syntax, desc, returnVal, 'fv', 4)
				]
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