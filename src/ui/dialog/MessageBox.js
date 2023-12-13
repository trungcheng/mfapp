import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isString } from 'coreutils-js';

import './style.scss';

import Dialog from './Dialog';
import { FontAwesome } from '../icons';

class MessageBox extends Component {
	static propTypes = {
		title: PropTypes.string,
		type: PropTypes.oneOf([
			'error',
			'warn',
			'success',
			'info'
		]),
		onClose: PropTypes.func,
		onOpen: PropTypes.func
	}
	
	static defaultProps = {
		title: __('Thông báo'),
		type: '',
		children: null,
		onClose() {},
		onOpen() {}
	}

	constructor(props) {
		super(props);

		this.getIcon = this.getIcon.bind(this);
	}

	getIcon() {
		const { type } = this.props;
		let icon = '';

		switch(type) {
			case 'error':
				icon = 'fal fa-exclamation-circle';
				break;
			case 'warn':
				icon = 'fal fa-exclamation-triangle';
				break;
			case 'info':
				icon = 'fal fa-info-circle';
				break;
			case 'success':
				icon = 'fal fa-check-circle';
				break;
		}

		return icon;
	}

	render() {
		const {
			title,
			children,
			onClose,
			type,
			onOpen
		} = this.props;

		const dialogConfig = {
			title,
			width: 350,
			height: 'auto',
			footer: {
				[__('Đóng')](dialog) {
					dialog.close();
				}
			},
			onClose,
			onOpen,
			isMessage: true
		};

		return (
			<Dialog {...dialogConfig}>
				<div styleName="dialog-message">
					{
						type ?
							<div styleName={`message-icon ${type}`}>
								<FontAwesome icon={this.getIcon()} />
							</div>
							: null
					}

					<div styleName="message-content">
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

export default MessageBox;