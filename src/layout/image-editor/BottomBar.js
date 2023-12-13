import { observer, inject } from 'mobx-react';
import { clsx } from 'coreutils-js';

import './style.scss';

import { Button } from '@media/ui/button';
import { FontAwesome } from '@media/ui/icons';

const BottomBar = (props) => {
	const { imageEditorStore } = props;

	return (
		<div styleName="bottom-bar">
			<div styleName="bottom-left">
				<div styleName="group-item">
					<button styleName={clsx('history', imageEditorStore.currentUndoStacks.length ? 'active' : 'disabled')}
						onClick={() => imageEditorStore.undo()}
					>
						<FontAwesome icon="far fa-undo"></FontAwesome>
						<span>Undo</span>
					</button>

					<button styleName={clsx('history', imageEditorStore.currentRedoStacks.length ? 'active' : 'disabled')}
						onClick={() => imageEditorStore.redo()}
					>
						<span>Redo</span>
						<FontAwesome icon="far fa-redo"></FontAwesome>
					</button>
				</div>
			</div>

			<div styleName="bottom-right">
				<div styleName="group-item">
					<Button
						onClick={() => imageEditorStore.onClose()}
					>
						{__('ĐÓNG')}
					</Button>
					<Button
						type="primary"
						onClick={() => {
							imageEditorStore.editorSave(imageEditorStore.onSave);
						}}
						disabled={imageEditorStore.sources.length === 0}
					>
						{__('LƯU')}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default inject('imageEditorStore')(observer(BottomBar));