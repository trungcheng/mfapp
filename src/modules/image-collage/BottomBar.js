import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import './styles/main.scss';

import { SvgIcon, FontAwesome } from '@media/ui/icons';
import { PreviousIcon, NextIcon } from '@media/ui/icons/svgs';
import { UndoIcon, RedoIcon } from '@media/ui/icons/svgs';
import { InputNumber } from '@media/ui/input';
import SelectBox from '@media/ui/selectbox';
import CheckBox from '@media/ui/checkbox';
import { Button } from '@media/ui/button';

@inject('store', 'imageCollageStore')
@observer
class ButtonBar extends Component {
	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number
	}

	static defaultProps = {
		width: 0,
		height: 0
	}

	constructor(props) {
		super(props);

		this.state = {
			showSizeBox: false,
			showZoomBox: false,
			width: props.width,
			height: props.height,
			lockRatio: true
		};

		this.sizes = [
			{
				value: '1200x1200',
				label: '(1:1): 1200 x 1200 px'
			},
			{
				value: '1800x1200',
				label: '(3:1): 1800 x 1200 px'
			},
			{
				value: '1600x1200',
				label: '(4:3): 1600 x 1200 px'
			},
			{
				value: '1920x1080',
				label: '(16:9): 1920 x 1080 px'
			},
			{
				value: '1080x1920',
				label: 'Mobile Phone: 1080 x 1920 px'
			},
			{
				value: '1080x1080',
				label: 'Instagram: 1080 x 1080 px'
			},
			{
				value: '851x315',
				label: 'Facebook Cover: 851 x 315 px'
			},
			{
				value: '1500x500',
				label: 'Twitter Header: 1500 x 500 px'
			},
			{
				value: '735x1102',
				label: 'Pinterest Graphic: 735 x 1102 px'
			},
			{
				value: '2560x1140',
				label: 'Youtube Channel Art: 2560 x 1140 px'
			},
			{
				value: '1140x1000',
				label: 'Card: 1140 x 1000 px'
			},
			{
				value: '728x90',
				label: 'Banner: 728 x 90 px'
			},
			{
				value: '800x1200',
				label: 'Blog Graphic: 800 x 1200 px'
			}
		];
	}

	componentDidMount() {
		window.addEventListener('click', this.eventCloseSizeBox);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.eventCloseSizeBox);
	}

	componentWillReceiveProps(nextProps) {
		const { width, height } = this.props;

		if (nextProps.width != width) {
			this.setState({
				width: nextProps.width
			});
		}

		if (nextProps.height != height) {
			this.setState({
				height: nextProps.height
			});
		}
	}

	eventCloseSizeBox = (e) => {
		if (
			this.refSizeBox && !this.refSizeBox.contains(e.target) &&
			this.refButton && !this.refButton.contains(e.target) &&
			document.body.contains(e.target)
		) {
			this.setState({
				showSizeBox: false
			});
		}

		if (
			this.refZoomBox && !this.refZoomBox.contains(e.target) &&
			this.refButtonZoom && !this.refButtonZoom.contains(e.target)
		) {
			this.setState({
				showZoomBox: false
			});
		}
	}

	handleScale = (value) => {
		const { imageCollageStore } = this.props;

		imageCollageStore.scale += value;

		if (imageCollageStore.canvas && imageCollageStore.canvas.getActiveObject()) {
			const object = imageCollageStore.canvas.getActiveObject();

			object.set({
				borderScaleFactor: 2 / imageCollageStore.scale
			});
			imageCollageStore.canvas.renderAll();
		}
	}

	handleChangeSize = () => {
		const { imageCollageStore } = this.props;
		const { width, height } = this.state;

		imageCollageStore.height = Number(height);
		imageCollageStore.width = Number(width);
		// imageCollageStore.changeLayout();

		this.setState({
			showSizeBox: false
		});
	}

	handleChangeSizeSelectBox = (value) => {
		const width = value.split('x')[0];
		const height = value.split('x')[1];

		this.setState({
			width,
			height
		});
	}

	handleChangeSizeInput = (type, value) => {
		const { width, height, lockRatio } = this.state;

		if (type == 'height') {
			this.setState({
				height: value,
				width: lockRatio ? Math.round((value * width) / height) : width
			});
		} else if (type == 'width') {
			this.setState({
				width: value,
				height: lockRatio ? Math.round((value * height) / width) : height
			});
		}
	}
	
	handleExchangeSize = () => {
		const { width, height } = this.state;

		this.setState({
			width: height,
			height: width
		});
	}

	renderSizeBox = () => {
		const { width, height, lockRatio } = this.state;

		return (
			<div styleName="button-dropdown" ref={c => this.refSizeBox = c}>
				<div styleName="dropdown-row">
					<SelectBox
						value={`${width}x${height}`}
						data={this.sizes}
						height={35}
						dropHeight={100}
						onChange={this.handleChangeSizeSelectBox}
					/>
				</div>

				<div styleName="dropdown-row">
					<div styleName="row-custom-size">
						<InputNumber
							value={width}
							height={35}
							min={0}
							onChange={val => this.handleChangeSizeInput('width', val)}
						/>
						<FontAwesome
							icon="fa fa-exchange-alt"
							onClick={this.handleExchangeSize}
						/>
						<InputNumber
							value={height}
							height={35}
							min={0}
							onChange={val => this.handleChangeSizeInput('height', val)}
						/>
						<span>px</span>
					</div>
				</div>

				<div styleName="dropdown-row">
					<CheckBox
						checked={lockRatio}
						label={__('Khóa tỉ lệ')}
						onChange={checked => this.setState({ lockRatio: checked })}
					/>
				</div>

				<div styleName="dropdown-row row-center">
					<button styleName="dropdown-button"
						onClick={this.handleChangeSize}
					>
						{ __('ĐỒNG Ý') }
					</button>
				</div>
			</div>
		);
	}

	renderZoomBox = () => {
		const { imageCollageStore } = this.props;
		const data = [ 10, 25, 50, 75, 100, 125, 150, 175, 200 ];

		return (
			<div styleName="zoom-dropdown" ref={c => this.refZoomBox = c}>
				{
					data.map((item, idx) => (
						<div styleName="dropdown-row"
							key={idx}
							onClick={() => {
								imageCollageStore.scale = item / 100;
								this.setState({ showZoomBox: false });

								if (imageCollageStore.canvas && imageCollageStore.canvas.getActiveObject()) {
									const object = imageCollageStore.canvas.getActiveObject();
						
									object.set({
										borderScaleFactor: 2 / imageCollageStore.scale
									});
									imageCollageStore.canvas.renderAll();
								}
							}}
						>
							{ item }%
						</div>
					))
				}
			</div>
		);
	}

	render() {
		const { imageCollageStore } = this.props;
		const { width, height } = imageCollageStore;
		const { showSizeBox, showZoomBox } = this.state;

		return (
			<div styleName="bottom-bar">
				{/* <div styleName="history">
					<div 
						id="undo"
						styleName={`history-item ${!imageCollageStore.config.disableUndoButton ? 'actived' : ''}`}
						onClick={() => imageCollageStore.undoCanvas()}
					>
						<SvgIcon icon={<UndoIcon />} color={'#999'} size={20} />
					</div>
					<div 
						id="redo"
						styleName={`history-item ${!imageCollageStore.config.disableRedoButton ? 'actived' : ''}`}
						onClick={() => imageCollageStore.redoCanvas()}
					>
						<SvgIcon icon={<RedoIcon />} color={'#999'} size={20} />
					</div>
				</div> */}
				{/* <div styleName="history">
					<div 
						id="undo" 
						styleName="history-item"
					>
						<SvgIcon icon={<PreviousIcon />} color="#999" size={13} />
						<span>{__('Undo')}</span>
					</div>
					<div 
						id="redo" 
						styleName="history-item"
					>
						<SvgIcon icon={<NextIcon />} color="#999" size={13}  />
						<span>{__('Redo')}</span>
					</div>
				</div> */}

				<div styleName="size">
					<div styleName="size-button">
						<button styleName="button-result"
							onClick={() => this.setState({ showSizeBox: !showSizeBox })}
							ref={c => this.refButton = c}
						>
							<span>{ width }</span>
							<span>x</span>
							<span>{ height }</span>
							<span>px</span>

							{
								showSizeBox ?
									<FontAwesome icon="fa fa-caret-up" />
									:
									<FontAwesome icon="fa fa-caret-down" />
							}
						</button>

						{ showSizeBox && this.renderSizeBox() }
					</div>
				</div>

				<div styleName="zoom">
					<div styleName="zoom-in" onClick={() => this.handleScale(-0.1)}>
						<FontAwesome icon="fal fa-minus" />
					</div>

					<div
						ref={c => this.refButtonZoom = c}
						styleName="zoom-value"
						onClick={() => this.setState({ showZoomBox: !showZoomBox })}
					>
						{ Math.round(imageCollageStore.scale * 100) } %
					</div>

					<div styleName="zoom-out" onClick={() => this.handleScale(0.1)}>
						<FontAwesome icon="fal fa-plus" />
					</div>

					{ showZoomBox && this.renderZoomBox() }
				</div>
			</div>
		);
	}
}

export default ButtonBar;