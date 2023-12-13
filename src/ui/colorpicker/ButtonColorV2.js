import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isObject } from 'coreutils-js';
import { CustomPicker, CirclePicker } from 'react-color';
import { Hue, Saturation, Alpha } from 'react-color/lib/components/common/';

import './picker.scss?global';
import './style.scss';

import DropText from '@media/ui/droptext';
import FontAwesome from '@media/ui/icons/FontAwesome';

class ButtonColorV2 extends Component {
    static propTypes = {
        width: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
        objectSelected: PropTypes.any,
        color: PropTypes.any,
        selectedColorType: PropTypes.string,
        dropTextData: PropTypes.array,
        presetColors: PropTypes.array,
        presetGrandientColors: PropTypes.array,
        popoverWidth: PropTypes.number,
        onChange: PropTypes.func,
        onChangeComplete: PropTypes.func,
		onToggleGradientOption: PropTypes.func,
        sketchPicker: PropTypes.bool,
        style: PropTypes.object
    }

    static defaultProps = {
        width: '100%',
        objectSelected: {},
        color: '#999',
        selectedColorType: 'Solid Color',
        dropTextData: ['Solid Color'],
        presetColors: ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#B8E986', '#000000',
            '#4A4A4A', '#9B9B9B', '#FFFFFF', 'TRANSPARENT'],
        presetGrandientColors: [
            { direction: 'horizontal', from: '#52ACFF', to: '#FFE32C' },
            { direction: 'vertical', from: '#FFE53B', to: '#FF2525' },
            { direction: 'vertical', from: '#FAACA8', to: '#DDD6F3' },
            { direction: 'horizontal', from: '#21D4FD', to: '#B721FF' },
            { direction: 'vertical', from: '#08AEEA', to: '#2AF598' },
            { direction: 'horizontal', from: '#FEE140', to: '#FA709A' },
            { direction: 'vertical', from: '#FF3CAC', to: '#2B86C5' },
            { direction: 'horizontal', from: '#FA8BFF', to: '#2BFF88' },
            { direction: 'vertical', from: '#FFFFFF', to: '#FF3636' },
            { direction: 'horizontal', from: '#F4D03F', to: '#0C3DEC' },
            { direction: 'vertical', from: '#FAACA8', to: '#FA709A' }
        ],
        popoverWidth: 210,
        onChange() { },
        onChangeComplete() { },
		onToggleGradientOption() { },
        sketchPicker: false,
        style: {}
    }

    constructor(props) {
        super(props);

        this.state = {
            isShow: props.sketchPicker ? true : false,
            position: {},
            colorType: this.props.selectedColorType,
            direction: 'horizontal',
            selectedPoint: 'from'
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleChangeSolidColor = this.handleChangeSolidColor.bind(this);
        this.handleChangeSolidColorComplete = this.handleChangeSolidColorComplete.bind(this);
        this.eventClick = this.eventClick.bind(this);
    }

    componentDidMount() {
        window.addEventListener('click', this.eventClick);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.eventClick);
    }

    eventClick(e) {
		const { sketchPicker } = this.props;

		if (
			!sketchPicker &&
			(!this.refButton || !this.refButton.contains(e.target)) &&
            (!this.refPopover || !this.refPopover.contains(e.target)) && 
            (!this.refDropText || !this.refDropText.contains(e.target))
        ) {
            this.setState({
                isShow: false
            });
        }
    }

    handleShow = () => {
		const { sketchPicker } = this.props;

		if (!sketchPicker) {
			const rectButton = this.refButton.getBoundingClientRect();
			const top = this.props.top ? this.props.top : 0;
            const left = this.props.left ? this.props.left : 0;
            
            let topPos = rectButton.top + rectButton.height + 2 + top;
            let leftPos = rectButton.left + 1 + left;

			this.setState({
				isShow: !this.state.isShow,
				position: {
					top: topPos,
					left: leftPos
				}
			}, () => {
                const rectPopover = this.refPopover.getBoundingClientRect();
                const wWidth = window.innerWidth;
                
                if (leftPos > wWidth - rectPopover.width) {
                    this.refPopover.style.left = `${wWidth - rectPopover.width}px`;
                }
            });
		}
    }

    handleHideColorOption = () => {
		const { sketchPicker } = this.props;

		if (!sketchPicker) {
			this.setState({
				isShow: false
			});
		}
    }

    handleChangeSolidColor(color) {
        const { onChange } = this.props;
        const { selectedPoint, colorType } = this.state;

        if (isFunction(onChange)) {
            onChange(color, {
                colorType,
                selectedPoint
            });
        }
    }

    handleChangeSolidColorComplete(color) {
        const { onChangeComplete } = this.props;

        if (isFunction(onChangeComplete)) {
            onChangeComplete(color);
        }
    }

    handleChangeColorType = (text) => {
        const { onToggleGradientOption } = this.props;

        this.setState({
            colorType: text
        }, () => {
            if (text == 'Gradient') {
                onToggleGradientOption();
            }
        });
    }

    handleChooseGradientPoint = (point) => {
        this.setState({
            selectedPoint: point
        });
    }

    handleChangeDirectionType = (direction) => {
        const { onChangeDirectionType } = this.props;

        this.setState({ 
			direction
		}, () => {
			onChangeDirectionType(direction);
		})
    }

    handleChangeGradientColor = (color) => {
        const { onChangeGradientFrom, onChangeGradientTo } = this.props;

        this.setState({ 
			direction: color.direction
		}, () => {
			onChangeGradientFrom({ hex: color.from });
			onChangeGradientTo({ hex: color.to });
		})
    }

    renderCustomHuePointer = () => {
        return (
            <div
                style={{
                    cursor: 'pointer',
                    fontSize: 32,
                    position: 'relative',
                    left: 5
                }}
            >
                <div style={{
                    width: 4,
                    height: 4,
                    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1.5px, rgba(0, 0, 0, 0.3) 0px 0px 1px 1px inset, rgba(0, 0, 0, 0.4) 0px 0px 1px 2px',
                    borderRadius: 50,
                    transform: 'translate(-2px, -2px)'
                }}></div>
            </div>
        )
    }

    renderCustomAlphaPointer = () => {
        return (
            <div
                style={{
                    cursor: 'pointer',
                    fontSize: 32,
                    position: 'relative',
                    left: 2
                }}
            >
                <div style={{
                    width: 4,
                    height: 4,
                    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1.5px, rgba(0, 0, 0, 0.3) 0px 0px 1px 1px inset, rgba(0, 0, 0, 0.4) 0px 0px 1px 2px',
                    borderRadius: 50,
                    transform: 'translate(-2px, -2px)'
                }}></div>
            </div>
        )
    }

    render() {
        const {
            width,
            objectSelected,
            color,
            presetColors,
            presetGrandientColors,
            dropTextData,
			popoverWidth,
            sketchPicker,
            style
        } = this.props;
        const {
            isShow,
            position,
            colorType,
            direction,
            selectedPoint
        } = this.state;

        let styleColor = '';

        if (isObject(color) && isObject(color.rgb)) {
            styleColor = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
        } else {
            styleColor = color;
        }

        return (
            <div styleName="ui-color button-color"
                style={{
                    width
                }}
            >
				{
					!sketchPicker &&
					<button
						ref={c => this.refButton = c}
						styleName="button-picker"
                        onClick={this.handleShow}
                        style={style}
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
				}

                <div
                    ref={c => this.refPopover = c}
                    styleName="button-popover"
                    style={{
                        background: '#222222',
                        width: popoverWidth,
                        padding: '10px 15px 10px 15px',
                        borderRadius: 6,
                        color: '#fff',
                        display: isShow ? 'block' : 'none',
                        boxShadow: 'rgb(0, 0, 0) 0px 1px 4px',
                        ...position
                    }}
                >
                    <div style={{
                        borderBottom: '1px solid #111111',
                        boxShadow: '0px 1px 0px rgba(196, 196, 196, 0.03)',
                        width: '100%',
                        display: 'inline-block'
                    }}>
                        <div
                            style={{
                                width: '100%',
                                maxHeight: 200
                            }} 
                            ref={c => this.refDropText = c}
                        >
							<DropText
								text={colorType}
								dropData={dropTextData}
								onChange={this.handleChangeColorType}
							/>
                            
                            <FontAwesome 
                                style={{ 
                                    paddingTop: '6px', 
                                    float: 'right', 
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                                onClick={this.handleHideColorOption} 
                                icon="fal fa-times">
                            </FontAwesome>
                        </div>

                        {
                            colorType == 'Gradient' && <div style={{
                                width: '100%',
                                height: 50,
                                marginTop: 35,
                                color: '#999'
                            }}>
                                <div
                                    styleName="gradient-option-v2"
                                >
                                    <div styleName="gradient-palette"
                                        style={{
                                            background: `${direction !== 'radial' ? 'linear' : 'radial'}-gradient(${(direction !== 'radial') ? (direction == 'horizontal' ? 'to right' : 'to bottom') : 'circle at center'}, ${objectSelected.options.gradient.colorStops[0]}, ${objectSelected.options.gradient.colorStops[1]})`
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: objectSelected.options.gradient.colorStops[0]
                                            }}
                                            styleName={`gradient-direction gradient-from ${selectedPoint == 'from' ? 'active' : ''}`}
                                            onClick={() => this.handleChooseGradientPoint('from')}
                                        >
                                            <FontAwesome icon="far fa-caret-down"></FontAwesome>
                                        </div>
                                        <div
                                            style={{
                                                background: objectSelected.options.gradient.colorStops[1]
                                            }}
                                            styleName={`gradient-direction gradient-to ${selectedPoint == 'to' ? 'active' : ''}`}
                                            onClick={() => this.handleChooseGradientPoint('to')}
                                        >
                                            <FontAwesome icon="far fa-caret-down"></FontAwesome>
                                        </div>
                                    </div>

                                    <div styleName="gradient-type">
                                        <div styleName="item">
                                            <span>{__('Ngang')}</span>
                                            <div
                                                onClick={() => this.handleChangeDirectionType('horizontal')}
                                                styleName={`horizontal ${direction == 'horizontal' ? 'active' : ''}`}
                                            ></div>
                                        </div>
                                        <div styleName="item" style={{ paddingLeft: '7px' }}>
                                            <span>{__('Dọc')}</span>
                                            <div
                                                onClick={() => this.handleChangeDirectionType('vertical')}
                                                styleName={`vertical ${direction == 'vertical' ? 'active' : ''}`}
                                            ></div>
                                        </div>
                                        <div styleName="item">
                                            <span>{__('Radial')}</span>
                                            <div
                                                onClick={() => this.handleChangeDirectionType('radial')}
                                                styleName={`radial ${direction == 'radial' ? 'active' : ''}`}
                                            ></div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        }

                        <div style={{
                            marginTop: 10
                        }}>
                            <div style={{
                                height: 140,
                                width: 140,
                                position: 'relative',
                                float: 'left'
                            }}>
                                <Saturation
                                    {...this.props}
                                    onChange={this.handleChangeSolidColor}
                                    onChangeComplete={this.handleChangeSolidColorComplete}
                                />
                            </div>
                            <div style={{
                                marginLeft: '10px',
                                height: 140,
                                width: 10,
                                position: 'relative',
                                float: 'left'
                            }}>
                                <Hue
                                    {...this.props}
                                    direction="vertical"
                                    pointer={this.renderCustomHuePointer}
                                    onChange={this.handleChangeSolidColor}
                                />
                            </div>
                            <div style={{
                                marginLeft: '10px',
                                height: 140,
                                width: 10,
                                position: 'relative',
                                float: 'left',
                                background: '#fff'
                            }}>
                                <Alpha
                                    {...this.props}
                                    pointer={this.renderCustomAlphaPointer}
                                    direction="vertical"
                                    onChange={this.handleChangeSolidColor}
                                />
                            </div>
                        </div>

                        {
                            colorType == 'Solid Color' && <div style={{
                                width: '100%',
                                height: 24,
                                background: '#111111',
                                border: '1px solid #333333',
                                boxSizing: 'border-box',
                                borderRadius: 4,
                                display: 'inline-flex',
                                lineHeight: '24px',
                                color: '#999',
                                fontSize: 12,
                                paddingLeft: 10,
                                margin: '10px 0 10px 0'
                            }}>
                                {this.props.hex}
                            </div>
                        }

                    </div>

                    {
                        colorType == 'Solid Color' && <div style={{
                            marginTop: 10
                        }}>
                            {
                                presetColors.map((color, idx) => {
                                    return (
                                        color != 'TRANSPARENT' ?
                                            <div
                                                title={color}
                                                key={idx}
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    marginRight: 10,
                                                    marginBottom: 10,
                                                    borderRadius: '50%',
                                                    float: 'left',
                                                    cursor: 'pointer',
                                                    background: color
                                                }}
                                                onClick={() => this.handleChangeSolidColor(color)}
                                            ></div>
                                            :
                                            <div
                                                title={color}
                                                key={idx}
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    marginRight: 10,
                                                    marginBottom: 10,
                                                    borderRadius: '50%',
                                                    float: 'left',
                                                    cursor: 'pointer',
                                                    background: color
                                                }}
                                                onClick={() => this.handleChangeSolidColor(color)}
                                            >
                                                <svg style={{ background: '#fff', borderRadius: '50%' }} width="20" height="20" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g filter="url(#filter0_i)">
                                                        <rect x="0.0380859" y="0.333252" width="20.9524" height="20.9524" rx="10.4762" fill="white" />
                                                    </g>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.99198 19.0081C3.57377 18.6749 3.18162 18.3105 2.81909 17.9182L17.6231 3.1142C18.0154 3.47673 18.3798 3.86887 18.713 4.28708L3.99198 19.0081Z" fill="#EB5757" />
                                                    <defs>
                                                        <filter id="filter0_i" x="0.0380859" y="0.333252" width="21.9524" height="22.9524" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                            <feOffset dx="1" dy="2" />
                                                            <feGaussianBlur stdDeviation="2" />
                                                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
                                                        </filter>
                                                    </defs>
                                                </svg>
                                            </div>
                                    )
                                })
                            }
                        </div>
                    }

                    {
                        colorType == 'Gradient' && <div style={{
                            marginTop: 10
                        }}>
                            {
                                presetGrandientColors.map((color, idx) => {
                                    return (
                                        <div
                                            title={color}
                                            key={idx}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                marginRight: 10,
                                                marginBottom: 10,
                                                borderRadius: '50%',
                                                float: 'left',
                                                cursor: 'pointer',
                                                background: `linear-gradient(${color.direction == 'vertical' ? 'to bottom' : 'to right'}, ${color.from}, ${color.to})`
                                            }}
                                            onClick={() => this.handleChangeGradientColor(color)}
                                        ></div>
                                    )
                                })
                            }
                        </div>
                    }

                </div>
            </div>
        );
    }
}

export default CustomPicker(ButtonColorV2);