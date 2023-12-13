const { isFunction } = require('coreutils-js');

class API {
	constructor(props) {
		this.props = props;
	}

	createInstance(baseURL, createInstanceFunction) {
		if (isFunction(createInstanceFunction)) {
			return createInstanceFunction.apply(this, [ baseURL, this.props ]);
		} else {
			return null;
		}
	}
}

export default API;