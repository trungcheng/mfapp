import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

class InputText extends Component {
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
		onChange: PropTypes.func,
		onEnter: PropTypes.func,
		readOnly: PropTypes.bool
	}

	static defaultProps = {
		value: null,
		height: 30,
		width: '100%',
		placeholder: '',
		style: {},
		maxLength: null,
		onChange() {},
		onEnter() {},
		readOnly: false
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
			onEnter,
			readOnly
		} = this.props;

		return (
			<Input
				type="text"
				value={value}
				width={width}
				height={height}
				placeholder={placeholder}
				style={style}
				onChange={onChange}
				maxLength={maxLength}
				onEnter={onEnter}
				readOnly={readOnly}
			/>
		);
	}
}

export default InputText;