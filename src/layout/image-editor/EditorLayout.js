import { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import './style.scss';

import SourceBar from './SourceBar';
import Loading from '@media/ui/loading';
import CreateNewSource from './CreateNewSource';

class EditorLayout extends Component {
	static propTypes = {
		menu: PropTypes.any,
		tool: PropTypes.any
	};

	static defaultProps = {
		menu: null,
		tool: null
	};

	constructor(props) {
		super(props);
	}

	render() {
		const { imageEditorStore, menu, tool } = this.props;

		return (
			<Loading
				visible={imageEditorStore.loadingEditor || imageEditorStore.initingEditor}
				icon="spinner"
				iconColor={imageEditorStore.initingEditor ? '#fff' : '#fff'}
				bgColor={ imageEditorStore.initingEditor ? '#222' : 'rgba(0,0,0,.5)'}
				text={imageEditorStore.initingEditor ? __('Đang nạp dữ liệu...') : ''}
			>
				{
					!imageEditorStore.initingEditor &&
					imageEditorStore.sources.length == 0 &&
					<CreateNewSource />
				}
				
				<div styleName="image-editor">
					{
						menu && <div styleName="menu-wrapper">
							{ menu }
						</div>
					}

					{
						tool && <div styleName="tool-wrapper">
							{ tool }
						</div>
					}

					{ (imageEditorStore.sources.length > 1 || imageEditorStore.allowAddSource) && <SourceBar /> }
				</div>
			</Loading>
		);
	}
}

export default inject('imageEditorStore')(observer(EditorLayout));
