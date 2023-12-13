const { isObject } = require('coreutils-js');
const pluginCreator = require('./plugin.creator');
const { namespace } = coreConfig;

module.exports = function(pluginName, instance) {
	console.log('Plugin has defined =>', pluginName, instance);

	if (!isObject(window[namespace])) {
		window[namespace] = {};
	}

	window[namespace][pluginName] = (callback) => {
		console.log('Callback before plugin loaded =>', callback);

		instance
			.then(({default: fn}) => {
				callback(pluginCreator(fn));
			})
			.catch(err => {
				throw err;
			});
	};
};