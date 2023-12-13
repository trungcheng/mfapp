import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isNumber } from 'coreutils-js';

import './style.scss';

class Checkbox extends Component {
	static propTypes = {
		disabled: PropTypes.bool,
		label: PropTypes.string,
		value: PropTypes.any,
		checked: PropTypes.bool,
		boxSize: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		buttonColor: PropTypes.string,
		labelSize: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		labelColor: PropTypes.string,
		labelBold: PropTypes.bool,
		lightTheme: PropTypes.bool,
		onChange: PropTypes.func,
		readOnly: PropTypes.bool
	}

	static defaultProps = {
		disabled: false,
		label: null,
		value: null,
		checked: false,
		boxSize: 20,
		buttonColor: '#fff',
		labelSize: 15,
		labelColor: '#333',
		labelBold: false,
		lightTheme: false,
		onChange() {},
		readOnly: false
	}

	constructor(props) {
		super(props);

		this.state = {
			checked: props.checked
		};

		this.handleChange = this.handleChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const { checked } = this.state;

		if (nextProps.checked !== checked) {
			this.setState({
				checked: nextProps.checked
			});
		}
	}

	handleChange(e) {
		const { readOnly, value, disabled, onChange } = this.props;

		if (readOnly !== true && disabled !== true) {
			const checked = e.target.checked;

			this.setState({
				checked
			}, () => {
				onChange(checked, value);
			});
		}
	}

	render() {
		const { checked } = this.state;
		const {
			label,
			labelSize,
			labelColor,
			boxSize,
			buttonColor,
			disabled,
			labelBold,
			lightTheme
		} = this.props;

		const styleLabel = {
			fontSize: labelSize,
			color: labelColor,
			fontWeight: labelBold ? 'bold': null
		};

		let styleInput = {
			backgroundColor: '#fff',
			borderColor: '#ddd',
			width: boxSize,
			height: boxSize
		};

		let styleInputAfter = {
			borderLeft: `3px solid ${buttonColor}`,
			borderBottom: `3px solid ${buttonColor}`,
			width: `calc(${isNumber(boxSize) ? `${boxSize}px` : boxSize} / 2.5)`,
			height: `calc(${isNumber(boxSize) ? `${boxSize}px` : boxSize} / 5)`,
			left: `calc(${isNumber(boxSize) ? `${boxSize}px` : boxSize} / 5.5)`,
			top: `calc(${isNumber(boxSize) ? `${boxSize}px` : boxSize} / 4.5)`
		};

		if (checked === true) {
			styleInput = {
				...styleInput,
				backgroundColor: lightTheme ? '#5EB75C' : '#EB5757',
				borderColor: lightTheme ? '#5EB75C' : '#EB5757',
				'&::after': styleInputAfter
			};
		}

		if (disabled === true) {
			styleInputAfter = {
				...styleInputAfter,
				borderColor: '#ddd'
			};

			styleInput = {
				...styleInput,
				backgroundColor: '#f0f0f0',
				borderColor: '#ddd',
				'&::after': styleInputAfter
			};
		}

		const CheckboxInput = styled.p(styleInput);

		return (
			<div styleName="ui-checkbox">
				<label styleName="checkbox-container">
					<input type="checkbox"
						checked={checked}
						onChange={this.handleChange}
					/>

					<CheckboxInput styleName="checkbox-input" />

					{
						label ?
							<span styleName="checkbox-label" style={styleLabel}>
								{label}
							</span>
							: null
					}
				</label>
			</div>
		);
	}
}

export default Checkbox;