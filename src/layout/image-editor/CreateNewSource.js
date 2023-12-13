import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import './style.scss';

import { Dialog } from '@media/ui/dialog';
import { InputNumber } from '@media/ui/input';

@inject('imageEditorStore')
@observer
class CreateNewSource extends Component {
	static propTypes = {
		onCreate: PropTypes.func
	}

	static defaultProps = {
		onCreate() {}
	}

	constructor(props) {
		super(props);

		this.state = {
			width: 500,
			height: 500,
			showDialog: true
		};
	}

	handleChangeSize = (field, val) => {
		if (field == 'width') {
			this.setState({
				width: val
			});
		}
		else {
			this.setState({
				height: val
			});
		}
	}

	handleCreateEmptyImage = () => {
		const { width, height } = this.state;
		const x = document.createElement('CANVAS');

		x.setAttribute('width', width);
		x.setAttribute('height', height);
		x.style.backgroundColor = 'white';

		const ctx = x.getContext('2d');

		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, width, height);
		
		return x.toDataURL();
	}

	render() {
		const self = this;
		const { imageEditorStore } = this.props;
		const { showDialog, width, height } = this.state;

		const dialogConfig = {
			title: __('Tạo ảnh mới'),
			width: 400,
			height: 350,
			showFooter: true,
			showExpandButton: false,
			footer: {
				[__('TẠO')]() {
					const x = document.createElement('CANVAS');

					x.setAttribute('width', width);
					x.setAttribute('height', height);
					x.style.backgroundColor = 'white';

					const ctx = x.getContext('2d');

					ctx.fillStyle = 'white';
					ctx.fillRect(0, 0, width, height);

					imageEditorStore.init({
						sources: x.toDataURL()
					});

					self.setState({
						showDialog: false
					});
				},
				[__('Đóng')](dialog) {
					dialog.close();
					self.setState({
						showDialog: false
					});
				}
			},
			onClose() {
				imageEditorStore.onClose();
			}
		};

		if (!showDialog) {
			return null;
		}

		return (
			<Dialog {...dialogConfig}>
				<div styleName="create-source-wrapper">
					<div styleName="item">
						<div styleName="item-label">
							Chiều Rộng:
						</div>
						<div styleName="item-value">
							<InputNumber
								value={this.state.width}
								height={40}
								width={100}
								onChange={(val) => this.handleChangeSize('width', val)}
								min={0}
								max={1000}
							/>
							<span>PX</span>
						</div>
					</div>

					<div styleName="item">
						<div styleName="item-label">
							Chiều Cao:
						</div>
						<div styleName="item-value">
							<InputNumber
								value={this.state.height}
								height={40}
								width={100}
								onChange={(val) => this.handleChangeSize('height', val)}
								min={0}
								max={1000}
							/>
							<span>PX</span>
						</div>
					</div>
				</div>
			</Dialog>
		);
	}
}

export default CreateNewSource;
