const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const open = require('open');

function deleteFolderRecursive(path) {
	if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
		fs.readdirSync(path).forEach(function(file) {
			const curPath = `${path}/${file}`;

			if (fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
				console.log(`Deleted file '${curPath}'`);
			}
		});

		fs.rmdirSync(path);
		console.log(`Deleted directory '${path}'`);
	}
}

module.exports = function(config) {
	deleteFolderRecursive(path.join(config.root, './dist'));

	if (['production'].indexOf(config.env) !== -1) {
		config.plugins.forEach(plugin => {
			const dirPath = path.join(plugin.root, `./dist/${plugin.name}`);
	
			if (!fs.existsSync(dirPath)) {
				fs.mkdirSync(dirPath, { recursive: true });
			}
	
			fs.writeFileSync(
				path.join(dirPath, '/app.json'),
				JSON.stringify({
					publicUrl: plugin.publicUrl,
					name: plugin.name,
					version: plugin.version,
					env: config.env
				})
			);
		});

		const arrCompile = [
			require('./wrapper.config')(config)
		];
	
		config.plugins.forEach(plugin => {
			arrCompile.push(require('./plugin.config')(plugin));
		});
	
		const compiler = webpack(arrCompile);

		compiler.run((err, stats) => {
			if (err) {
				console.error('Webpack compiler encountered a fatal error.', err);
				return;
			}

			console.info(
				stats.toString({
					chunks: true,
					colors: true,
				}),
			);
		});
	} else {
		const arrCompile = [
			require('./wrapper.config')(config)
		];
	
		config.plugins.forEach(plugin => {
			arrCompile.push(require('./plugin.config')(plugin));
		});

		console.log('B2 webpack compile =>', arrCompile);
	
		const compiler = webpack(arrCompile);
		
		const server = new WebpackDevServer(compiler, {
			publicPath: '/dist/',
			hot: false,
			inline: false,
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			contentBase: path.resolve(config.root, './examples'),
			compress: false,
			stats: {
				colors: true,
			},
			https: config.devServer.https
		});

		server.listen(
			config.devServer.port,
			config.devServer.host,
			() => {
				open(`http://${config.devServer.host}:${config.devServer.port}`);
			}
		);
	}
};