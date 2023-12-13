import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isFunction } from 'coreutils-js';

import './style.scss';

import Tooltip from '../tooltip';

class Slider extends Component {
	static propTypes = {
		value: PropTypes.number,
		max: PropTypes.number,
		min: PropTypes.number,
		step: PropTypes.number,
		label: PropTypes.string,
		colorBar: PropTypes.string,
		colorSelection: PropTypes.string,
		colorButton: PropTypes.string,
		barHeight: PropTypes.number,
		barWidth: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		buttonRadius: PropTypes.number,
		onChange: PropTypes.func
	}

	static defaultProps = {
		value: 0,
		min: 0,
		max: 100,
		step: 1,
		label: '',
		colorBar: '#ddd',
		colorSelection: '#2ea2c7',
		colorButton: '#2ea2c7',
		barHeight: 3,
		barWidth: '100%',
		buttonRadius: 10,
		onChange() {}
	}

	constructor() {
		super();

		this.state = {
			isChanging: false,
			currentX: 0
		};

		this.calculatePosition = this.calculatePosition.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.eventMouseUp = this.eventMouseUp.bind(this);
		this.eventMouseMove = this.eventMouseMove.bind(this);
	}

	componentDidMount() {
		window.addEventListener('mouseup', this.eventMouseUp);
		window.addEventListener('mousemove', this.eventMouseMove);
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.eventMouseUp);
		window.removeEventListener('mousemove', this.eventMouseMove);
	}

	eventMouseUp(e) {
		this.handleChange(e, 'finish');
	}

	eventMouseMove(e) {
		this.handleChange(e, 'move');
	}

	calculatePosition() {
		const { value, max, min } = this.props;

		return `${((value - min) / (max - min)) * 100}%`;
	}

	handleChange(e, status) {
		const { min, max, value, step, onChange,  } = this.props;

		if (status === 'start') {
			this.setState({
				isChanging: true,
				startX: e.clientX,
				startValue: value
			});
		} else if (status === 'move') {
			if (this.state.isChanging) {
				const posVal = e.clientX - this.state.startX;
				const stepVal = Math.ceil(((posVal * max) / this.refBar.offsetWidth) / step) * step;
				let val = this.state.startValue + stepVal;

				if (val < min) val = min;

				if (val > max) val = max;

				if (isFunction(onChange)) {
					onChange(val);
				}
			}
		} else {
			this.setState({
				isChanging: false
			});
		}
	}

	handleClick = (e) => {
		const { min, max, step, onChange,  } = this.props;

		if (this.refBar) {
			const posVal = e.clientX - this.refBar.getBoundingClientRect().x;
			const stepVal = Math.ceil(((posVal * max) / this.refBar.offsetWidth) / step) * step;
			let val = stepVal;

			if (val < min) val = min;

			if (val > max) val = max;

			if (isFunction(onChange)) {
				onChange(val);
			}
		}
	}

	render() {
		const {
			label,
			colorBar,
			colorSelection,
			colorButton,
			barHeight,
			buttonRadius,
			barWidth
		} = this.props;
		const styleSlider = {
			height: buttonRadius * 2,
			width: barWidth
		};
		const styleBase = {
			backgroundColor: colorBar,
			height: barHeight,
			width: '100%'
		};
		const styleBar = {
			backgroundColor: colorBar,
			height: barHeight,
			width: `calc(100% - ${buttonRadius * 2}px)`
		};
		const styleSelection = {
			backgroundColor: colorSelection,
			height: barHeight,
			width: this.calculatePosition()
		};
		const styleButton = {
			backgroundColor: colorButton,
			width: buttonRadius * 2,
			height: buttonRadius * 2,
			top: -(buttonRadius - 1),
			left: this.calculatePosition()
		};

		return (
			<div styleName="ui-slider" style={styleSlider}>
				<div style={styleBase}>
					<div styleName="slider-bar"
						style={styleBar}
						ref={c => this.refBar = c}
						onClick={(e) => this.handleClick(e)}
					>
						<div style={styleSelection}></div>
						<Tooltip content={label} position="top" visible={!isEmpty(label)}>
							<button
								styleName="slider-button"
								style={styleButton}
								onMouseDown={(e) => this.handleChange(e, 'start')}
							/>
						</Tooltip>
					</div>
				</div>
			</div>
		);
	}
}

export default Slider;