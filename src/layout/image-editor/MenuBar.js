import { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import { FontAwesome } from '@media/ui/icons';
import Tooltip from '@media/ui/tooltip';

class MenuBar extends Component {
	static propTypes = {
		active: PropTypes.string,
		data: PropTypes.array,
		onSelect: PropTypes.func
	}

	static defaultProps = {
		active: null,
		data: [],
		onSelect() {}
	}

	constructor(props) {
		super(props);
	}

	render() {
		const { data, active, onSelect } = this.props;

		return (
			<div styleName="menu-bar">
				{
					data.map((item, idx) => (
						<div key={idx}
							styleName={`menu-item ${active === item.name ? 'active' : ''}`}
							onClick={() => onSelect(item.name, item.component)}
						>
							<Tooltip content={item.label} position="right">
								<FontAwesome icon={item.icon} />
							</Tooltip>
						</div>
					))
				}
			</div>
		);
	}
}

export default MenuBar;