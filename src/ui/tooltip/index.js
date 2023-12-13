import { Component, cloneElement, Fragment } from 'react';
import PropTypes from 'prop-types';
import { uuid } from 'coreutils-js';
import { findDOMNode } from 'react-dom';

import './style.scss';

class Tooltip extends Component {
	static propTypes = {
		content: PropTypes.string.isRequired,
		position: PropTypes.oneOf([
			'top',
			'bottom',
			'left',
			'right'
		]),
		trigger: PropTypes.oneOf([
			'hover',
			'click'
		]),
		visible: PropTypes.bool,
		top: PropTypes.number,
		left: PropTypes.number
	}
	
	static defaultProps = {
		content: '',
		position: 'top',
		trigger: 'hover',
		visible: true,
		top: 0,
		left: 0
	}

	constructor(props) {
		super(props);

		this.state = {
			id: uuid(),
			visibility: 'hidden',
			stylePosition: {}
		};

		this.calculatePosition = this.calculatePosition.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
	}

	componentDidMount() {
		this.handleRegister();
	}

	handleRegister() {
		const { trigger, visible } = this.props;
		const { id } = this.state;

		if (visible) {
			// const elRef = document.querySelector(`[data-tip="${id}"]`);
			const elRef = findDOMNode(this.refs[`tooltip-${id}`]);

			if (elRef) {
				if (trigger === 'click') {
					elRef.addEventListener('click', () => {
						if (this.state.visibility === 'hidden') {
							const clickHide = (e) => {
								if (!e.target.contains(elRef)) {
									this.setState({
										visibility: 'hidden'
									}, () => {
										window.removeEventListener('click', clickHide, false);
									});
								}
							};

							this.setState({
								visibility: 'visible',
								stylePosition: this.calculatePosition()
							}, () => {
								window.addEventListener('click', clickHide, false);
							});
						} else {
							this.setState({
								visibility: 'hidden'
							});
						}
					});
				} else {
					elRef.addEventListener('mouseover', () => {
						this.setState({
							visibility: 'visible',
							stylePosition: this.calculatePosition()
						});
					});

					elRef.addEventListener('mouseleave', () => {
						this.setState({
							visibility: 'hidden'
						});
					});
				}
			}
		}
	}

	calculatePosition() {
		const { position, top, left } = this.props;
		const { id } = this.state;
		let p = {};
		// const elRef = document.querySelector(`[data-tip="${id}"]`);
		const elRef = findDOMNode(this.refs[`tooltip-${id}`]);
		const elTooltip = document.getElementById(id);

		if (elTooltip && elRef) {
			const posRef = elRef.getBoundingClientRect();
			const posTooltip = elTooltip.getBoundingClientRect();

			if (position === 'left') {
				p = {
					top: `${posRef.top + (posRef.height / 2) + top}px`,
					left: `${posRef.left - posTooltip.width - 10 + left}px`,
					transform: 'translateY(-50%)'
				};
			} else if (position === 'right') {
				p = {
					top: `${posRef.top + (posRef.height / 2) + top}px`,
					left: `${posRef.left + posRef.width + 10 + left}px`,
					transform: 'translateY(-50%)'
				};
			} else if (position === 'bottom') {
				p = {
					top: `${posRef.top + posRef.height + 10 + top}px`,
					left: `${posRef.left + (posRef.width / 2) + left}px`,
					transform: 'translateX(-50%)'
				};
			} else {
				p = {
					top: `${posRef.top - posTooltip.height - 10 + top}px`,
					left: `${posRef.left + (posRef.width / 2) + left}px`,
					transform: 'translateX(-50%)'
				};
			}
		}

		return p;
	}

	render() {
		const { position, visible } = this.props;
		const { visibility, id, stylePosition } = this.state;
		const style = {
			visibility,
			...stylePosition
		};

		return (
			<Fragment>
				{
					cloneElement(
						this.props.children,
						{
							// 'data-tip': id,
							ref: `tooltip-${id}`
						}
					)
				}

				{
					visible ?
						<div styleName="ui-tooltip"
							id={id}
							style={style}
							data-position={position}
						>
							{this.props.content}
						</div>
						: ''
				}
			</Fragment>
		);
	}
}

export default Tooltip;