import { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class EditorArea extends Component {
	static propType = {
		children: PropTypes.any
	};

	static defaultProps = {
		children: null
	};

	constructor(props) {
		super(props);
	}
	
	componentDidMount(){
		const el = document.getElementsByClassName('m__editor-area')[0];
		el.style.width = `${this.refEditorArea.offsetWidth}px`;
		el.style.height = `${this.refEditorArea.offsetHeight}px`;
	}

	getSize = () => {
		let width = 0;
		let height = 0;

		if (this.refEditorArea) {
			width = this.refEditorArea.offsetWidth;
			height = this.refEditorArea.offsetHeight;
		}

		return {
			width,
			height
		};
	}
	
	render() {
		const { children } = this.props;

		return (
			<div styleName="editor-area"
				ref={ c => this.refEditorArea = c}
			>
				{ children }
			</div>
		);
	}
}

export default EditorArea;