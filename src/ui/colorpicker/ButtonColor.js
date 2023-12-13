import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import PropTypes from 'prop-types';
import { isFunction, isObject } from 'coreutils-js';

import './picker.scss?global';
import './style.scss';

class ButtonColor extends Component {
	static propTypes = {
		color: PropTypes.any,
		disableAlpha: PropTypes.bool,
		presetColors: PropTypes.array,
		popoverWidth: PropTypes.number,
		onChange: PropTypes.func,
		onChangeComplete: PropTypes.func,
		top: PropTypes.number,
		left: PropTypes.number
	}
	
	constructor(props) {
		super(props);

		this.state = {
			isShow: false,
			position: {}
		};

		this.handleShow = this.handleShow.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeComplete = this.handleChangeComplete.bind(this);
		this.eventClick = this.eventClick.bind(this);
	}

	componentDidMount() {
		window.addEventListener('click', this.eventClick);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.eventClick);
	}

	eventClick(e) {
		if (!this.refButton.contains(e.target) &&
			!this.refPopover.contains(e.target)) {
			this.setState({
				isShow: false
			});
		}
	}

	handleShow = () => {
		const rect = this.refButton.getBoundingClientRect();
		const top = this.props.top ? this.props.top : 0;
		const left = this.props.left ? this.props.left : 0;
		this.setState({
			isShow: !this.state.isShow,
			position: {
				top: rect.top + rect.height + 2 + top,
				left: rect.left + 1 + left
			}
		});
	}

	handleChange(color, e) {
		const { onChange } = this.props;

		if (isFunction(onChange)) {
			onChange(color, e);
		}
	}

	handleChangeComplete(color, e) {
		const { onChangeComplete } = this.props;

		if (isFunction(onChangeComplete)) {
			onChangeComplete(color, e);
		}
	}

	render() {
		const { color, disableAlpha, presetColors, popoverWidth } = this.props;
		const { isShow, position } = this.state;
		let styleColor = '';

		if (isObject(color) && isObject(color.rgb)) {
			styleColor = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
		} else {
			styleColor = color;
		}

		return (
			<div styleName="ui-color button-color">
				<button
					ref={c => this.refButton = c}
					styleName="button-picker"
					onClick={this.handleShow}
				>
					<div styleName="button-preview">
						<div
							styleName="button-color"
							style={{
								backgroundColor: styleColor
							}}
						/>
					</div>
				</button>

				<div
					ref={c => this.refPopover = c}
					styleName="button-popover"
					style={{
						display: isShow ? 'block' : 'none',
						...position
					}}
				>
					<SketchPicker
						color={isObject(color) ? color : ''}
						disableAlpha={disableAlpha}
						// presetColors={presetColors}
						presetColors={['TRANSPARENT','#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']}
						popoverWidth={popoverWidth}
						onChange={this.handleChange}
						onChangeComplete={this.handleChangeComplete}
					/>
				</div>
			</div>
		);
	}
}

export default ButtonColor;