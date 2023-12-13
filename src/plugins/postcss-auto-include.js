/* eslint-disable max-len */
/* eslint-disable max-nested-callbacks */

const postcss = require('postcss');

module.exports = postcss.plugin('auto-include-plugin', function (opts) {
	let includeStyle = {};
	let includeSelector = {};

	if ({}.toString.call(opts) === '[object Object]') {
		if ({}.toString.call(opts.include) === '[object Object]') {
			includeStyle = opts.include;
		}

		if ({}.toString.call(opts.selector) === '[object Object]') {
			includeSelector = opts.selector;
		}
	}

	return function (root) {
		root.walkRules(rule => {
			if (/^[.#]+[_\-A-Za-z0-9]+$/gi.test(rule.selector)) {
				Object.keys(includeStyle).forEach(style => {
					rule.prepend({
						prop: style,
						value: includeStyle[style]
					});
				});

				if (/^[.#]{1}[_\-A-Za-z0-9]+$/gi.test(rule.selector)) {
					Object.keys(includeSelector).forEach(selector => {
						if ({}.toString.call(includeSelector[selector]) === '[object Object]') {
							let rs = `${rule.selector} ${selector} {`;

							Object.keys(includeSelector[selector]).forEach(style => {
								rs += `${style}: ${includeSelector[selector][style]};`;
							});

							rs += '}';

							root.prepend(rs);
						}
					});
				}
			}
		});
	};
});