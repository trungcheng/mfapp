import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

class Textarea extends Component {
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
		readOnly: PropTypes.bool,
		placeholder: PropTypes.string,
		style: PropTypes.object,
		maxLength: PropTypes.number,
		onChange: PropTypes.func
	}

	static defaultProps = {
		value: '',
		height: 180,
		width: '100%',
		placeholder: '',
		style: {},
		maxLength: null,
		onChange() {},
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
			readOnly
		} = this.props;

		return (
			<Input
				type="textarea"
				value={value}
				width={width}
				height={height}
				placeholder={placeholder}
				style={style}
				onChange={onChange}
				maxLength={maxLength}
				readOnly={readOnly}
			/>
		);
	}
}

export default Textarea;