const webpack = require('webpack');
const babelConfig = require('./babel.config');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function(config) {
	const plugins = [
		new DuplicatePackageCheckerPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(config.env),
			'process.env.VERSION': JSON.stringify(config.version),
			'process.env.NAME': JSON.stringify(config.name),
			'coreConfig': JSON.stringify({
				env: config.env,
				namespace: config.namespace,
				version: config.version,
				publicUrl: config.publicUrl
			})
		}),

	];

	if (config.enableAnalyzer === true) {
		plugins.push(new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false,
			generateStatsFile: true,
			reportFilename: `../stats/report-${config.name}.html`,
			statsFilename: `../stats/stats-${config.name}.json`
		}));
	}

	return {
		externals: [
			'child_process',
			'net',
			'tls',
			'dgram',
			'module'
		],
		node: {
			'fs': 'empty'
		},
		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: babelConfig(config)
						}
					]
				}
			]
		},
		plugins,
		resolve: {
			symlinks: false,
			alias: config.alias
		}
	};
};