import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isUndefined } from 'coreutils-js';

import './style.scss';

import Input from './Input';

class InputGroup extends Component {
	static propTypes = {
		prepend: PropTypes.any,
		preBgColor: PropTypes.string,
		preBorder: PropTypes.bool,
		preColor: PropTypes.string,
		append: PropTypes.any,
		apBgColor: PropTypes.string,
		apBorder: PropTypes.bool,
		apColor: PropTypes.string,
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		min: PropTypes.number,
		max: PropTypes.number,
		type: PropTypes.oneOf([
			'number', 'text', 'password'
		]),
		height: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		width: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		borderRadius: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		style: PropTypes.object,
		placeholder: PropTypes.string,
		autoComplete: PropTypes.bool,
		onChange: PropTypes.func,
		onEnter: PropTypes.func
	}

	static defaultProps = {
		placeholder: '',
		preBgColor: '#eee',
		preBorder: true,
		preColor: '#333',
		apBgColor: '#eee',
		apBorder: true,
		apColor: '#333',
		value: null,
		type: 'text',
		height: 30,
		width: '100%',
		borderRadius: 3,
		style: {},
		autoComplete: true,
		onChange() {},
		onEnter() {}
	}

	constructor(props) {
		super(props);
	}

	render() {
		const {
			prepend,
			preBgColor,
			preBorder,
			preColor,
			append,
			apBgColor,
			apBorder,
			apColor,
			value,
			type,
			height,
			width,
			min,
			max,
			borderRadius,
			style,
			onChange,
			placeholder,
			autoComplete,
			onEnter
		} = this.props;

		return (
			<div styleName="ui-input-group" style={{
				height,
				width,
				borderRadius,
				...style
			}}>
				{
					!isUndefined(prepend) ?
						<div styleName="group-prepend" style={{
							backgroundColor: preBgColor,
							borderRight: preBorder ? '1px solid #ddd' : '',
							color: preColor 
						}}>
							{ prepend }
						</div>
						: null
				}

				<Input
					value={value}
					type={type}
					height="100%"
					width="100%"
					min={min}
					max={max}
					placeholder={placeholder}
					autoComplete={autoComplete}
					onChange={onChange}
					onEnter={onEnter}
				/>

				{
					!isUndefined(append) ?
						<div styleName="group-append" style={{
							backgroundColor: apBgColor,
							borderLeft: apBorder ? '1px solid #ddd' : '',
							color: apColor 
						}}>
							{ append }
						</div>
						: null
				}
			</div>
		);
	}
}

export default InputGroup;