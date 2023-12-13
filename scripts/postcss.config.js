const autoinclude = require('../src/plugins/postcss-auto-include');

module.exports = function(config) {
	return {
		syntax: 'postcss-scss',
		plugins: [
			autoinclude({
				include: config.css.include,
				selector: config.css.selector
			}),
			require('autoprefixer')
		]
	};
};