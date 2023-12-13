import { Component } from 'react';
import { observer, inject } from 'mobx-react';

import './styles/main.scss';

@inject('store', 'imageCollageStore')
@observer
class Preview extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { imageCollageStore } = this.props;

		return (
			<div styleName="collage-preview">
				<img src={imageCollageStore.canvas.toDataURL()} />
			</div>
		);
	}
}

export default Preview;