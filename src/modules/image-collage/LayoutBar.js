import { Component } from 'react';
import layouts from '@media/config/collage/layouts';
import { clsx } from 'coreutils-js';
import { observer, inject } from 'mobx-react';

import './styles/main.scss';

import Slider from '@media/ui/slider';
import Scrollbar from '@media/ui/scrollbar';

@inject('store', 'imageCollageStore')
@observer
class LayoutBar extends Component {
	constructor(props) {
		super(props);
	}

	handleRoundness = (value) => {
		const { imageCollageStore } = this.props;

		imageCollageStore.roundness = value;
		imageCollageStore.canvas.renderAll();
	}

	handleSpacing = (value) => {
		const { imageCollageStore } = this.props;

		imageCollageStore.spacing = value;
		imageCollageStore.layout.frames.forEach(frame => {
			if (frame.instancePolygon) {
				frame.instancePolygon.set({
					// width: frame.width - (value * 2),
					// height: frame.height - (value * 2),
					strokeWidth: value
				});
				imageCollageStore.canvas.renderAll();
			}
		});
	}

	renderAdjust = () => {
		const { imageCollageStore } = this.props;

		if (!imageCollageStore.layout) return null;

		return (
			<div styleName="layout-adjust">
				{/* ![20,21].includes(imageCollageStore.layoutSelectedId) &&  */}
				{
					<div styleName="adjust-item">
						<div styleName="item-title">{ __('Khoảng cách') }</div>
						<div styleName="item-main">
							<Slider
								value={imageCollageStore.spacing || 0}
								min={0}
								max={100}
								step={1}
								onChange={this.handleSpacing}
							/>
							<span>{imageCollageStore.spacing || 0}%</span>
						</div>
					</div>
				}

				<div styleName="adjust-item">
					<div styleName="item-title">{ __('Bo góc') }</div>
					<div styleName="item-main">
						<Slider
							value={imageCollageStore.roundness || 0}
							min={0}
							max={100}
							step={1}
							onChange={this.handleRoundness}
						/>
						<span>{imageCollageStore.roundness || 0}px</span>
					</div>
				</div>
			</div>
		);
	}

	renderFrames = () => {
		const { imageCollageStore } = this.props;
		const { layoutSelectedId } = imageCollageStore;

		return layouts.map((layout, idx) => (
			layout.id != 1 && 
			<div
				key={idx}
				styleName={clsx('frame-item', layoutSelectedId == layout.id && 'actived')}
				onClick={() => imageCollageStore.layoutSelectedId = layout.id}
			>
				<img src={layout.thumbnail} />
			</div>
		));
	}

	render() {

		return (
			<div styleName="collage-layout">
				<div styleName="layout-title">{ __('Khung') }</div>

				<div styleName="layout-frames">
					<Scrollbar>
						<div styleName="frame-listing">
							{ this.renderFrames() }
						</div>
					</Scrollbar>
				</div>

				{ this.renderAdjust() }
			</div>
		);
	}
}

export default LayoutBar;
