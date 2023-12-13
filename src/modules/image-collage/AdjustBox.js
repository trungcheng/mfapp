/* eslint-disable max-lines-per-function */
import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { isString } from 'coreutils-js';

import './styles/adjust.scss';

import AdjustText from './adjust/Text';
import AdjustBackground from './adjust/Background';
import AdjustShadow from './adjust/Shadow';
import AdjustImage from './adjust/Image';

import { FontAwesome } from '@media/ui/icons';

@inject('store', 'imageCollageStore')
@observer
class AdjustBox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			x: this.props.x,
			y: this.props.y,
			isIcon: true
		}

		this.dragMouseDown = this.dragMouseDown.bind(this)
		this.elementDrag = this.elementDrag.bind(this)
		this.closeDragElement = this.closeDragElement.bind(this)
	}

	componentDidMount() {
		this.pos1 = 0;
		this.pos2 = 0;
		this.pos3 = 0;
		this.pos4 = 0;
	}

	dragMouseDown(e) {
		if (isString(e.target.className) && e.target.className.includes('can-move')) {
			e.preventDefault();

			this.pos3 = e.clientX;
			this.pos4 = e.clientY;

			document.onmouseup = this.closeDragElement;
			document.onmousemove = this.elementDrag;
		}
	}

	elementDrag(e) {
		e.preventDefault()

		this.pos1 = this.pos3 - e.clientX;
		this.pos2 = this.pos4 - e.clientY;
		this.pos3 = e.clientX;
		this.pos4 = e.clientY;

		this.refAdjustBox.style.left = `${this.refAdjustBox.offsetLeft - this.pos1}px`;
		this.refAdjustBox.style.top = `${this.refAdjustBox.offsetTop - this.pos2}px`;
	}

	closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}

	onDisableIcon = () => {
		const { imageCollageStore } = this.props;
		const { objectSelectedPosition } = imageCollageStore;

		this.setState({
			isIcon: false
		}, () => {
			let wWidth = window.innerWidth;
			let rectAB = this.refAdjustBox.getBoundingClientRect();
			let boxLeftPos = objectSelectedPosition.left;

			if (boxLeftPos > wWidth - rectAB.width) {
				this.refAdjustBox.style.left = `${wWidth - rectAB.width}px`;
			}
		});
	}

	onShowIcon = () => {
		this.setState({
			isIcon: true
		});
	}

	render() {
		const { isIcon } = this.state;
		const { imageCollageStore } = this.props;
		const { objectSelected, objectSelectedPosition } = imageCollageStore;

		if (!objectSelected) return null;

		return (
			<>
				{
					isIcon && <div styleName="collage-adjust-icon"
						ref={c => {
							this.refAdjustBox = c;
							imageCollageStore.refAdjustBox = c;
						}}
						style={{
							top: objectSelectedPosition.top,
							left: objectSelectedPosition.left
						}}
						onClick={() => this.onDisableIcon()}
					>
						<svg width="25" height="25" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="17" cy="17" r="17" fill="#333333"/>
							<path fillRule="evenodd" clipRule="evenodd" d="M22.7898 8.70754C22.3432 8.26087 21.619 8.26087 21.1723 8.70754L10.3411 19.5387L9.56111 23.4389L13.4613 22.6589L24.2925 11.8277C24.7391 11.381 24.7391 10.6568 24.2925 10.2102L22.7898 8.70754ZM20.2018 7.73701C21.1844 6.75433 22.7777 6.75433 23.7604 7.73701L25.263 9.23963C26.2457 10.2223 26.2457 11.8156 25.263 12.7982L14.2849 23.7763C14.1891 23.8721 14.0671 23.9374 13.9342 23.964L8.82087 24.9867C8.59587 25.0317 8.36326 24.9612 8.20101 24.799C8.03876 24.6367 7.96834 24.4041 8.01334 24.1791L9.03601 19.0658C9.06258 18.9329 9.12789 18.8109 9.22369 18.7151L20.2018 7.73701Z" fill="white"/>
							<path fillRule="evenodd" clipRule="evenodd" d="M22.95 15L18 10.05L19.05 9L24 13.95L22.95 15Z" fill="white"/>
							<path fillRule="evenodd" clipRule="evenodd" d="M12.9521 24L9 20.0479L10.0479 19L14 22.9521L12.9521 24Z" fill="white"/>
						</svg>
					</div>
				}

				{
					!isIcon && <div styleName="collage-adjust"
						ref={c => {
							this.refAdjustBox = c;
							imageCollageStore.refAdjustBox = c;
						}}
						onMouseDown={this.dragMouseDown}
						style={{
							top: objectSelectedPosition.top,
							left: objectSelectedPosition.left
						}}
					>
						<FontAwesome onClick={this.onShowIcon} icon="fal fa-times"></FontAwesome>

						{ objectSelected.type == 'text' && <TextAdjustBox objectSelected={objectSelected} imageCollageStore={imageCollageStore} /> }
						
						{ objectSelected.type == 'rect' && <BackgroundAdjustBox objectSelected={objectSelected} imageCollageStore={imageCollageStore} /> }
		
						{ objectSelected.type == 'image' && <ImageAdjustBox objectSelected={objectSelected} imageCollageStore={imageCollageStore} /> }
					</div>
				}
			</>
			
		);
	}
}

