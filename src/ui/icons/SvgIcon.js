import { Component, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';

import './svg-icon.scss';

class SvgIcon extends Component {
	static propTypes = {
		size: PropTypes.number,
		color: PropTypes.string,
		hoverColor: PropTypes.string,
		icon: PropTypes.element
	};

	static defaultProps = {
		size: 24,
		color: '#666',
		hoverColor: null,
		icon: null
	};

	constructor(props) {
		super(props);

		this.state = {
			activeColor: props.color
		};
	}

	componentWillReceiveProps(nextProps) {
		const { color } = this.props;

		if (color !== nextProps.color) {
			this.setState({
				activeColor: nextProps.color
			});
		}
	}

	render() {
		const { size, color, hoverColor, icon } = this.props;
		const { activeColor } = this.state;

		return (
			<div styleName="ui-svg-icon"
				style={{
					width: size,
					height: size
				}}
				onMouseOver={() => this.setState(
					{ activeColor: hoverColor || color })
				}
				onMouseLeave={() => this.setState({ activeColor: color })}
			>
				{
					isValidElement(icon) && cloneElement(icon, {
						color: activeColor,
						size
					})
				}
			</div>
		);
	}
}

export default SvgIcon;
