import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import '../styles/adjust.scss';

import { ButtonColor, ButtonColorV2, SolidColor } from '@media/ui/colorpicker';
import SelectBox from '@media/ui/selectbox-v2';
import Slider from '@media/ui/slider';
import FontAwesome from '@media/ui/icons/FontAwesome';

@inject('store', 'imageCollageStore')
@observer
class Background extends Component {
	static propTypes = {
		onChangeBackgroundColor: PropTypes.func,
		onChangeStrokeWidth: PropTypes.func,
		onChangeStroke: PropTypes.func,
		onChangeOpacity: PropTypes.func,
		onChangeDirectionType: PropTypes.func
	}

	static defaultProps = {
		onChangeBackgroundColor() {},
		onChangeStrokeWidth() {},
		onChangeStroke() {},
		onChangeOpacity() {},
		onChangeGradientFrom() {},
		onChangeGradientTo() {},
		onChangeDirectionType() {}
	}

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		window.addEventListener('click', this.eventOutclick);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.eventOutclick);
	}

	eventOutclick = (e) => {
		if (
			(!this.refGradientOption || !this.refGradientOption.contains(e.target)) && 
			(!this.refGradientInput || !this.refGradientInput.contains(e.target))
		) {
			this.setState({
				showGradientOption: false
			});
		}
	}

	onToggleGradientOption = () => {
		const { imageCollageStore, onChangeGradientFrom, onChangeGradientTo } = this.props;

		const { objectSelected } = imageCollageStore;

		this.setState({
			showGradientOption: !this.state.showGradientOption
		}, () => {
			if (this.state.showGradientOption) {
				onChangeGradientFrom({ hex: objectSelected.options.gradient.colorStops[0] });
				onChangeGradientTo({ hex: objectSelected.options.gradient.colorStops[1] });
			}
		});
	}

	render() {
		const {
			onChangeBackgroundColor,
			onChangeStrokeWidth,
			onChangeStroke,
			onChangeOpacity,
			onChangeGradientFrom,
			onChangeGradientTo,
			onChangeDirectionType,
			imageCollageStore
		} = this.props;

		const { objectSelected } = imageCollageStore;

		return (
			<>
				<div styleName="adjust-title can-move">
					{ __('Chỉnh sửa nền') }
				</div>

				<div styleName="adjust-content">
					
					<div styleName="adjust-row">
						<div styleName="option-box-33 adjust-color">
							<span>{__('Màu')}</span>
							<ButtonColorV2 
								objectSelected={objectSelected}
								color={objectSelected.options.fill} 
								selectedColorType="Solid Color"
								dropTextData={['Solid Color', 'Gradient']}
								onChange={(color, obj) => {
									if (obj.colorType == 'Solid Color') {
										onChangeBackgroundColor(color);
									} else {
										objectSelected.options.fill = color.hex;
										if (obj.selectedPoint == 'from') {
											onChangeGradientFrom(color);
										} else {
											onChangeGradientTo(color);
										}
									}
								}} 
								onToggleGradientOption={this.onToggleGradientOption}
								onChangeDirectionType={onChangeDirectionType}
								onChangeGradientFrom={onChangeGradientFrom}
								onChangeGradientTo={onChangeGradientTo}
							/>
						</div>

						<div styleName="option-box-stroke adjust-color" style={{ marginLeft: 18 }}>
							<span style={{ width: '150%', marginRight: 10 }}>{__('Viền khung')}</span>
							<SelectBox
								isSearch
								value={objectSelected.options.strokeWidth}
								data={_.range(0, 100).map(v => {
									return {
										value: v,
										label: v.toString()
									};
								})}
								onChange={onChangeStrokeWidth}
								dropdownHeight={250}
								ref={c => {
									this.refSelectBox = c;
									imageCollageStore.refSelectBox = c;
								}}
								width={55}
							/>
							<ButtonColorV2 
								color={objectSelected.options.stroke} 
								onChange={onChangeStroke} 
							/>
						</div>
					</div>
					
					<div styleName="adjust-row">
						<div styleName="option-box-100 adjust-color adjust-slider">
							<span style={{ width: '60%' }}styleName="name-slider">{__('Độ trong suốt')}</span>
							<Slider
								value={_.round(objectSelected.options.opacity, 1) || 0}
								min={0}
								max={1}
								step={0.1}
								onChange={onChangeOpacity}
							/>
							<span styleName="pixel-value">{_.round(objectSelected.options.opacity * 100) || 0}%</span>
						</div>
					</div>

				</div>
			</>
		);
	}
}

export default Background;