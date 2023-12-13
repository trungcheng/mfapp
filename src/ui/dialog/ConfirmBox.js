import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from './Dialog';
import { isString } from 'coreutils-js';

import './style.scss';

import { FontAwesome } from '../icons';

class ConfirmBox extends Component {
	static propTypes = {
		title: PropTypes.string,
		children: PropTypes.any,
		showIcon: PropTypes.bool,
		onClose: PropTypes.func,
		onConfirm: PropTypes.func,
		onOpen: PropTypes.func,
		onCancel: PropTypes.func
	}
	
	static defaultProps = {
		title: __('Xác nhận'),
		children: null,
		showIcon: true,
		onClose() {},
		onConfirm() {},
		close() {},
		onCancel() {}
	}

	constructor(props) {
		super(props);
	}

	render() {
		const {
			title,
			children,
			showIcon,
			onClose,
			onConfirm,
			onOpen,
			onCancel
		} = this.props;

		const dialogConfig = {
			title,
			width: 350,
			height: 'auto',
			footer: {
				[__('Đồng ý')](dialog) {
					dialog.close();
					onConfirm();
				},
				[__('Hủy')](dialog) {
					dialog.close();
					onCancel();
				}
			},
			onClose,
			onOpen
		};

		return (
			<Dialog {...dialogConfig}>
				<div styleName="dialog-confirm">
					{
						showIcon ?
							<div styleName="confirm-icon">
								<FontAwesome icon="fal fa-question-circle" />
							</div>
							: null
					}

					<div styleName="confirm-content">
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

export default ConfirmBox;