const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function(config) {
	return {
		mode: 'production',
		optimization: {
			minimizer: [
				new TerserPlugin({
					test: /\.js(\?.*)?$/i,
					exclude: /node_modules/,
					sourceMap: false,
					terserOptions: {
						output: {
							comments: false,
						},
						parallel: true
					}
				}),
				new OptimizeCSSAssetsPlugin({
					cssProcessor: cssnano,
					cssProcessorOptions: {
						discardComments: {
							removeAll: true,
						},
						safe: true
					},
					canPrint: false
				})
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: `${config.name}.css?v=${config.version}`,
				chunkFilename: `${config.name}/css/[chunkhash].chunk.css?v=${config.version}`
			})
		]
	};
};