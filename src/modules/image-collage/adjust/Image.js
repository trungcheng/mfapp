import { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../styles/adjust.scss';

import { SvgIcon } from '@media/ui/icons';
import { 
	RotateLeftIcon, 
	RotateRightIcon, 
	FlipHorizontalIcon,
	FlipVerticalIcon, 
	ReplaceImageIcon 
} from '@media/ui/icons/svgs';
import { ButtonColor } from '@media/ui/colorpicker';
import SelectBox from '@media/ui/selectbox-v2';
import { FontAwesome } from '@media/ui/icons';
import {
	PanelWrapper,
	PanelItem,
	PanelButton,
	SwitchField
} from '@media/layout/image-editor';
import Slider from '@media/ui/slider';

class Image extends Component {
	static propTypes = {
		data: PropTypes.object
	}

	static defaultProps = {
		data: null
	}
	
	constructor(props) {
		super(props);
	}

	handleReplaceImage = () => {

	}

	render() {
		return (
			<>
				<div styleName="adjust-title can-move">
					{ __('Edit Image') }
				</div>

				<div styleName="adjust-content">

					<div styleName="adjust-row">
						<div styleName="adjust-image">
							<p>{__('Opacity')}</p>
							<div styleName="slider-group">
								<Slider
									value={80}
									min={0}
									max={100}
									step={1}
									onChange={(val) => {}}
								/>
								<span>{__('80%')}</span>
							</div>
						</div>
					</div>

					<div styleName="adjust-row">
						<div styleName="option-box-40 adjust-color">
							<span styleName="single-span">{__('Rotate and Flip')}</span>
						</div>
						<div styleName="option-box-33 option-flip">
							<SwitchField
								data={[
									{ value: 'left', content: <SvgIcon icon={<RotateLeftIcon />} size={15} color="#999" /> },
									{ value: 'right', content: <SvgIcon icon={<RotateRightIcon />} size={15} color="#999" /> }
								]}
								value={'left'}
								onClick={(val) => {}}
							/>
						</div>
						<div styleName="option-box-33 option-flip">
							<SwitchField
								data={[
									{ value: 'horizontal', content: <SvgIcon icon={<FlipHorizontalIcon />} size={15} color="#999" /> },
									{ value: 'vertical', content: <SvgIcon icon={<FlipVerticalIcon />} size={15} color="#999" /> }
								]}
								value={'horizontal'}
								onClick={(val) => {}}
							/>
						</div>
					</div>

				</div>

				<div styleName="adjust-content">
					<div key="1" styleName="splitter"></div>

					<div styleName="adjust-row">
						<div styleName="option-box-100">
							<button
								styleName="btn-replace-image"
								onClick={this.handleReplaceImage}
							>
								<SvgIcon icon={<ReplaceImageIcon />} color="#999" size={16} />
								{ __('Replace Image') }
							</button>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default Image;