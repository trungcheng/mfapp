const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "media-widget.js",
		path: path.resolve(__dirname, "dist"),
		library: 'MyMediaWidget',
		libraryTarget: "umd",
		umdNamedDefine: true,
		publicPath: '/dist/',
	},
	resolve: {
        extensions: ['.*', '.js', '.jsx'],
        alias: {
            '@context': path.resolve(__dirname, './src/context'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@ui': path.resolve(__dirname, './src/ui'),
            '@styles': path.resolve(__dirname, './src/styles'),
        }
    },
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
                test: /\.module\.(sa|sc|c)ss$/,
                use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: `m__[local]`
							}
						}
					},
					'sass-loader',
                ],
            },
			{
				test: /\.(sa|sc|c)ss$/,
                exclude: /\.module\.(sa|sc|c)ss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: `m__[local]`
							}
						}
					},
					'sass-loader',
                ],
			},
		],
	},
	optimization: {
		minimize: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
	],
	devServer: {
		host: '127.0.0.1',
		port: 7777,
		hot: true,
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		compress: false,
		open: false,
		historyApiFallback: true,
		webSocketServer: false,
	},
};
