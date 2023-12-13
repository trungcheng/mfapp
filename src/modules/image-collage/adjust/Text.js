/* eslint-disable max-lines-per-function */
import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import texts from '@media/config/collage/texts';
import _ from 'lodash';
import PropTypes from 'prop-types';

import '../styles/adjust.scss';

import { SvgIcon } from '@media/ui/icons';
import {
	TextLineHeightIcon,
	TextSpacingIcon,
	BoldFontIcon,
	ItalicFontIcon,
	UnderlineFontIcon,
	AlignLeftIcon,
	AlignMiddleIcon,
	AlignRightIcon
} from '@media/ui/icons/svgs';
import { ButtonColor, ButtonColorV2 } from '@media/ui/colorpicker';
import SelectBox from '@media/ui/selectbox-v2';
import SearchBox from '@media/ui/searchbox';

@inject('store', 'imageCollageStore')
@observer
class Text extends Component {
	static propTypes = {
		onChangeFontSize: PropTypes.func,
		onChangeFont: PropTypes.func,
		onChangeLineHeight: PropTypes.func,
		onChangeCharSpacing: PropTypes.func,
		onChangeTextAlign: PropTypes.func,
		onToggleFontWeight: PropTypes.func,
		onToggleFontStyle: PropTypes.func,
		onToggleTextUnderline: PropTypes.func,
		onChangeColor: PropTypes.func,
		onChangeStrokeWidth: PropTypes.func,
		onChangeStroke: PropTypes.func,
		onMouseDown: PropTypes.func
	}

	static defaultProps = {
		onChangeSize() {},
		onChangeFont() {},
		onChangeLineHeight() {},
		onChangeCharSpacing() {},
		onChangeTextAlign() {},
		onToggleFontWeight() {},
		onToggleFontStyle() {},
		onToggleTextUnderline() {},
		onChangeColor() {},
		onChangeStrokeWidth() {},
		onChangeStroke() {},
		onMouseDown() {}
	}

	constructor(props) {
		super(props);
	}

