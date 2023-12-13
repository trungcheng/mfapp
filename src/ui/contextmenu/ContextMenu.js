import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { isObject, isArray } from 'coreutils-js';

import './style.scss';

class ContextMenu extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		width: PropTypes.number,
		height: PropTypes.number,
		useIcon: PropTypes.bool,
		visible: PropTypes.bool
	}

	static defaultProps = {
		useIcon: false,
		visible: true
	}

	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.renderChildren = this.renderChildren.bind(this);
	}

	handleClick(e) {
		const childNodes = this.refContextMenu.childNodes;

		childNodes.forEach(el => {
			if (el &&  el.tagName && el.tagName.toLowerCase() === 'div' && el.contains(e.target)) {
				this.refContextMenu.style.display = 'none';
			}
		});
	}

	renderChildren() {
		const { children, useIcon } = this.props;

		if (isObject(children)) {
			return cloneElement(
				children,
				{ useIcon }
			);
		} else if (isArray(children)) {
			return children.map((item, index) => (
				cloneElement(
					item,
					{
						useIcon,
						key: index
					}
				)
			));
		} else {
			return '';
		}
	}

	render() {
		const { id, width, height, visible } = this.props;

		const style = {
			width,
			height
		};

		if (!visible) {
			return '';
		}

		return (
			<div ref={c => this.refContextMenu = c}
				styleName="ui-contextmenu contextmenu-wrapper"
				style={style}
				id={id}
				onClick={this.handleClick}>
				{ this.renderChildren() }
			</div>
		);
	}
}

export default ContextMenu;