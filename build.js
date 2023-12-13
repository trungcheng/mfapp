const build = require('./scripts/index.js');
const loadConfig = require('./load-config');
const pluginConfig = require('./plugin.config');

build(loadConfig(pluginConfig));