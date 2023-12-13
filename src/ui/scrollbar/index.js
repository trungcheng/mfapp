import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { isBoolean, isFunction } from 'coreutils-js';
import PropTypes from 'prop-types';

class Scrollbar extends Component {
	static propTypes = {
		visible: PropTypes.bool,
		nativeRef: PropTypes.func
	}

	static defaultProps = {
		visible: true,
		nativeRef() {}
	}

	constructor(props) {
		super(props);
	}

	reset = () => {
		if (this.refScroll) {
			this.refScroll.scrollTop(0);
			this.refScroll.scrollLeft(0);
		}
	}

	render() {
		const { children, visible, nativeRef, ...props } = this.props;

		if (isBoolean(visible)) {
			props.visible = `${visible}`;
		}

		props.ref = c => {
			this.refScroll = c;
			
			if (isFunction(nativeRef)) {
				nativeRef(c);
			}
		}

		return (
			<Scrollbars {...props} >
				{ children }
			</Scrollbars>
		);
	}
}

export default Scrollbar;