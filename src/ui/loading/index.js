import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isDefined, isEmpty, isUndefined } from 'coreutils-js';
import { LoadingIcon } from '../icons';

import './style.scss';

class Loading extends Component {
	static propTypes = {
		bgColor: PropTypes.string,
		bgWidth: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		bgHeight: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		visible: PropTypes.bool,
		icon: PropTypes.string,
		iconColor: PropTypes.string,
		iconSize: PropTypes.number,
		text: PropTypes.string,
		textColor: PropTypes.string,
		textSize: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		strokeWidth: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		])
	};

	static defaultProps = {
		bgColor: null,
		bgWidth: '100%',
		bgHeight: '100%',
		visible: true,
		icon: 'ring',
		iconColor: null,
		iconSize: 50,
		text: null,
		textColor: '#666',
		textSize: 14,
		strokeWidth: null
	};

	constructor(props) {
		super(props);

		this.renderLoadingText = this.renderLoadingText.bind(this);
	}

	renderLoadingText() {
		const { text, textColor, textSize } = this.props;
		const styleText = {
			color: textColor,
			fontSize: textSize
		};

		if (!isEmpty(text) && !isUndefined(text)) {
			return (
				<div styleName="load-text" style={styleText}>{text}</div>
			);
		} else {
			return null;
		}
	}

	render() {
		const {
			children,
			bgColor,
			bgWidth,
			bgHeight,
			visible,
			icon,
			iconSize,
			iconColor,
			strokeWidth
		} = this.props;
		const styleLoader = {
			backgroundColor: bgColor,
			width: bgWidth,
			height: bgHeight
		};

		return (
			<div styleName="ui-loading">
				{
					visible ?
						<div styleName="loader" style={styleLoader}>
							<div styleName="load-icon">
								<LoadingIcon icon={icon}
									size={iconSize}
									color={iconColor}
									strokeWidth={strokeWidth}
								/>
							</div>

							{ this.renderLoadingText() }
						</div>
						: null
				}

				{isDefined(children) ? children : null}
			</div>
		);
	}
}

export default Loading;