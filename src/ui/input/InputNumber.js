import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

class InputNumber extends Component {
	static propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		height: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		width: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		placeholder: PropTypes.string,
		style: PropTypes.object,
		maxLength: PropTypes.number,
		min: PropTypes.number,
		max: PropTypes.number,
		onChange: PropTypes.func,
		onEnter: PropTypes.func
	}

	static defaultProps = {
		value: null,
		height: 30,
		width: '100%',
		placeholder: '',
		style: {},
		maxLength: null,
		onChange() {},
		onEnter() {}
	}

	constructor(props) {
		super(props);
	}

	render() {
		const {
			value,
			width,
			height,
			placeholder,
			style,
			onChange,
			maxLength,
			min,
			max,
			onEnter
		} = this.props;

		return (
			<Input
				type="number"
				value={value}
				width={width}
				height={height}
				placeholder={placeholder}
				style={style}
				onChange={onChange}
				maxLength={maxLength}
				min={min}
				max={max}
				onEnter={onEnter}
			/>
		);
	}
}

export default InputNumber;