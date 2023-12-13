import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isObject } from 'coreutils-js';

import './picker.scss?global';
import './style.scss';

class SolidColor extends Component {
    static propTypes = {
		color: PropTypes.any,
		popoverWidth: PropTypes.number,
		onChange: PropTypes.func,
		onChangeComplete: PropTypes.func,
		top: PropTypes.number,
		left: PropTypes.number
	}

    constructor(props) {
        super(props);

        this.state = {
            canvasSaturationEL: null,
            canvasEl: null,
            canvasTransparentEl: null,

            canvasSaturationCtx: null,
            canvasCtx: null,
            canvasTransparentCtx: null,

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

        let canvasSaturationEL = document.getElementById('color-saturation');
        let canvasSaturationCtx = canvasSaturationEL.getContext('2d');

        let canvasEl = document.getElementById('color-hue');
        let canvasCtx = canvasEl.getContext('2d');

        let canvasTransparentEL = document.getElementById('color-transparent');
        let canvasTransparentCtx = canvasTransparentEL.getContext('2d');

        this.setState({
            canvasEl,
            canvasCtx,
            canvasSaturationEL,
            canvasSaturationCtx,
            canvasTransparentEL,
            canvasTransparentCtx
        }, () => {
            this.buildColorSaturation();
            this.buildColorHue();
            this.buildColorTransparent();
        });
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
    
    buildColorSaturation = () => {
        const { canvasSaturationEL, canvasSaturationCtx } = this.state;

        let hue = '360';

        let grH = canvasSaturationCtx.createLinearGradient(0, 0, canvasSaturationCtx.canvas.width, 0);
        grH.addColorStop(0, '#fff');
        grH.addColorStop(1, 'hsl(' + hue + ', 100%, 50%)');

        canvasSaturationCtx.fillStyle = grH;
        canvasSaturationCtx.fillRect(0, 0, canvasSaturationCtx.canvas.width, canvasSaturationCtx.canvas.height);

        let grV = canvasSaturationCtx.createLinearGradient(0, 0, 0, canvasSaturationCtx.canvas.height);
        grV.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grV.addColorStop(1, '#000');

        canvasSaturationCtx.fillStyle = grV;
        canvasSaturationCtx.fillRect(0, 0, canvasSaturationCtx.canvas.width, canvasSaturationCtx.canvas.height);
    }

    buildColorHue = () => {
        const { canvasEl, canvasCtx } = this.state;

        let gradient = canvasCtx.createLinearGradient(0, 0, 0, canvasEl.height);
        // Create color gradient
        gradient.addColorStop(0, "rgb(255, 0, 0)");
        gradient.addColorStop(0.15, "rgb(255, 0, 255)");
        gradient.addColorStop(0.33, "rgb(0, 0, 255)");
        gradient.addColorStop(0.49, "rgb(0, 255, 255)");
        gradient.addColorStop(0.67, "rgb(0, 255, 0)");
        gradient.addColorStop(0.84, "rgb(255, 255, 0)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        // Apply gradient to canvas
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

        // Create semi transparent gradient (white -> trans. -> black)
        // gradient = canvasCtx.createLinearGradient(0, 0, canvasEl.width, 0);
        // gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        // gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        // gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        // gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
        // // Apply gradient to canvas
        // canvasCtx.fillStyle = gradient;
        // canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

        // canvasEl.mousedown(function (e) {
        //     // Track mouse movement on the canvas if the mouse button is down
        //     $(document).mousemove(function (e) {
        //         app.colorEventX = e.pageX - ms.$colors.offset().left;
        //         app.colorEventY = e.pageY - ms.$colors.offset().top;
        //     });

        //     // Get the color at the current mouse coordinates
        //     app.colorTimer = setInterval(app.getColor, 50);
        // })
        //     // On mouseup, clear the interval and unbind the mousemove event,
        //     // it should only happen if the button is down
        //     .mouseup(function (e) {
        //         clearInterval(ms.colorTimer);
        //         $(document).unbind('mousemove');
        //     });
        canvasEl.onclick = function (mouseEvent) {
            let imgData = canvasCtx.getImageData(mouseEvent.offsetX, mouseEvent.offsetY, 1, 1);
            let rgba = imgData.data;

            console.log("rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ", " + rgba[3] + ")");
        }
    }

    buildColorTransparent = () => {
        const { canvasTransparentEL, canvasTransparentCtx } = this.state;

        let gradient = canvasTransparentCtx.createLinearGradient(0, 0, 0, canvasTransparentCtx.canvas.height);
        gradient.addColorStop(0, "rgba(235, 87, 87, 0)");
        gradient.addColorStop(0.5, "#eb5757");
        gradient.addColorStop(1, "#eb5757");

        canvasTransparentCtx.fillStyle = gradient;
        canvasTransparentCtx.fillRect(0, 0, canvasTransparentCtx.canvas.width, canvasTransparentCtx.canvas.height);
    }

    getColor = (e) => {
        let imageData = canvasCtx.getImageData(colorEventX, colorEventY, 1, 1);

        return 'rgb(' + imageData.data[4] + ', ' + imageData.data[5] + ', ' + imageData.data[6] + ')';
    }

    render() {
        const { color, popoverWidth } = this.props;
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
                        background: '#222222',
                        width: 206,
                        padding: 15,
                        borderRadius: 2,
                        color: '#fff',
                        display: isShow ? 'block' : 'none',
                        ...position
                    }}
                >
                    <p style={{marginBottom: 5}}>Solid Color</p>
                    <canvas id="color-saturation" width="140" height="140"></canvas>
                    <canvas style={{marginLeft:8}} id="color-hue" width="10" height="140"></canvas>
                    <canvas style={{marginLeft:8}} id="color-transparent" width="10" height="140"></canvas>
                    {/* <SketchPicker
						color={isObject(color) ? color : ''}
						disableAlpha={disableAlpha}
						// presetColors={presetColors}
						presetColors={['TRANSPARENT','#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']}
						popoverWidth={popoverWidth}
						onChange={this.handleChange}
						onChangeComplete={this.handleChangeComplete}
					/> */}
                </div>
            </div>
        );
    }
}

export default SolidColor;