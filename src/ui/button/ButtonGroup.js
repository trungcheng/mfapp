import { Component, isValidElement } from 'react';
import { isArray, isClass } from 'coreutils-js';

import './style.scss';

class ButtonGroup extends Component {
	constructor(props) {
		super(props);
	}

	renderChildren = () => {
		const { children } = this.props;

		if (isArray(children)) {
			return children.filter(el => {
				if (isValidElement(el) && el.type.displayName === 'Button') {
					return true;
				}

				return false;
			});
		} else if (isValidElement(children) && children.type.displayName === 'Button') {
			return children;
		}

		return null;
	}

	render() {
		return (
			<div styleName="ui-button-group">
				{ this.renderChildren() }
			</div>
		);
	}
}

export default ButtonGroup;