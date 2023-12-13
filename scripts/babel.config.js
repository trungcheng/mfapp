const path = require('path');

module.exports = function(config) {
	return {
		'presets': [
			'@babel/preset-env',
			'@babel/preset-react'
		],
		'plugins': [
			'@babel/plugin-transform-runtime',
			[
				'@babel/plugin-proposal-decorators',
				{
					'legacy': true
				}
			],
			[
				'@babel/plugin-proposal-class-properties',
				{
					'loose': true
				}
			],
			'@babel/plugin-proposal-export-namespace-from',
			'@babel/plugin-proposal-throw-expressions',
			'@babel/plugin-syntax-dynamic-import',
			'@babel/plugin-transform-modules-commonjs',
			[
				'react-css-modules',
				{
					'generateScopedName': `${config.css.prefix}[local]`,
					'filetypes': {
						'.scss': {
							'syntax': 'postcss-scss'
						}
					},
					'webpackHotModuleReloading': true
				}
			],
			[
				path.join(__dirname, '../src/plugins/babel-i18n-plugin.js'),
				config.locales
			],
			[
				'module-resolver',
				{
					'alias': config.alias
				}
			]
		]
	};
};