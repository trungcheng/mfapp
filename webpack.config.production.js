const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "media-widget.js",
		path: path.resolve(__dirname, "dist"),
		library: 'MyMediaWidget',
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
					MiniCssExtractPlugin.loader,
                    { 
						loader: "css-loader", 
						options: { 
							sourceMap: true 
						} 
					},
                    {
                        loader: 'sass-loader',
                        options: {
							sourceMap: true,
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
					MiniCssExtractPlugin.loader,
                    { 
						loader: "css-loader", 
						options: { 
							sourceMap: true 
						} 
					},
					{
                        loader: 'sass-loader',
                        options: {
							sourceMap: true,
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                        }
                    }
				],
			},
		],
	},
	optimization: {
		minimizer: [
		  	new CssMinimizerPlugin(),
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
		new MiniCssExtractPlugin({
			filename: 'styles.css',
		}),
	],
};