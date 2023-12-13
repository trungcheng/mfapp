import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'coreutils-js';
import config from '@media/config';

import './fontawesome.scss';

class FontAwesome extends Component {
	static propTypes = {
		icon: PropTypes.string.isRequired,
		size: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		color: PropTypes.string,
		onClick: PropTypes.func
	}

	static defaultProps = {
		onClick() {}
	}
	
	constructor(props) {
		super(props);
	}

	render() {
		const {
			icon,
			size,
			color,
			onClick,
			style
		} = this.props;
		const newIcon = icon.split(/[ ]{1,}/g).map(i => {
			if (!isEmpty(i)) {
				return config.cssPrefix + i;
			}

			return '';
		});

		return (
			<i className={newIcon.join(' ')}
				style={{
					fontSize: size,
					color,
					...style
				}}
				onClick={onClick}
			/>
		);
	}
}

export default FontAwesome;