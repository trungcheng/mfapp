import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import backgrounds from '@media/config/collage/backgrounds';
import uploadLocal from '@media/common/upload-local';
import { isFunction, isObject, isArray, isNull, isUndefined } from 'coreutils-js';

import '../styles/panel.scss';

import { SvgIcon } from '@media/ui/icons';
import { UploadBgIcon } from '@media/ui/icons/svgs';
import Scrollbar from '@media/ui/scrollbar';
import Tooltip from '@media/ui/tooltip';
import FontAwesome from '@media/ui/icons/FontAwesome';
import Slider from '@media/ui/slider';
import ButtonColorV2 from '@media/ui/colorpicker/ButtonColorV2';
// import { SketchPicker } from 'react-color';

@inject('svgStore', 'imageCollageStore')
@observer
class BackgroundPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isNewColor: false,
			isNewColorGradient: false,
			isShow: false,
			isShowGradient: false,
			position: null,
			positionGradient: null,
			color: '',
			colorGradient: '',
			solids: ['red', 'blue', 'green', 'black', 'white'],
			gradients: [
				{ type: 'linear', direction: 'to bottom', from: '#334d50', to: '#cbcaa5' },
				{ type: 'linear', direction: 'to bottom', from: '#F7F8F8', to: '#ACBB78' },
				{ type: 'linear', direction: 'to bottom', from: '#FFE000', to: '#799F0C' },
				{ type: 'linear', direction: 'to bottom', from: '#00416A', to: '#E4E5E6' },
				{ type: 'linear', direction: 'to bottom', from: '#bdc3c7', to: '#2c3e50' }
			]
		};
	}

	componentDidMount() {
		window.addEventListener('click', this.eventClick);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.eventClick);
	}

	eventClick = (e) => {
		const { isNewColor, isNewColorGradient } = this.state;

		if (this.refButton && this.refPopover && !this.refButton.contains(e.target) &&
			!this.refPopover.contains(e.target)) {
			this.setState({
				isShow: false,
				isNewColor: false
			});
		} else if (isNewColor && this.refPopover && !this.refPopover.contains(e.target)) {
			this.setState({
				isShow: false,
				isNewColor: false
			});
		}

		if (this.refButtonGradient && this.refPopoverGradient && !this.refButtonGradient.contains(e.target) &&
			!this.refPopoverGradient.contains(e.target)) {
			this.setState({
				isShowGradient: false,
				isNewColorGradient: false
			});
		} else if (isNewColorGradient && this.refPopoverGradient && !this.refPopoverGradient.contains(e.target)) {
			this.setState({
				isShowGradient: false,
				isNewColorGradient: false
			});
		}
	}

	handleChangeBackground = (src) => {
		const { imageCollageStore } = this.props;

		imageCollageStore.changeBackground(src);
	}

	handleUploadBackground = (e) => {
		uploadLocal(e, (images) => {
			const { imageCollageStore } = this.props;

			imageCollageStore.changeBackground(images[0]);
		});
	}

	renderBackgrounds = () => {
		return backgrounds.map((src, idx) => (
			<div key={idx}
				styleName="listing-item"
				onClick={() => this.handleChangeBackground(src)}
			>
				<img src={src} />
			</div>
		));
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

	handleShowGradient = () => {
		const rect = this.refButtonGradient.getBoundingClientRect();
		const top = this.props.top ? this.props.top : 0;
		const left = this.props.left ? this.props.left : 0;

		this.setState({
			isShowGradient: !this.state.isShowGradient,
			positionGradient: {
				top: rect.top + rect.height + 2 + top,
				left: rect.left + 1 + left
			}
		});
	}

	handleChangeComplete = (color, e) => {
		const { solids, isNewColor } = this.state;

		if (isNewColor) {
			solids[solids.length - 1] = color.hex;
		} else {
			solids.push(color.hex);
		}

		this.handleChangeBgColor(null, color.hex);

		this.setState({
			solids,
			isNewColor: true
		});
	}

	handleChangeCompleteGradient = (color, e) => {
		const { gradients, isNewColorGradient } = this.state;

		if (isNewColorGradient) {
			gradients[gradients.length - 1] = color.hex;
		} else {
			gradients.push(color.hex);
		}

		this.handleChangeBgColor(null, color.hex);

		this.setState({
			gradients,
			isNewColorGradient: true
		});
	}

	handleChangeBgColor = (source, bg) => {
		const { imageCollageStore } = this.props;

		const width = imageCollageStore.width;
		const height = imageCollageStore.height;

		const x = document.createElement('canvas');
		x.setAttribute('width', width);
		x.setAttribute('height', height);

		// x.style.backgroundImage = !isUndefined(bg.direction) ? `linear-gradient(${bg.direction}, ${bg.from}, ${bg.to})` : bg;
		x.style.backgroundImage = bg;

		const ctx = x.getContext('2d');

		// if (!isUndefined(bg.direction)) {
		// 	var grd = ctx.createLinearGradient(0, 0, width, height);
		// 	// var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
		// 	grd.addColorStop(0, bg.from);
		// 	grd.addColorStop(1, bg.to);
		// 	ctx.fillStyle = grd;
		// } else {
			ctx.fillStyle = bg;
		// }

		ctx.fillRect(0, 0, width, height);

		imageCollageStore.changeBackground(x.toDataURL());
	}

	renderSolidColor = () => {
		const { solids, isNewColor, isShow, position, color } = this.state;

		return (
			<>
				<div styleName='list-bgcolor'>
					{
						solids.map((bg, index) => (
							<div
								key={index}
								onClick={() => this.handleChangeBgColor(null, bg)}
								styleName="bgcolor-item"
								style={{ background: bg }}
							/>
						))
					}

					{
						!isNewColor ?
							<div
								ref={c => this.refButton = c}
								onClick={this.handleShow}
								styleName='button-color-picker'>
								<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect x="0.6" y="0.6" width="22.8" height="22.8" rx="1.4" stroke="#888888" strokeWidth="1.2" strokeLinejoin="round" strokeDasharray="2 2"/>
									<path d="M12 7V17" stroke="#888888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
									<path d="M7 12H17" stroke="#888888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							:
							null
					}

					<div
						ref={c => this.refPopover = c}
						styleName="button-popover"
						style={{
							display: isShow ? 'block' : 'none',
							...position
						}}
					>
						<ButtonColorV2 
							color={isObject(color) ? color : ''} 
							onChange={this.handleChange}
							onChangeComplete={this.handleChangeComplete}
							sketchPicker={true}
						/>
						{/* <SketchPicker
							color={isObject(color) ? color : ''}
							disableAlpha={true}
							onChange={this.handleChange}
							onChangeComplete={this.handleChangeComplete}
						/> */}
					</div>
				</div>
			</>
		);
	}

	renderGradientColor = () => {
		const { gradients, isNewColorGradient, isShowGradient, positionGradient, colorGradient } = this.state;

		return (
			<>
				<div styleName='list-bgcolor'>
					{
						gradients.map((bg, index) => (
							<div
								key={index}
								onClick={() => this.handleChangeBgColor(null, bg)}
								styleName="bgcolor-item"
								style={{ 
									background: `${bg.type}-gradient(${bg.direction}, ${bg.from}, ${bg.to})` 
								}}>
							</div>
						))
					}

					{
						!isNewColorGradient ?
							<div
								ref={c => this.refButtonGradient = c}
								onClick={this.handleShowGradient}
								styleName='button-color-picker'>
								<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect x="0.6" y="0.6" width="22.8" height="22.8" rx="1.4" stroke="#888888" strokeWidth="1.2" strokeLinejoin="round" strokeDasharray="2 2"/>
									<path d="M12 7V17" stroke="#888888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
									<path d="M7 12H17" stroke="#888888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							:
							null
					}

					<div
						ref={c => this.refPopoverGradient = c}
						styleName="button-popover"
						style={{
							display: isShowGradient ? 'block' : 'none',
							...positionGradient
						}}
					>
						<ButtonColorV2 
							color={isObject(colorGradient) ? colorGradient : ''} 
							onChange={this.handleChange}
							onChangeComplete={this.handleChangeCompleteGradient}
							sketchPicker={true}
						/>
						{/* <SketchPicker
							color={isObject(colorGradient) ? colorGradient : ''}
							disableAlpha={true}
							onChange={this.handleChange}
							onChangeComplete={this.handleChangeCompleteGradient}
						/> */}
					</div>
				</div>
			</>
		);
	}

	render() {
		return (
			<div styleName="collage-panel">
				<div styleName="panel-body">
					<Scrollbar>
						<div styleName="background background-section">
							<div styleName="background-title">
								{__('Màu nền')}
							</div>

							<div styleName="background-listing">
								{this.renderSolidColor()}
								<div key="1" styleName="splitter"></div>
							</div>
						</div>

						{/* <div styleName="background background-section">
							<div styleName="background-title">
								{__('Màu nền gradient')}
							</div>

							<div styleName="background-listing">
								{this.renderGradientColor()}
								<div key="1" styleName="splitter"></div>
							</div>
						</div> */}


						<div styleName="background background-section">
							<div styleName="background-title">
								{__('Hình nền')}
							</div>

							<div styleName="background-upload"
								onClick={() => document.getElementById('UploadBackgroundImage').click()}
							>
								<SvgIcon icon={<UploadBgIcon />} color="#999" size={16} />
								{__('Tải lên')}
							</div>

							<div styleName="background-listing" style={{ paddingRight: 0 }}>
								{this.renderBackgrounds()}
							</div>
						</div>
					</Scrollbar>
				</div>

				<input
					type="file"
					accept="image/*"
					id="UploadBackgroundImage"
					style={{
						display: 'none'
					}}
					onChange={this.handleUploadBackground}
				/>
			</div>
		);
	}
}

export default BackgroundPanel;