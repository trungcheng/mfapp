function replaceParams(str, o) {
	try {
		return str.replace(/{{1}([^{}]*)}{1}/gm, (a, b) => {
			try {
				const r = o[b];
				return typeof r === 'string' || typeof r === 'number' ? r : a;
			} catch (e) {
				return '';
			}
		});
	} catch (e) {
		return str;
	}
}

export default function(objKeys, params) {
	const { namespace } = coreConfig;
	let key = objKeys['default'];
	let opts = {};

	if ({}.toString.call(objKeys) !== '[object Object]') {
		key = window[namespace] ?
			objKeys[window[namespace].locale] || key : key;
	}

	if ({}.toString.call(params) === '[object Object]') {
		opts = params;
	} else if ({}.toString.call(params) === '[object Array]') {
		opts = Object.assign({}, params);
	}

	return `${replaceParams(key, opts)}`;
}