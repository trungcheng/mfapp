/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const {
	uuid,
	isFunction,
	isObject,
	isPromise,
	isArray,
	isString,
	propTypes,
	loadResources
} = require('coreutils-js');
const { namespace, version, time } = coreConfig;

function invokeLoadHandle(loadHandleArr, errorHandleArr, callback, ...args) {
	try {
		if (isFunction(loadHandleArr[0])) {
			console.log('Invoke 0 is function loadHandleArr');
			console.log('Invoke 1 loadHandleArr[0] Hàm load() =>', loadHandleArr[0]);
			console.log('Invoke 2 loadHandleArr[1] self =>', loadHandleArr[1]);

			const result = loadHandleArr[0].call(loadHandleArr[1], ...args);

			console.log('Invoke 3 result =>', result);

			if (isPromise(result)) {
				console.log('Invoke 4 is promise result');

				result
					.then((...margs) => {
						if (isFunction(callback)) callback(...args, ...margs);
					})
					.catch(err => {
						console.error(err);
						if (isFunction(errorHandleArr[0])) errorHandleArr[0].call(errorHandleArr[1], err, ...args);
					});
			} else if (isObject(result)) {
				console.log('Invoke 5 is object result');

				if (isFunction(callback)) callback(...args, result);
			} else {
				console.log('Invoke 6 is promise result');

				if (isFunction(callback)) callback(...args);
			}
		} else if (isObject(loadHandleArr[0])) {
			console.log('Invoke 7 is object loadHandleArr');

			if (isFunction(callback)) callback(loadHandleArr[0]);
		} else {
			console.log('Invoke 8');

			if (isFunction(callback)) callback();
		}
	} catch (err) {
		console.error(err);
		if (isFunction(errorHandleArr[0])) errorHandleArr[0].call(errorHandleArr[1], err, ...args);
	}
}

function createMethod(method, ...args) {
	console.log('Create method params =>', method, ...args);

	return (options, callback) => {
		console.log('Create method function is running =>', options, callback);

		const props = propTypes(options, method.props);
		const pluginSelf = {
			id: this.id,
			props: this.props,
			platform: this.platform,
			data: this.data,
			instance: this.instance
		};
		const methodSelf = {
			props,
			platform: this.platform,
			$id: this.id,
			$props: this.props,
			$data: this.data,
			$instance: this.instance
		};

		if (isFunction(method.data)) {
			let data = method.data.call(methodSelf);

			if (!isObject(data)) {
				data = {};
			}

			methodSelf.data = data;
		}

		methodSelf.load = (...args) => {
			if (isFunction(callback)) callback(this.instance, ...args);
		};

		console.log('Create method vao day 1');

		// Gọi hàm beforeLoad
		invokeLoadHandle(
			[method.beforeLoad, methodSelf],
			[method.error, methodSelf],
			(...beforeLoadArgs) => {
				console.log('Create method vao day 2 method.resources =>', method);
				// Load resources
				loadResources(method.resources, { v: version, t: time })
					.then(() => {
						console.log('Create method vao day 3 this.loadMethod =>', this.loadMethod);
						// Gọi hàm loadMethod
						if (this.loadMethod) {
							invokeLoadHandle(
								[this.loadMethod, pluginSelf],
								[method.error, methodSelf],
								(...loadMethodArgs) => {
									invokeLoadHandle(
										[method.load, methodSelf],
										[method.error, methodSelf],
										null,
										...loadMethodArgs
									);
								},
								...beforeLoadArgs,
								...args
							);
						} else {
							invokeLoadHandle(
								[method.load, methodSelf],
								[method.error, methodSelf],
								null,
								...beforeLoadArgs,
								...args
							);
						}
					});
			},
			...args
		);
	};
}

function createUtil(util, ...args) {
	return function (options) {
		const props = propTypes(options, util.props);
		let data = {};

		if (isFunction(util.data)) {
			data = util.data.call({
				props,
				platform: this.platform,
				$id: this.id,
				$props: this.props,
				$data: this.data,
				$instance: this.instance
			});

			if (!isObject(data)) {
				data = {};
			}
		}

		return util.load.call({
			data,
			props,
			platform: this.platform,
			$id: this.id,
			$props: this.props,
			$data: this.data,
			$instance: this.instance
		}, ...args);
	};
}

function createPlugin(plugin) {
	return class {
		constructor(props) {
			this.props = propTypes(props, plugin.props);
			this.id = uuid();
			this.data = {};
			this.resources = plugin.resources;
			this.load = plugin.load;
			this.error = plugin.error;
			this.methods = isObject(plugin.methods) ? plugin.methods : {};
			this.utils = isObject(plugin.utils) ? plugin.utils : {};
			this.platform = plugin.platform;
			this.loadMethod = plugin.loadMethod;
			this.instance = {
				id: this.id,
				props: this.props
			};
			this.onLoad = isFunction(plugin.onLoad) ? plugin.onLoad : () => { };

			if (isFunction(plugin.data)) {
				const data = plugin.data.call({
					platform: this.platform,
					props: this.props
				});

				if (isObject(data)) {
					this.data = data;
				}
			}
		}

		init(callback) {
			const loadMethod = (...args) => {
				console.log('Invoke 4 result running =>', ...args);

				Object.keys(this.methods).forEach(methodName => {
					console.log('Method name =>', methodName);

					let methodActive;

					if (isObject(this.methods[methodName])) {
						console.log('Is object method');

						methodActive = this.methods[methodName];
					} else if (isArray(this.methods[methodName])) {
						console.log('Is array method');

						this.methods[methodName].forEach(method => {
							if (isString(method.platform)) {
								if (method.platform === this.platform) {
									methodActive = method;
								}
							} else if (isArray(method.platform)) {
								if (method.platform.indexOf(this.platform) !== -1) {
									methodActive = method;
								}
							}
						});

						if (!methodActive) {
							methodActive = this.methods[methodName][0];
						}
					}

					if (isObject(methodActive)) {
						console.log('Is object method active =>', this.instance, methodName, methodActive);

						this.instance[methodName] = createMethod.call(
							{
								id: this.id,
								props: this.props,
								platform: this.platform,
								data: this.data,
								loadMethod: this.loadMethod,
								instance: this.instance
							},
							methodActive,
							...args
						);
					}
				});

				Object.keys(this.utils).forEach(utilName => {
					console.log('Util name =>', utilName);

					this.instance[utilName] = createUtil.call(
						{
							id: this.id,
							props: this.props,
							platform: this.platform,
							data: this.data,
							instance: this.instance
						},
						this.utils[utilName],
						...args
					);
				});

				console.log('PLugin init log instance =>', this.instance);

				if (isFunction(callback)) {
					callback(this.instance);
				}
			};
			const self = {
				id: this.id,
				props: this.props,
				platform: this.platform,
				data: this.data,
				instance: this.instance
			};

			loadResources(this.resources, { v: version, t: time })
				.then(() => {
					console.log('Plugin init load call');
					// Gọi hàm load
					invokeLoadHandle(
						[this.load, self],
						[this.error, self],
						loadMethod
					);
				});
		}
	};
}

module.exports = function (options) {
	console.log('Create plugin =>', options);

	return createPlugin({
		platform: window[namespace].platform,
		props: options.props,
		data: options.data,
		load: options.load,
		loadMethod: options.loadMethod,
		error: options.error,
		methods: options.methods,
		utils: options.utils,
		resources: options.resources,
		onLoad: window[namespace].onLoad
	});
};