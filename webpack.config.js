const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "media-widget.js",
		path: path.resolve(__dirname, "dist"),
		library: 'MediaWidget',
		libraryTarget: "umd",
		umdNamedDefine: true,
		publicPath: '/',
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
                test: /\.module\.s(a|c)ss$/,
                use: [
					'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                        }
                    }
                ],
            },
			{
				test: /\.(s(a|c)ss)$/,
                exclude: /\.module.(s(a|c)ss)$/,
				use: [
					'style-loader',
                    'css-loader',
					{
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                        }
                    }
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
	],
	devServer: {
		historyApiFallback: true,
		webSocketServer: false,
	},
};
