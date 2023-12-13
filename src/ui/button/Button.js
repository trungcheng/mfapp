import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class Button extends Component {
	static displayName = 'Button';
	
	static propTypes = {
		children: PropTypes.any,
		icon: PropTypes.any,
		type: PropTypes.oneOf([
			'default',
			'primary',
			'success',
			'info',
			'warning',
			'danger'
		]),
		size: PropTypes.oneOf([
			'default',
			'medium',
			'small',
			'mini'
		]),
		disabled: PropTypes.bool,
		outline: PropTypes.bool,
		bold: PropTypes.bool,
		width: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		height: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		borderColor: PropTypes.string,
		bgColor: PropTypes.string,
		textColor: PropTypes.string,
		radius: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		style: PropTypes.object,
		onClick: PropTypes.func
	}

	static defaultProps = {
		children: null,
		icon: null,
		type: 'default',
		size: 'default',
		disabled: false,
		outline: false,
		bold: false,
		width: null,
		height: null,
		borderColor: null,
		bgColor: null,
		textColor: null,
		radius: null,
		onClick() {}
	}

	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		const { disabled, onClick } = this.props;

		if (!disabled) {
			onClick(e);
		}
	}

	getClasses() {
		const { type, size, disabled, outline } = this.props;
		const classes = [
			`button-${type}`,
			`size-${size}`
		];

		if (disabled) {
			classes.push('is-disabled');
		}

		if (outline) {
			classes.push('is-outline');
		}

		return classes.join(' ');
	}

	render() {
		const {
			children,
			width,
			height,
			borderColor,
			bgColor,
			textColor,
			radius,
			bold,
			icon,
			style
		} = this.props;

		return (
			<button
				styleName={`ui-button ${this.getClasses()}`}
				style={{
					width,
					height,
					borderColor,
					backgroundColor: bgColor,
					color: textColor,
					borderRadius: radius,
					fontWeight: bold ? 'bold': 'normal',
					...style
				}}
				onClick={this.handleClick}
			>
				{ icon && <div styleName="button-icon">{ icon } </div> }
				{ children }
			</button>
		);
	}
}

export default Button;