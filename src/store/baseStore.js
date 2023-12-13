const { extendObservable, action  } = require('mobx');
const { isObject, isString, isDefined } = require('coreutils-js');

class Store {
	constructor(props) {
		if (isObject(props)) {
			this.set(props);
		}
	}

	@action
	set(arg1, arg2) {
		const setVar = (key, value) => {
			if (isDefined(value)) {
				if (isDefined(this[key])) {
					this[key] = value;
				} else {
					extendObservable(this, {
						[key]: value
					});
				}
			}
		};

		if (isString(arg1) && isDefined(arg2)) {
			setVar(arg1, arg2);
		} else if (isObject(arg1)) {
			Object.keys(arg1).forEach(key => {
				setVar(key, arg1[key]);
			});
		}
	}
}

export default Store;