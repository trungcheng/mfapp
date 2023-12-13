/* eslint-disable max-lines-per-function */

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postConfig = require('./postcss.config');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = function(config) {
	let envConfig = process.env.NODE_ENV === 'production' ? require('./prod')(config) : require('./dev');
	let IS_PROD = process.env.NODE_ENV === 'production';

	return merge(
		commonConfig(config),
		{
			entry: config.entry,
			output: {
				filename: `${config.name}/main.js?v=${config.version}`,
				path: path.resolve(config.root, './dist'),
				publicPath: `${config.publicUrl}`,
				chunkFilename: `${config.name}/js/[chunkhash].chunk.js?v=${config.version}`,
				jsonpFunction: `webpackJsonp-${config.name}`
			},
			optimization: {
				splitChunks: {
					automaticNameDelimiter: '-',
					cacheGroups: {
						vendors: {
							test: new RegExp(`[\\\\/]node_modules[\\\\/](${config.vendors.join('|')})[\\\\/]`),
							name: 'vendors',
							enforce: true
						}
					}
				}
			},
			module: {
				rules: [
					{
						test: /\.(png|jpg|gif)$/,
						exclude: /node_modules/,
						use: [
							{
								loader: 'file-loader',
								options: {
									name: `[name]-[hash].[ext]?v=${config.version}`,
									outputPath: `${config.name}/images/`
								}
							}
						]
					},
					{
						test: /\.(svg)$/,
						exclude: /node_modules/,
						use: [
							{
								loader: 'file-loader',
								options: {
									name: `[name]-[hash].[ext]?v=${config.version}`,
									outputPath: `${config.name}/svgs/`
								}
							}
						]
					},
					{
						test: /\.(woff(2)?|ttf|eot|otf)$/,
						exclude: /node_modules/,
						use: [
							{
								loader: 'file-loader',
								options: {
									name: `[name]-[hash].[ext]?v=${config.version}`,
									outputPath: `${config.name}/fonts/`
								}
							}
						]
					},
					{
						test: /\.(sa|sc|c)ss$/,
						exclude: /node_modules/,
						oneOf: [
							{
								resourceQuery: /global/,
								use: [
									IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
									'css-loader',
									{
										loader: 'postcss-loader',
										options: postConfig(config)
									},
									{
										loader: 'sass-loader',
										options: {
											data: config.css.data
										}
									}
								]
							},
							{
								use: [
									IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
									{
										loader: 'css-loader',
										options: {
											modules: {
												localIdentName: `${config.css.prefix}[local]`
											}
										}
									},
									{
										loader: 'postcss-loader',
										options: postConfig(config)
									},
									{
										loader: 'sass-loader',
										options: {
											data: config.css.data
										}
									}
								]
							}
						]
					}
				]
			},
			plugins: [
				new CopyPlugin(config.statics.map(function(dir) {
					return {
						from: dir,
						to: `statics/${config.name}`
					};
				})),
				new webpack.ProvidePlugin({
					React: 'react'
				})
			]
		},
		envConfig
	);
};