import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'coreutils-js';

import './style.scss';

import { FontAwesome } from '../icons';

class MenuItem extends Component {
	static propTypes = {
		icon: PropTypes.string,
		onSelect: PropTypes.func,
		divider: PropTypes.bool,
		useIcon: PropTypes.bool,
		color: PropTypes.string,
		visible: PropTypes.bool,
		disabled: PropTypes.bool
	}

	static defaultProps = {
		divider: false,
		useIcon: false,
		visible: true,
		disabled: false
	}

	constructor(props) {
		super(props);

		this.handleSelect = this.handleSelect.bind(this);
	}

	handleSelect() {
		const { onSelect } = this.props;

		if (isFunction(onSelect)) onSelect();
	}

	render() {
		const {
			children,
			icon,
			divider,
			useIcon,
			color,
			visible,
			disabled
		} = this.props;

		if (!visible) {
			return '';
		}

		if (divider) {
			return (
				<p styleName="menu-divider"></p>
			);
		}

		return (
			<div styleName={`menu-item ${disabled ? 'disabled' : ''}`}
				onClick={this.handleSelect}
				style={{
					color
				}}
			>
				{
					useIcon ?
						<div styleName="item-icon">
							<FontAwesome icon={icon} />
						</div>
						: ''
				}

				<div styleName="item-text">
					{ children }
				</div>
			</div>
		);
	}
}

export default MenuItem;