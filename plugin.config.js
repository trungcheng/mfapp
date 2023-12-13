const path = require('path');
const config = require('./config');

module.exports = {
	root: path.join(__dirname, './'),
	namespace: 'MediaWidget',
	name: config.name,
	version: config.version,
	env: config.env,
	publicUrl: config.publicUrl,
	staticUrl: config.staticUrl,
	css: {
		prefix: config.cssPrefix
	},
	plugins: { // single object for 1 or array for multiples
		name: 'media',
		entry: path.join(__dirname, './plugin.register.js'),
		locales: {
			en: {
				scope: path.join(__dirname, './'),
				value: require('./src/locales/en.json')
			}
		},
		alias: {
			'config': path.join(__dirname, './config'), // @media/config
			'assets': path.join(__dirname, './src/assets'),
			'constants': path.join(__dirname, './src/constants'),
			'styles': path.join(__dirname, './src/styles'),
			'common': path.join(__dirname, './src/common'),
			'methods': path.join(__dirname, './src/methods'),
			'ui': path.join(__dirname, './src/ui'),
			'layout': path.join(__dirname, './src/layout'),
			'modules': path.join(__dirname, './src/modules'),
			'api': path.join(__dirname, './src/api')
		},
		statics: path.join(__dirname, './statics'),
		css: {
			prefix: 'w__',
			data: [
				'@import "~@media/assets/styles/_variables.scss";',
				'@import "~@media/styles/global.scss";',
			],
			include: {
				'box-sizing': 'border-box',
				'margin': '0px',
				'padding': '0px',
				'font-size': '14px',
				'color': '#333',
				'font-family': 'Arial,sans-serif'
			},
			selector: {
				'*': {
					'box-sizing': 'border-box',
					'margin': '0px',
					'padding': '0px'
				}
			}
		},
		vendors: [
			'react',
			'react-dom',
			'mobx',
			'mobx-react',
			'prop-types',
			'axios'
		],
	},
	devServer: {
		host: '127.0.0.1',
		port: 7777,
		https: false
	},
	enableAnalyzer: false
};