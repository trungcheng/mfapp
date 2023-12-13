import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isString } from 'coreutils-js';

import './style.scss';

import Dialog from './Dialog';
import { LoadingIcon } from '../icons';

class WaitingBox extends Component {
	static propTypes = {
		title: PropTypes.string,
		onClose: PropTypes.func,
		onOpen: PropTypes.func,
		onCancel: PropTypes.func
	};
	
	static defaultProps = {
		title: __('Thông báo'),
		children: null,
		onClose() {},
		onOpen() {},
		onCancel() {}
	};

	constructor(props) {
		super(props);
	}

	render() {
		const {
			title,
			children,
			onClose,
			onOpen,
			onCancel
		} = this.props;

		const dialogConfig = {
			title,
			width: 350,
			height: 'auto',
			footer: {
				[__('Đóng')](dialog) {
					onCancel();
					dialog.close();
				}
			},
			onClose,
			onOpen
		};

		return (
			<Dialog {...dialogConfig}>
				<div styleName="dialog-waiting">
					<div styleName="waiting-icon">
						<LoadingIcon icon="spinner" color="#000" size={24} />
					</div>

					<div styleName="waiting-content">
						{
							isString(children) ?
								<span dangerouslySetInnerHTML={{
									__html: children
								}}></span>
								: children
						}
					</div>
				</div>
			</Dialog>
		);
	}
}

export default WaitingBox;