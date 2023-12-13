import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { isFunction } from 'coreutils-js';

import './styles/main.scss';

import { Button } from '@media/ui/button';
import { SvgIcon } from '@media/ui/icons';
import { CloseAltIcon, EyeIcon, CheckIcon, ArrowLongLeft } from '@media/ui/icons/svgs';

@inject('store', 'imageCollageStore')
@observer
class Header extends Component {
	constructor(props) {
		super(props);
	}

	handleClose = () => {
		const { imageCollageStore } = this.props;

		if (imageCollageStore.dialog) {
			imageCollageStore.dialog.close();

			if (isFunction(imageCollageStore.cancel)) {
				imageCollageStore.cancel();
			}
		}
	}

	handleSave = () => {
		const { imageCollageStore } = this.props;

		imageCollageStore.onSave([ imageCollageStore.canvas.toDataURL() ]);

		if (isFunction(imageCollageStore.callback)) {
			imageCollageStore.callback(imageCollageStore.canvas.toDataURL());
		}
	}

	handleTooglePreview = () => {
		const { imageCollageStore } = this.props;
		const { previewMode } = imageCollageStore;

		imageCollageStore.previewMode = !previewMode;
	}

	render() {
		const { imageCollageStore } = this.props;
		const { previewMode } = imageCollageStore;

		return (
			<div styleName="collage-header">
				{
					previewMode ?
						<div styleName="header-back">
							<div styleName="back-icon" onClick={this.handleTooglePreview}>
								<SvgIcon icon={<ArrowLongLeft />} size={16} />
							</div>
							<span>{__('Trở về')}</span>
						</div>
						:
						<div styleName="header-title">
							{ __('Ghép Ảnh') }
						</div>
				}

				<div styleName="header-action">
					<Button
						size="small"
						type={previewMode ? 'success' : 'default'}
						icon={<SvgIcon icon={<EyeIcon />} size={16} color={previewMode ? '#222' : '#666'} />}
						onClick={this.handleTooglePreview}
					>
						{ __('Xem trước') }
					</Button>
					<Button
						size="small"
						type={!previewMode ? 'success' : 'default'}
						icon={<SvgIcon icon={<CheckIcon />} size={16} color={!previewMode ? '#222' : '#666'} />}
						onClick={this.handleSave}
					>
						{ __('Lưu') }
					</Button>
				</div>

				<div styleName="header-close" title={__('Đóng')}
					onClick={this.handleClose}
				>
					<SvgIcon icon={<CloseAltIcon />} color="#999" />
				</div>
			</div>
		);
	}
}

export default Header;