import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import '../styles/adjust.scss';

import { ButtonColor, ButtonColorV2 } from '@media/ui/colorpicker';
import SelectBox from '@media/ui/selectbox-v2';
import Slider from '@media/ui/slider';

@inject('store', 'imageCollageStore')
@observer
class Shadow extends Component {
	static propTypes = {
		onChangeColor: PropTypes.func,
		onChangeBlur: PropTypes.func,
		onChangeOffsetX: PropTypes.func,
		onChangeOffsetY: PropTypes.func
	}

	static defaultProps = {
		onChangeColor() {},
		onChangeBlur() {},
		onChangeOffsetX() {},
		onChangeOffsetY() {}
	}

	constructor(props) {
		super(props);
	}

	render() {
		const {
			onChangeColor,
			onChangeBlur,
			onChangeOffsetX,
			onChangeOffsetY,
			imageCollageStore
		} = this.props;

		const { objectSelected } = imageCollageStore;

		return (
			<>
				<div styleName="adjust-content" style={{ marginTop: '10px' }}>
					<div styleName="adjust-row">
						<div styleName="option-box-50 adjust-color">
							<span style={{ width: '125%' }}>{__('Màu đổ bóng')}</span>
							<ButtonColorV2 
								color={objectSelected.options.shadow.color || '#000'} 
								onChange={onChangeColor} 
							/>
						</div>
					</div>
					<div styleName="adjust-row">
						<div styleName="option-box-100 adjust-color adjust-slider">
							<span styleName="name-slider">{__('Bóng mờ')}</span>
							<Slider
								value={objectSelected.options.shadow.blur}
								min={0}
								max={100}
								step={1}
								onChange={onChangeBlur}
							/>
							<span styleName="pixel-value">{objectSelected.options.shadow.blur || 0}px</span>
						</div>
					</div>
					<div styleName="adjust-row">
						<div styleName="option-box-100 adjust-color adjust-slider">
							<span styleName="name-slider">{__('Ngang')}</span>
							<Slider
								value={objectSelected.options.shadow.offsetX}
								min={0}
								max={100}
								step={1}
								onChange={onChangeOffsetX}
							/>
							<span styleName="pixel-value">{objectSelected.options.shadow.offsetX || 0}px</span>
						</div>
					</div>
					<div styleName="adjust-row">
						<div styleName="option-box-100 adjust-color adjust-slider">
							<span styleName="name-slider">{__('Dọc')}</span>
							<Slider
								value={objectSelected.options.shadow.offsetY}
								min={0}
								max={100}
								step={1}
								onChange={onChangeOffsetY}
							/>
							<span styleName="pixel-value">{objectSelected.options.shadow.offsetY || 0}px</span>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default Shadow;