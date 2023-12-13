import { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import Scrollbar from '@media/ui/scrollbar';
import { FontAwesome } from '../icons';

class Popup extends Component {
	static propTypes = {
		toolBar: PropTypes.any,
		title: PropTypes.string,
		children: PropTypes.any,
		open: PropTypes.bool,
		showCloseButton: PropTypes.bool,
		onClose: PropTypes.func,
		position: PropTypes.string
	};

	static defaultProps = {
		toolBar: null,
		title: null,
		children: null,
		open: false,
		showCloseButton: true,
		onClose() {},
		position: 'fixed'
	};

	constructor(props) {
		super(props);
	}

	handleClose = () => {
		const { onClose } = this.props;

		onClose();
	}

	render() {
		const { open, toolBar, title, children, showCloseButton, position } = this.props;

		return (
			<div styleName={`ui-popup ${open ? 'open' : ''}`}
				style={{
					position,
					zIndex: open ? 100 : -1
				}}
			>
				<div styleName="popup-content">
					<div styleName="content-header">
						<div styleName="title">{ title }</div>

						<div styleName="tool-bar">{ toolBar }</div>

						{
							showCloseButton && <div styleName="close" onClick={this.handleClose}>
								<FontAwesome icon="far fa-times" size="20px" />
							</div>
						}
					</div>
					<div styleName="content-body">
						<Scrollbar>
							{children}
						</Scrollbar>
					</div>
				</div>
			</div>
		);
	}
}

export default Popup;