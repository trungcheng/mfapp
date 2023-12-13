const _ = require('lodash');
const { isObject, isArray, isString, isEmpty } = require('coreutils-js');

function buildStatics(config) {
	let statics = [];

	if (isString(config.statics)) {
		statics.push(config.statics);
	} else if (isArray(config.statics)) {
		statics = config.statics;
	}

	console.log('Build statics =>', statics);

	return statics;
}

function buildLocales(config) {
	const locales = {};

	const build = (locale, values) => {
		if (!isObject(locales[locale])) {
			locales[locale] = {};
		}

		if (isObject(values)) {
			locales[locale][values.scope] = _.merge(
				locales[locale][values.scope],
				values.value
			);
		} else if (isArray(values)) {
			values.forEach(value => {
				locales[locale][value.scope] = _.merge(
					locales[locale][value.scope],
					value.value
				);
			});
		}
	};

	if (isObject(config.locales)) {
		Object.keys(config.locales).forEach(function(locale) {
			build(locale, config.locales[locale]);
		});
	}

	console.log('Build locales =>', locales);

	return locales;
}

function buildAlias(config) {
	const alias = {};

	if (isObject(config.alias)) {
		Object.keys(config.alias).forEach(key => {
			alias[`@${config.name}/${key}`] = config.alias[key];
		});
	}

	console.log('Build alias =>', alias);

	return alias;
}

function buildCss(configCss = {}) {
	const rs = {};

	if (isObject(configCss)) {
		if (isString(configCss.prefix) && !isEmpty(configCss.prefix)) {
			rs.prefix = configCss.prefix;
		}

		if (isString(configCss.data)) {
			rs.data = configCss.data;
		} else if (isArray(configCss.data)) {
			configCss.data.forEach(item => {
				if (isString(item)) {
					rs.data = (rs.data || '') + item;
				}
			});
		}

		if (isObject(configCss.include)) {
			rs.include = configCss.include;
		}

		if (isObject(configCss.selector)) {
			rs.selector = configCss.selector;
		}
	}

	console.log('Build css =>', rs);

	return rs;
}

function buildPlugins(config) {
	const plugins = [];

	const build = (plugin) => {
		plugins.push({
			root: config.root,
			namespace: config.namespace,
			name: plugin.name,
			entry: plugin.entry,
			version: config.version,
			env: config.env,
			publicUrl: config.publicUrl,
			css: _.merge({}, buildCss(config.css), buildCss(plugin.css)),
			request: config.request,
			statics: buildStatics(plugin),
			locales: buildLocales(plugin),
			alias: buildAlias(plugin),
			vendors: plugin.vendors,
			enableAnalyzer: config.enableAnalyzer
		});
	};

	if (isArray(config.plugins)) {
		config.plugins.forEach(function(plugin) {
			build(plugin);
		});
	} else if (isObject(config.plugins)) {
		build(config.plugins);
	}

	console.log('Build plugins =>', plugins);

	return plugins;
}

module.exports = function(pluginConfig) {
	const config = {
		root: pluginConfig.root || process.pwd(),
		namespace: pluginConfig.namespace || 'Widgets',
		name: pluginConfig.name || 'media-widgets',
		version: pluginConfig.version || '1.0.0',
		env: pluginConfig.env || 'development',
		publicUrl: pluginConfig.publicUrl || '',
		devServer: pluginConfig.devServer,
		plugins: buildPlugins(pluginConfig),
		css: buildCss(pluginConfig.css),
		enableAnalyzer: pluginConfig.enableAnalyzer || true
	};

	console.log('B1 load config =>', config);

	return config;
};