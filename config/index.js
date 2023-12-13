const { isObject } = require('coreutils-js');

const env = process.env.NODE_ENV;
const version = process.env.VERSION;
const name = process.env.NAME;

let config = {};

function mergeDeep(target, ...sources) {
	if (!sources.length) return target;

	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });

				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}

try {
	config = mergeDeep(config, require(`./env/${env}.js`));
} catch(err) {
	console.warn(err);
}

if (!Object.keys(config).length) {
	console.error('Cannot load config');
	process.exit(1);
}

config.env = env;
config.version = version;
config.name = name;

module.exports = config;