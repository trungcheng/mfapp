import { Component } from 'react';
import { clsx } from 'coreutils-js';
import { observer, inject } from 'mobx-react';

import './styles/main.scss';

import { SvgIcon } from '@media/ui/icons';
import { TextSquareIcon, StarAltIcon, BackgroundIcon } from '@media/ui/icons/svgs';
import TextPanel from './panel/Text';
import BackgroundPanel from './panel/Background';
import IconPanel from './panel/Icon';

const menus = [
	{
		name: 'text',
		label: 'Văn bản',
		icon: <SvgIcon icon={<TextSquareIcon />} color="#999" />,
		component: <TextPanel />
	},
	{
		name: 'icon',
		label: 'Biểu tượng',
		icon: <SvgIcon icon={<StarAltIcon />} color="#999" />,
		component: <IconPanel />
	},
	{
		name: 'background',
		label: 'Hình nền',
		icon: <SvgIcon icon={<BackgroundIcon />} color="#999" />,
		component: <BackgroundPanel />
	}
];

@inject('store', 'imageCollageStore')
@observer
class MenuBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			menuActived: null
		};
	}

	handleToogleMenu = (menuName) => {
		const { menuActived } = this.state;

		if (menuName == menuActived) {
			this.setState({
				menuActived: null
			});
		} else {
			this.setState({
				menuActived: menuName
			});
		}
	}

	renderMenu = () => {
		const { menuActived } = this.state;

		return menus.map(menu => (
			<div key={menu.name}
				styleName={clsx('menu-item', menuActived == menu.name && 'actived')}
				onClick={() => this.handleToogleMenu(menu.name)}
			>
				<div styleName="item-icon">
					{ menu.icon }
				</div>

				<div styleName="item-label">
					{ menu.label }
				</div>
			</div>
		));
	}

	renderPanel = () => {
		const { menuActived } = this.state;

		return menus.map(menu => (
			<div key={menu.name}
				styleName="panel"
				style={{
					display: menuActived == menu.name ? 'block' : 'none'
				}}
			>
				{ menu.component }
			</div>
		));
	}

	render() {
		return (
			<div styleName="collage-menu">
				<div styleName="menubar">
					{ this.renderMenu() }
				</div>

				{ this.renderPanel() }
			</div>
		);
	}
}

export default MenuBar;