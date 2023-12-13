/* eslint-disable max-lines-per-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import checkInput from './check-input';
import typeCheckingFunc from './type-checking';
import { numberParse, isEmpty } from 'coreutils-js';

import './style.scss';

class Input extends Component {
	static propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		type: PropTypes.oneOf([
			'number',
			'text',
			'textarea',
			'password',
			'checkbox'
		]),
		height: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		width: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		validator: PropTypes.oneOfType([
			PropTypes.string,

		]),
		min: PropTypes.number,
		max: PropTypes.number,
		readOnly: PropTypes.bool,
		placeholder: PropTypes.string,
		style: PropTypes.object,
		maxLength: PropTypes.number,
		typeChecking: PropTypes.any,
		onChange: PropTypes.func,
		onEnter: PropTypes.func,
		autoComplete: PropTypes.bool
	}

	static defaultProps = {
		value: null,
		type: 'text',
		height: 30,
		width: '100%',
		placeholder: '',
		style: {},
		maxLength: null,
		onChange() {},
		onEnter() {},
		readOnly: false,
		autoComplete: true
	}

	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {
		const { value } = this.props;

		if (value !== nextProps.value && this.refInput) {
			this.refInput.value = nextProps.value;
		}
	}

	handleChangeText = (e) => {
		const {
			onChange,
			maxLength,
			value
		} = this.props;
		let newValue = e.target.value;

		newValue = checkInput.maxLength(newValue, value, maxLength);

		onChange(newValue);
	}

	handleChangeNumber = (e) => {
		const {
			onChange,
			maxLength,
			min,
			max,
			value
		} = this.props;
		let newValue = e.target.value;
		
		if (!isEmpty(newValue) && !isNaN(newValue)) {
			newValue = checkInput.number(newValue, value);
			newValue = checkInput.maxLength(newValue, value, maxLength);
			newValue = checkInput.numberMin(newValue, value, min);
			newValue = checkInput.numberMax(newValue, value, max);

			e.target.value = numberParse(newValue, 0);

			onChange(numberParse(newValue, 0));
		}
	}

	handleBlurNumber = (e) => {
		const {
			onChange,
			maxLength,
			min,
			max,
			value
		} = this.props;
		let newValue = e.target.value;
		
		if (!isEmpty(newValue) && !isNaN(newValue)) {
			newValue = checkInput.number(newValue, value);
			newValue = checkInput.maxLength(newValue, value, maxLength);
			newValue = checkInput.numberMin(newValue, value, min);
			newValue = checkInput.numberMax(newValue, value, max);

			e.target.value = numberParse(newValue, 0);
			onChange(numberParse(newValue, 0));
		} else {
			e.target.value = numberParse(value, 0);
			onChange(numberParse(value, 0));
		}
	}

	handleChange = (e) => {
		const { typeChecking, type } = this.props;

		if (typeCheckingFunc(e, typeChecking)) {
			switch(type) {
				case 'text':
					this.handleChangeText(e);
					break;
				case 'number':
					this.handleChangeNumber(e);
					break;
				default:
					this.handleChangeText(e);
					break;
			}
		}
	}

	handleBlur = (e) => {
		const { typeChecking, type } = this.props;

		if (typeCheckingFunc(e, typeChecking)) {
			switch(type) {
				case 'number':
					this.handleBlurNumber(e);
					break;
			}
		}
	}

	handleKeyPress = (e) => {
		const { onEnter } = this.props;

		if (e.which === 13) {
			onEnter();
		}
	}

	render() {
		const {
			value,
			type,
			width,
			height,
			placeholder,
			style,
			min,
			max,
			readOnly,
			autoComplete
		} = this.props;

		return (
			<div styleName="ui-input"
				style={{
					width,
					height
				}}
			>
				{
					type === 'textarea' ?
						readOnly ?
							<textarea
								ref={c => this.refInput = c}
								placeholder={placeholder}
								value={value}
								// onChange={this.handleChange}
								// onKeyPress={this.handleKeyPress}
								readOnly={true}
								style={{
									width,
									minWidth: width,
									maxWidth: width,
									height,
									minHeight: height,
									...style
								}}
							/>
							:
							<textarea
								ref={c => this.refInput = c}
								placeholder={placeholder}
								value={value}
								onChange={this.handleChange}
								onKeyPress={this.handleKeyPress}
								style={{
									width,
									minWidth: width,
									maxWidth: width,
									height,
									minHeight: height,
									...style
								}}
							/>
						:
						readOnly ?
							<input
								ref={c => this.refInput = c}
								type={type}
								placeholder={placeholder}
								defaultValue={value}
								min={min}
								max={max}
								// onChange={this.handleChange}
								// onKeyPress={this.handleKeyPress}
								// onBlur={this.handleBlur}
								readOnly={true}
								style={{
									width,
									height,
									...style
								}}
								autoComplete={autoComplete ? '' : 'false'}
							/>
							:
							<input
								ref={c => this.refInput = c}
								type={type}
								placeholder={placeholder}
								defaultValue={value}
								min={min}
								max={max}
								onChange={this.handleChange}
								onKeyPress={this.handleKeyPress}
								onBlur={this.handleBlur}
								style={{
									width,
									height,
									...style
								}}
								autoComplete={autoComplete ? '' : 'false'}
							/>
				}
			</div>
		);
	}
}

export default Input;