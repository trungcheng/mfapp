import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Dialog } from '@media/ui/dialog';
import Main from './Main';

@inject('store', 'imageCollageStore')
@observer
class Popup extends Component {
	static propTypes = {
		onClose: PropTypes.func
	}

	static defaultProps = {
		onClose() {}
	}

	constructor(props) {
		super(props);
	}

	render() {
		const { store, onClose } = this.props;
		const dialogConfig = {
			title: __('CHỈNH SỬA ẢNH'),
			width: window.innerWidth - 100,
			height: window.innerHeight - 100,
			showHeader: false,
			showFooter: false,
			showExpandButton: true,
			onClose(){
				onClose();
				store.mediaStore.mergeData = [];
			},
			onOpen(dialog) {
				store.imageCollageStore.dialog = dialog;
			}
		};

		return (
			<Dialog {...dialogConfig}>
				<Dialog {...dialogConfig}>
					<Main />
				</Dialog>
			</Dialog>
		);
	}
}

export default Popup;
