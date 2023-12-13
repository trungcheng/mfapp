import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { uuid, isFunction, isObject, isEmpty, isArray, isUndefined } from 'coreutils-js';

import './style.scss';

import { FontAwesome } from '../icons';
import { Button } from '../button';
import Scrollbar from '../scrollbar';

let position = 1000;
const dialogRender = [];

class Dialog extends Component {
	static propTypes = {
		children: PropTypes.element,
		visible: PropTypes.bool,
		showHeader: PropTypes.bool,
		showFooter: PropTypes.bool,
		showCloseButton: PropTypes.bool,
		showExpandButton: PropTypes.bool,
		title: PropTypes.string,
		width: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		height: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		maxWidth: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		maxHeight: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		footer: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.func,
			PropTypes.element
		]),
		header: PropTypes.element,
		action: PropTypes.element,
		enableMove: PropTypes.bool,
		onClose: PropTypes.func,
		onExpand: PropTypes.func,
		onOpen: PropTypes.func
	}

	static defaultProps = {
		children: null,
		visible: true,
		showHeader: true,
		showFooter: true,
		showCloseButton: true,
		showExpandButton: false,
		title: '',
		width: '50%',
		height: '50%',
		maxWidth: null,
		maxHeight: null,
		footer: null,
		enableMove: true,
		onClose() {},
		onExpand() {},
		onOpen() {}
	}

	constructor(props) {
		super(props);

		const { width, height, visible } = this.props;

		this.id = uuid();
		position += 1;

		dialogRender.push({
			id: this.id,
			visible
		});

		this.state = {
			inited: false,
			isExpand: false,
			width,
			height,
			pWidth: null,
			pHeight: null,
			pTop: null,
			pLeft: null,
			styleOverflow: null,
			move: false,
			moveLeft: 0,
			moveTop: 0,
			isFullScreen: false
		};

		this.renderHeader = this.renderHeader.bind(this);
		this.renderFooter = this.renderFooter.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleExpand = this.handleExpand.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.eventEsc = this.eventEsc.bind(this);
		this.eventWindowResize = this.eventWindowResize.bind(this);
		this.updatePosition = this.updatePosition.bind(this);
	}

	componentDidMount() {
		const { onOpen, visible } = this.props;

		this.updatePosition();

		this.setState({
			inited: visible,
			styleOverflow: document.body.style.overflow
		}, () => {
			if (visible) {
				document.body.style.overflow = 'hidden';
			}
		});

		onOpen({
			close: this.handleClose,
			expand: this.handleExpand
		});

		window.addEventListener('keydown', this.eventEsc);
		window.addEventListener('resize', this.eventWindowResize);
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.eventEsc);
		window.removeEventListener('resize', this.eventWindowResize);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible !== this.props.visible) {
			const idx = dialogRender.findIndex(i => i.id === this.id);

			if (idx !== -1) {
				dialogRender[idx] = {
					id: this.id,
					visible: nextProps.visible
				};
			}

			if (nextProps.visible) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = this.state.styleOverflow;
			}
		}
	}

	eventEsc(e) {
		if (e.which === 27) {
			for (let i = dialogRender.length - 1; i >= 0; i--) {
				if (dialogRender[i].visible === true) {
					if (dialogRender[i].id === this.id) {
						this.handleClose();
					}
					break;
				}
			}
		}
	}

	eventWindowResize() {
		this.updatePosition();
	}

	updatePosition() {
		if (this.refDialog) {
			const pHeight = this.refDialog.offsetHeight;
			const pWidth = this.refDialog.offsetWidth;
			let pTop = this.state.pTop;
			let pLeft = this.state.pLeft;

			if (isEmpty(pTop)) {
				pTop = (window.innerHeight - pHeight) / 2;
			}

			if (isEmpty(pLeft)) {
				pLeft = (window.innerWidth - pWidth) / 2;
			}

			this.setState({
				pTop,
				pLeft,
				pHeight,
				pWidth
			});
		}
	}

	handleExpand() {
		const { onExpand, width, height } = this.props;
		const { isExpand, pTop, pLeft } = this.state;

		if (isExpand) {
			this.setState({
				isExpand: false,
				width,
				height,
				pTop: this.top,
				pLeft: this.left
			}, () => {
				onExpand(false);
			});
		} else {
			this.top = pTop;
			this.left = pLeft;

			this.setState({
				isExpand: true,
				width: '100%',
				height: '100%',
				pTop: 0,
				pLeft: 0
			}, () => {
				onExpand(true);
			});
		}
	}

	handleClose() {
		const { onClose } = this.props;
		const { styleOverflow } = this.state;

		document.body.style.overflow = styleOverflow;

		onClose();
	}

	handleMove(e, status) {
		const { enableMove } = this.props;
		const { isExpand, inited } = this.state;

		if (!enableMove) {
			return;
		}

		if (!inited) {
			this.updatePosition();
		}
		
		if (
			!isExpand &&
			(!this.refControl || !this.refControl.contains(e.target)) &&
			(!this.refHeaderCustom || !this.refHeaderCustom.contains(e.target))
		) {
			if (status === 'start') {
				this.setState({
					move: true,
					moveLeft: e.clientX,
					moveTop: e.clientY
				});

				const mouseup = () => {
					this.setState({
						move: false
					}, () => {
						window.removeEventListener('mouseup', mouseup, false);
					});
				};

				window.addEventListener('mouseup', mouseup, false);
			} else if (status === 'move' && this.state.move) {
				const {
					pTop,
					pLeft,
					pHeight,
					pWidth,
					moveTop,
					moveLeft
				} = this.state;
				let posTop = pTop - (moveTop - e.clientY);
				let posLeft = pLeft - (moveLeft - e.clientX);

				if (posTop < 0) {
					posTop = 0;
				} else if ((pHeight + posTop) > window.innerHeight &&
					posTop > pTop) {
					posTop = pTop;
				}

				if (posLeft < 0) {
					posLeft = 0;
				} else if ((pWidth + posLeft) > window.innerWidth &&
					posLeft > pLeft) {
					posLeft = pLeft;
				}

				this.setState({
					pTop: posTop,
					pLeft: posLeft,
					moveLeft: e.clientX,
					moveTop: e.clientY
				});
			} else if (status === 'end') {
				this.setState({
					move: false
				});
			}
		}
	}

	renderHeader() {
		const { title, showCloseButton, showExpandButton, header, enableMove, action } = this.props;
		const { isExpand } = this.state;

		return (
			<div styleName={`dialog-header ${enableMove ? 'enable-move' : ''}`}
				onMouseDown={(e) => this.handleMove(e, 'start')}
			>
				<div styleName="header-title">{ title }</div>

				{
					header &&
					<div styleName="header-custom"
						ref={c => this.refHeaderCustom = c}
					>
						{ header }
					</div>
				}

				{
					action &&
					<div styleName="header-action">
						{ action }
					</div>
				}

				<div styleName="header-control"
					ref={c => this.refControl = c}
				>
					{
						showExpandButton ?
							<button onClick={this.handleExpand}>
								<FontAwesome icon={isExpand ? 'fas fa-compress' : 'fas fa-expand'} size="18px"></FontAwesome>
							</button>
							: null
					}
					{
						showCloseButton ?
							<button onClick={this.handleClose}>
								<FontAwesome icon="fal fa-times" size="24px"></FontAwesome>
							</button>
							: null
					}
				</div>
			</div>
		);
	}

	renderFooter() {
		const { footer } = this.props;
		const dialog = {
			close: this.handleClose,
			expand: this.handleExpand
		};
		let footerComponent;

		if (isFunction(footer)) {
			footerComponent = footer(dialog);
		} else if (isObject(footer) && !isEmpty(footer)) {
			const buttonComponents = [];

			Object.keys(footer).forEach((buttonName, idx) => {
				const btnConfig = {
					type: 'success',
					size: 'default',
					bold: false
				};

				if (idx !== 0) {
					// btnConfig.outline = true;
					btnConfig.type = 'default';
				}

				buttonComponents.push(
					<Button
						key={idx}
						{...btnConfig}
						onClick={() => footer[buttonName](dialog)}>
						{buttonName}
					</Button>
				);
			});

			footerComponent = (
				<div styleName="footer-button">
					{ buttonComponents.reverse() }
				</div>
			);
		} else {
			footerComponent = footer;
		}

		return (
			<div styleName="dialog-footer">
				{footerComponent}
			</div>
		);
	}

	renderChildren = () => {
		const { children } = this.props;

		if (isUndefined(children) || isEmpty(children)) {
			return ('');
		} else if (isArray(children)) {
			return (
				children.map((item, idx) => cloneElement(
					item,
					{
						key: idx,
						dialog: {
							close: this.handleClose,
							expand: this.handleExpand
						}
					}
				))
			);
		} else {
			return (
				cloneElement(
					children,
					{
						dialog: {
							close: this.handleClose,
							expand: this.handleExpand
						}
					}
				)
			);
		}
	}

	render() {
		const { visible, showHeader, showFooter, enableMove, maxWidth, maxHeight, isMessage } = this.props;
		const { width, height, pTop, pLeft, isExpand } = this.state;

		if (!visible) return null;

		let style = {};

		if (isExpand) {
			style = {
				width: '100%',
				height: '100%',
				margin: 0
			};
		} else {
			style = {
				width,
				height,
				maxWidth,
				maxHeight
			};

			if (enableMove) {
				style = {
					...style,
					top: pTop,
					left: pLeft
				};
			} else {
				style = {
					...style,
					margin: '50px 0',
					// transform: 'translateX(-50%)',
    				// left: '50%'
				};
			}
		}

		return (
			<div styleName="ui-dialog" style={{ zIndex: position }}>
				<Scrollbar
					renderThumbVertical={
						({ style, ...props }) => (
							<div {...props}
								style={{
									...style,
									backgroundColor: '#000',
									opacity: 0.5,
									borderRadius: 3
								}}
							/>
						)
					}
				>
					<div styleName="dialog-wrapper">
						<div styleName="dialog-container"
							style={style}
							onMouseMove={(e) => this.handleMove(e, 'move')}
							ref={(c) => this.refDialog = c}
						>
							{ showHeader ? this.renderHeader() : null }

							<div styleName="dialog-main" style={{height: isMessage ? 'auto' : showHeader ? 'calc( 100% - 60px )' : '100%'}}>
								{ this.renderChildren() }
							</div>

							{ showFooter ? this.renderFooter() : null }
						</div>
					</div>
				</Scrollbar>
			</div>
		);
	}
}

export default Dialog;