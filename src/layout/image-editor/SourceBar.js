import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
	isUrl,
	isImageBase64,
	isArray,
	uuid
} from 'coreutils-js';
import uploadLocal from '@media/common/upload-local';

import './style.scss';

import { FontAwesome } from '@media/ui/icons';
import Tooltip from '@media/ui/tooltip';

@inject('imageEditorStore')
@observer
class SourceBar extends Component {
	constructor(props) {
		super(props);
	}

	handleUpload = (e) => {
		uploadLocal(e, this.loadImage);
	};

	loadImage = (images) => {
		const { imageEditorStore } = this.props;

		if (isArray(images)) {
			images.forEach(item => {
				if (isUrl(item) || isImageBase64(item)) {
					imageEditorStore.addSource(item);
				}
			});
		}
	}

	handleRemovePhoto(e, id) {
		const { imageEditorStore } = this.props;

		imageEditorStore.removeSource(id);
		e.stopPropagation();
	}

	renderPhoto() {
		const { imageEditorStore } = this.props;

		return imageEditorStore.sources.map(photo => (
			<div styleName={`watermark-photo ${imageEditorStore.selectedSourceId === photo.id ? 'selected' : ''}`}
				key={uuid()}
				onClick={() => imageEditorStore.selectedSourceId = photo.id}
			>
				{
					imageEditorStore.allowAddSource && <button
						styleName="close"
						onClick={(e) => this.handleRemovePhoto(e, photo.id)}
					>
						<Tooltip content={__('Xóa')} position="top">
							<FontAwesome icon="fal fa-times" />
						</Tooltip>
					</button>
				}
				
				<img src={ photo.src } />
			</div>
		));
	}

	render() {
		const { imageEditorStore } = this.props;

		return (
			<div styleName="source-bar">
				<div styleName="title">{ __('D. SÁCH') }</div>
				
				<div styleName="splitter"></div>

				{
					imageEditorStore.allowAddSource && <button styleName="add-source" onClick={() => document.getElementById('sourcebar-upload-photo').click()}>
						<FontAwesome icon="fa fa-plus" />
					</button>
				}

				<div styleName="content">
					{ this.renderPhoto() }
				</div>

				<input
					type="file"
					id="sourcebar-upload-photo"
					multiple
					accept="image/*"
					onChange={(e) => this.handleUpload(e)}
					style={{ display: 'none' }}
				/>
			</div>
		);
	}
}

export default SourceBar;