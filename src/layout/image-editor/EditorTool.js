import { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import uploadLocal from '@media/common/upload-local';
import {
	isUrl,
	isImageBase64,
	isArray
} from 'coreutils-js';

import './style.scss';

import BottomBar from './BottomBar';
import { FontAwesome } from '@media/ui/icons';

class EditorTool extends Component {
	static propTypes = {
		panel: PropTypes.any,
		editor: PropTypes.any
	};

	static defaultProps = {
		panel: null,
		editor: null
	};

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

	renderUploadBox = () => (
		<div styleName="upload-box">
			<FontAwesome icon="fa fa-upload" />
			<label>
				<input
					type="file"
					accept="image/*"
					id="upload-editor"
					onChange={e => this.handleUpload(e)}
				/>

				{__('Chọn file...')}
			</label>
		</div>
	);

	renderEditor = () => {
		const { imageEditorStore, editor } = this.props;

		if (!imageEditorStore.initingEditor && !imageEditorStore.sources.length && imageEditorStore.allowAddSource) {
			return this.renderUploadBox();
		} else if (!imageEditorStore.initingEditor && imageEditorStore.currentSource) {
			return editor;
		} else {
			return null;
		}
	}

	render() {
		const { panel } = this.props;

		return (
			<div styleName="editor-tool">
				{
					panel && <div styleName="panel-wrapper">
						{ panel }
					</div>
				}

				<div styleName="main">
					<div styleName="editor-wrapper">
						{ this.renderEditor() }
					</div>

					<BottomBar />
				</div>
			</div>
		);
	}
}

export default inject('imageEditorStore')(observer(EditorTool));