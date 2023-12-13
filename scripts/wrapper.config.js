const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./common');
const TerserPlugin = require('terser-webpack-plugin');
const devConfig = require('./dev');

module.exports = function(config) {
	let envConfig = {};

	if (['production'].indexOf(config.env) !== -1) {
		envConfig = {
			mode: 'production',
			optimization: {
				minimizer: [
					new TerserPlugin({
						test: /\.js(\?.*)?$/i,
						exclude: /node_modules/,
						sourceMap: true,
						terserOptions: {
							output: {
								comments: false,
							}
						}
					})
				]
			}
		};
	} else {
		envConfig = devConfig;
	}

	return merge(
		commonConfig(config),
		{
			entry: path.resolve(__dirname, '../src/index.js'),
			output: {
				filename: `${config.name}.js?v=${config.version}`,
				path: path.resolve(config.root, './dist'),
				jsonpFunction: `webpackJsonp-${config.name}`
			}
		},
		envConfig
	);
};