	render() {
		const {
			onChangeFont,
			onChangeFontSize,
			onChangeLineHeight,
			onChangeCharSpacing,
			onChangeColor,
			onToggleFontWeight,
			onToggleFontStyle,
			onToggleTextUnderline,
			onChangeTextAlign,
			onChangeStrokeWidth,
			onChangeStroke,
			imageCollageStore
		} = this.props;

		const { objectSelected } = imageCollageStore;

		return (
			<>
				<div styleName="adjust-title can-move">
					{ __('Chỉnh sửa văn bản') }
				</div>

				<div styleName="adjust-content">
					<div styleName="adjust-row">
						<div styleName="option-box-80 option-box">
							<SelectBox
								isSearch
								value={objectSelected.options.fontFamily}
								data={
									texts.fonts.map(font => {
										return {
											value: font,
											label: <span style={{ fontFamily: font }}>{ font }</span>
										};
									})
								}
								placeholder={__('Chọn font')}
								onChange={onChangeFont}
								dropdownHeight={250}
								ref={c => {
									this.refSelectBox = c;
									imageCollageStore.refSelectBox = c;
								}}
							/>
						</div>
						<div styleName="option-box-25 option-box-number option-box">
							<SelectBox
								isSearch
								value={objectSelected.options.fontSize || 50}
								data={_.range(1, 151).map(v => {
									return {
										value: v,
										label: v.toString()
									};
								})}
								placeholder={__('Chọn cỡ font')}
								onChange={onChangeFontSize}
								dropdownHeight={250}
								ref={c => {
									this.refSelectBox = c;
									imageCollageStore.refSelectBox = c;
								}}
							/>
						</div>
					</div>

					<div styleName="adjust-row">
						<div styleName="option-box-50 option-box-custom-v2 adjust-color">
							<span>{__('Giãn dòng')}</span>
							<SelectBox
								isSearch
								value={objectSelected.options.lineHeight || 1}
								data={[
									{ value: 0.5, label: '0.5' },
									{ value: 0.75, label: '0.75' },
									{ value: 1, label: '1' },
									{ value: 1.25, label: '1.25' },
									{ value: 1.5, label: '1.5' },
									{ value: 1.75, label: '1.75' },
									{ value: 2, label: '2' }
								]}
								onChange={onChangeLineHeight}
								dropdownHeight={250}
								ref={c => {
									this.refSelectBox = c;
									imageCollageStore.refSelectBox = c;
								}}
							/>
						</div>

						<div styleName="option-box-50 option-box-custom adjust-color">
							<span style={{ marginLeft: 25 }}>{__('Giãn chữ')}</span>
							<SelectBox
								isSearch
								value={objectSelected.options.charSpacing || 0}
								data={_.range(0, 101).map(v => {
									return {
										value: v,
										label: v.toString()
									}
								})}
								onChange={onChangeCharSpacing}
								dropdownHeight={250}
								ref={c => {
									this.refSelectBox = c;
									imageCollageStore.refSelectBox = c;
								}}
							/>
						</div>
					</div>

					<div styleName="adjust-row">
						<div styleName="option-box-60 option-box-custom adjust-color">
							<span>{__('Kiểu chữ')}</span>
							<div styleName={`single-icon ${objectSelected.options.fontWeight == 'bold' ? 'active' : ''}`}
								onClick={() => onToggleFontWeight()}
							>
								<SvgIcon icon={<BoldFontIcon />} size={15} color="#999" />
							</div>
							<div styleName={`single-icon ${objectSelected.options.fontStyle == 'italic' ? 'active' : ''}`}
								onClick={() => onToggleFontStyle()}
							>
								<SvgIcon icon={<ItalicFontIcon />} size={15} color="#999" />
							</div>
							<div styleName={`single-icon ${objectSelected.options.underline ? 'active' : ''}`}
								onClick={() => onToggleTextUnderline()}
							>
								<SvgIcon icon={<UnderlineFontIcon />} size={15} color="#999" />
							</div>
						</div>
						<div styleName="option-box-33 option-box-custom option-text-align">
							<div styleName={`single-icon ${objectSelected.options.textAlign == 'left' ? 'active' : ''}`}
								onClick={() => onChangeTextAlign('left')}
							>
								<SvgIcon icon={<AlignLeftIcon />} size={15} color="#999" />
							</div>
							<div styleName={`single-icon ${objectSelected.options.textAlign == 'center' ? 'active' : ''}`}
								onClick={() => onChangeTextAlign('center')}
							>
								<SvgIcon icon={<AlignMiddleIcon />} size={15} color="#999" />
							</div>
							<div styleName={`single-icon ${objectSelected.options.textAlign == 'right' ? 'active' : ''}`}
								onClick={() => onChangeTextAlign('right')}
							>
								<SvgIcon icon={<AlignRightIcon />} size={15} color="#999" />
							</div>
						</div>
					</div>

					<div styleName="adjust-row">
						<div styleName="option-box-45 adjust-color">
							<span style={{ width: '93%' }}>{__('Màu chữ')}</span> 
							<ButtonColorV2 
								color={objectSelected.options.fill} 
								onChange={onChangeColor} 
							/>
						</div>
						
						<div styleName="option-box-stroke adjust-color">
							<span style={{ width: '115%', marginRight: 10 }}>{__('Viền chữ')}</span>
							<SelectBox
								isSearch
								value={objectSelected.options.strokeWidth}
								data={_.range(0, 100).map(v => {
									return {
										value: v,
										label: v.toString()
									}
								})}
								onChange={onChangeStrokeWidth}
								dropdownHeight={250}
								width={55}
							/>
							<ButtonColorV2 
								color={objectSelected.options.stroke} 
								onChange={onChangeStroke} 
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default Text;