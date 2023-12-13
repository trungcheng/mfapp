import {
	isObject,
	isArray,
	isEmpty,
	isFunction,
	propTypes,
	loadResources,
	deviceDetector
} from 'coreutils-js';

const { namespace, publicUrl, version, env } = coreConfig;

function fetchJSONFile(path) {
	return new Promise((resolve) => {
		if (env == 'development') {
			resolve({});
		} else {
			const httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = function() {
				if (httpRequest.readyState === 4) {
					if (httpRequest.status === 200) {
						const data = JSON.parse(httpRequest.responseText);

						return resolve(data);
					}
				}
			};
			httpRequest.open('GET', path);
			httpRequest.send();
		}
	});
}

function initMethod(instance, opts) {
	const props = propTypes(opts, {
		name: {
			type: 'string',
			required: true,
			empty: false
		},
		options: 'object',
		load: 'function'
	});

	if (isFunction(instance[props.name])) {
		console.log('B12 Init methods is running =>', instance, props);
		instance[props.name](props.options, props.load);
	} else {
		console.error(`Method "${props.name}" not registered`);
	}
}

function initPlugin(opts) {
	console.log('B6 init plugin params =>', opts);

	const props = propTypes(opts, {
		name: {
			type: 'string',
			required: true,
			empty: false
		},
		options: 'object',
		load: 'function',
		methods: [
			'object', 'array'
		]
	});

	console.log('B7 log info =>', namespace, props.name, window[namespace][props.name]);

	if (isObject(window[namespace])
		&& isFunction(window[namespace][props.name])) {
		window[namespace][props.name]((Plugin) => {
			console.log('B8 Plugin =>', Plugin);

			new Plugin(props.options).init((instance) => {
				console.log('B9 Plugin init callback');
				console.log('B9.0 Props.load =>', props.load);

				if (isFunction(props.load)) {
					console.log('B9.1 Props load function =>', props.load);
					console.log('B9.2 Plugin load instance =>', instance);
					props.load(instance);
				}

				if (isObject(props.methods)) {
					console.log('B10 Init methods object =>', instance, props.methods);
					initMethod(instance, props.methods);
				} else if (isArray(props.methods)) {
					console.log('B11 Init methods array =>', instance, props.methods);

					props.methods.forEach(method => {
						if (isObject(method)) {
							initMethod(instance, method);
						}
					});
				}
			});
		});
	} else {
		console.error(`Plugin "${props.name}" is not regiested`);
	}
}

function load(options) {
	let platform = 'auto';
	const jsonPromises = [];
	const resources = [];
	const props = propTypes(options, {
		locale: {
			type: 'string',
			empty: false,
			default: 'vi'
		},
		platform: {
			type: 'string',
			values: ['desktop', 'tablet', 'mobile', 'auto'],
			default: 'auto'
		},
		plugins: {
			type: [
				'object',
				'array'
			],
			required: true,
			empty: false
		}
	});

	if (props.platform === 'auto') {
		platform = deviceDetector().device;
	} else {
		platform = props.platform;
	}

	window[namespace].locale = props.locale;
	window[namespace].platform = platform;

	if (isObject(props.plugins)) {
		jsonPromises.push(fetchJSONFile(`${publicUrl}${props.plugins.name}/app.json`));
	} else if (isArray(props.plugins) && !isEmpty(props.plugins)) {
		props.plugins.forEach(plugin => {
			if (isObject(plugin)) {
				jsonPromises.push(fetchJSONFile(`${publicUrl}${plugin.name}/app.json`));
			}
		});
	}

	console.log('B4 jsonPromises =>', jsonPromises);

	Promise.all(jsonPromises).then(apps => {
		if (isObject(props.plugins)) {
			resources.push({
				name: `window.${namespace}.${props.plugins.name}`,
				url: `${apps[0].publicUrl || publicUrl}${apps[0].name || props.plugins.name}/main.js?v=${apps[0].version || version}`
			});
		} else if (isArray(props.plugins) && !isEmpty(props.plugins)) {
			props.plugins.forEach((plugin, idx) => {
				if (isObject(plugin)) {
					resources.push({
						name: `window.${namespace}.${plugin.name}`,
						url: `${apps[idx].publicUrl || publicUrl}${apps[idx].name || plugin.name}/main.js?v=${apps[idx].version || version}`
					});
				}
			});
		}

		console.log('B5 load resources =>', resources);
	
		loadResources(resources)
			.then(() => {
				if (isObject(props.plugins)) {
					initPlugin(props.plugins);
				} else if (isArray(props.plugins) && !isEmpty(props.plugins)) {
					props.plugins.forEach(plugin => {
						if (isObject(plugin)) {
							initPlugin(plugin);
						}
					});
				}
			});
	});
}

if (!isObject(window[namespace])) {
	window[namespace] = {};
}

window[namespace].init = (opts) => {
	console.log('B3 window[namespace] init params =>', opts);

	if (isArray(opts)) {
		opts.forEach(opt => load(opt));
	} else if (isObject(opts)) {
		load(opts);
	}
};