const TextAdjustBox = inject('imageCollageStore')(observer(({ imageCollageStore }) => {
	const { objectSelected } = imageCollageStore;

	return (
		<div style={{ width: 330 }}>
			<AdjustText
				onChangeColor={(color) => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							fill: color.hex
						}
					);
				}}
				onChangeFontSize={size => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							fontSize: size
						}
					);
				}}
				onToggleFontStyle={() => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							fontStyle: (objectSelected.options.fontStyle == 'italic') ? 'normal' : 'italic'
						}
					);
				}}
				onChangeFont={fontF => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							fontFamily: fontF
						}
					);
				}}
				onChangeLineHeight={lineH => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							lineHeight: lineH
						}
					);
				}}
				onChangeCharSpacing={space => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							charSpacing: space
						}
					);
				}}
				onToggleFontWeight={() => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							fontWeight: (objectSelected.options.fontWeight == 'bold') ? 'normal' : 'bold'
						}
					);
				}}
				onToggleTextUnderline={() => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							underline: (objectSelected.options.underline) ? false : true
						}
					);
				}}
				onChangeTextAlign={(align) => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							textAlign: align
						}
					);
				}}
				onChangeStrokeWidth={width => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							strokeWidth: width
						}
					);
				}}
				onChangeStroke={(color) => {
					imageCollageStore.changeText(
						objectSelected.id,
						{
							stroke: color.hex
						}
					);
				}}
			/>

			<div styleName="adjust-content">
				<div key="1" styleName="splitter"></div>
			</div>

			<AdjustShadow
				onChangeColor={(color) => {
					imageCollageStore.changeTextShadow(
						objectSelected.id,
						{
							color: color.hex
						}
					);
				}}
				onChangeBlur={(val) => {
					imageCollageStore.changeTextShadow(
						objectSelected.id,
						{
							blur: val
						}
					);
				}}
				onChangeOffsetX={(val) => {
					imageCollageStore.changeTextShadow(
						objectSelected.id,
						{
							offsetX: val
						}
					);
				}}
				onChangeOffsetY={(val) => {
					imageCollageStore.changeTextShadow(
						objectSelected.id,
						{
							offsetY: val
						}
					);
				}}
			/>
		</div>
	);
}));

const BackgroundAdjustBox = inject('imageCollageStore')(observer(({ imageCollageStore }) => {
	const { objectSelected } = imageCollageStore;

	return (
		<div style={{ width: 330 }}>
			<AdjustBackground
				onChangeBackgroundColor={(color) => {
					imageCollageStore.changeBg(
						objectSelected.id,
						{
							fill: color.hex
						}
					);
				}}
				onChangeStrokeWidth={width => {
					imageCollageStore.changeBg(
						objectSelected.id,
						{
							strokeWidth: width
						}
					);
				}}
				onChangeStroke={(color) => {
					imageCollageStore.changeBg(
						objectSelected.id,
						{
							stroke: color.hex
						}
					);
				}}
				onChangeOpacity={(val) => {
					imageCollageStore.changeBg(
						objectSelected.id,
						{
							opacity: val
						}
					);
				}}
				onChangeGradientFrom={(color) => {
					imageCollageStore.changeBgGradient(
						objectSelected.id,
						{
							colorStops: {
								0: color.hex,
								1: objectSelected.options.gradient.colorStops[1]
							}
						}
					);
				}}
				onChangeGradientTo={(color) => {
					imageCollageStore.changeBgGradient(
						objectSelected.id,
						{
							colorStops: {
								0: objectSelected.options.gradient.colorStops[0],
								1: color.hex
							}
						}
					);
				}}
				onChangeDirectionType={(type) => {
					imageCollageStore.changeBgGradient(
						objectSelected.id,
						{
							type: (type !== 'radial') ? 'linear' : 'radial',
							r1: (type !== 'radial') ? 0 : objectSelected.options.width / 7,
							r2: (type !== 'radial') ? 0 : objectSelected.options.width / 2 + objectSelected.options.width / 7,
							x1: (type !== 'radial') ? ((type == 'horizontal') ? 0 : objectSelected.options.width / 2) : objectSelected.options.width / 2,
							y1: (type !== 'radial') ? ((type == 'horizontal') ? objectSelected.options.height / 2 : 0) : objectSelected.options.width / 2,
							x2: (type !== 'radial') ? ((type == 'horizontal') ? objectSelected.options.width : objectSelected.options.width / 2) : objectSelected.options.width / 2,
							y2: (type !== 'radial') ? ((type == 'horizontal') ? objectSelected.options.height / 2 : objectSelected.options.height) : objectSelected.options.width / 2,
							colorStops: {
								0: objectSelected.options.gradient.colorStops[0],
								1: objectSelected.options.gradient.colorStops[1],
							}
						}
					);
				}}
			/>
		</div>
	);
}));

const ImageAdjustBox = inject('imageCollageStore')(observer(({ imageCollageStore }) => {
	return (
		<div style={{ width: 270 }}>
			<AdjustImage />
		</div>
	);
}));

export default AdjustBox;