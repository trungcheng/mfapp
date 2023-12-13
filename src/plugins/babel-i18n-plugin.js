const path = require('path');

module.exports = ({ types: t }) => {
	return {
		pre() {
			if ({}.toString.call(this.opts) !== '[object Object]') {
				throw new Error('Invalid options fori18n-plugin. Options must be type object.');
			}
		},
		visitor: {
			Program(p) {
				// Global import module: ../libs/translate.js
				const globalImport = t.importDeclaration(
					[ t.importDefaultSpecifier(t.identifier('__t')) ],
					t.stringLiteral(path.join(__dirname, './translate.js'))
				);

				p.unshiftContainer('body', globalImport);
			},

			CallExpression(p) {
				if (p.node.callee.name === '__') {
					const locales = this.opts;
					const key = p.node.arguments[0].value || '';
					const results = {};

					Object.keys(locales).forEach(locale => {
						const roots = [];

						Object.keys(locales[locale]).forEach(root => {
							if (this.file.opts.filename.indexOf(root) === 0) {
								roots.push(root);
							}
						});

						roots.sort((a, b) => a.length - b.length);

						roots.forEach((root) => {
							if (locales[locale][root][key]) {
								results[locale] = locales[locale][root][key];
								return;
							}
						});
					});

					results['default'] = key;

					p.node.callee.name = '__t';
					p.node.arguments[0].value = results;
				}
			}
		}
	};
};