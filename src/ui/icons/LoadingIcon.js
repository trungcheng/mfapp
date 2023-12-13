import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hexToRgb } from 'coreutils-js';
import styled from '@emotion/styled';

import './loading-icon.scss';

class LoadingIcon extends Component {
	static propTypes = {
		icon: PropTypes.oneOf([
			'spinner',
			'ellipsis',
			'ring'
		]),
		size: PropTypes.number,
		color: PropTypes.string,
		strokeWidth: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		onClick: PropTypes.func
	}

	static defaultProps = {
		icon: 'ring',
		size: 13,
		color: '#EB5757',
		strokeWidth: null,
		onClick() {}
	}

	constructor(props) {
		super(props);

		this.renderIcon = this.renderIcon.bind(this);
		this.iconSpinner = this.iconSpinner.bind(this);
		this.iconEllipsis = this.iconEllipsis.bind(this);
		this.iconRing = this.iconRing.bind(this);
	}

	iconSpinner() {
		const { color, size } = this.props;
		const styleIcon = {
			margin: (size - 64) / 2,
			transform: `scale(${size / 64})`
		};
		const Item = styled.div({
			'&::after': {
				background: color ? `${color} !important` : null
			}
		});


		return (
			<div styleName="icon-spinner" style={styleIcon}>
				<Item />
				<Item />
				<Item />
				<Item />
				<Item />
				<Item />
				<Item />
				<Item />
				<Item />
				<Item />
				<Item />
				<Item />
			</div>
		);
	}

	iconEllipsis() {
		const { color, size } = this.props;
		const styleItem = {
			background: color,
			width: size,
			height: size
		};

		return (
			<div styleName="icon-ellipsis"
				style={{
					height: size
				}}
			>
				<div styleName="item-1" style={styleItem}></div>
				<div styleName="item-2" style={styleItem}></div>
				<div styleName="item-3" style={styleItem}></div>
			</div>
		);
	}

	iconRing() {
		const { color, size, strokeWidth } = this.props;
		const styleIcon = {
			borderColor: hexToRgb(color, 0.2),
			borderLeftColor: color,
			width: size,
			height: size,
			borderWidth: strokeWidth ? strokeWidth : size / 10
		};

		return <div styleName="icon-ring" style={styleIcon}></div>;
	}

	renderIcon() {
		const { icon } = this.props;

		switch(icon) {
			case 'spinner':
				return this.iconSpinner();
			case 'ellipsis':
				return this.iconEllipsis();
			case 'ring':
				return this.iconRing();
			default:
				return this.iconRing();
		}
	}

	render() {
		return (
			<div styleName="ui-icon">
				{ this.renderIcon() }
			</div>
		);
	}
}

export default LoadingIcon;