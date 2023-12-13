import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class ClickTrigger extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired
	}
	
	constructor(props) {
		super(props);

		this.handleClickMenu = this.handleClickMenu.bind(this);
		this.eventOutContextMenu = this.eventOutContextMenu.bind(this);
		this.eventOutClick = this.eventOutClick.bind(this);
	}

	componentDidMount() {
		window.addEventListener('contextmenu', this.eventOutContextMenu);
		window.addEventListener('click', this.eventOutClick);
	}

	componentWillUnmount() {
		window.removeEventListener('contextmenu', this.eventOutContextMenu);
		window.addEventListener('click', this.eventOutClick);
	}

	eventOutContextMenu(e) {
		if (this.refContextTrigger && 
			!this.refContextTrigger.contains(e.target)) {
			const { id } = this.props;
			const elClickMenu = document.querySelector(`#${id}`);

			if (elClickMenu) {
				elClickMenu.style.display = 'none';
			}
		}
	}

	eventOutClick(e) {
		const { id } = this.props;
		const elContextMenu = document.querySelector(`#${id}`);

		if (elContextMenu && !elContextMenu.contains(e.target) && this.refClickTrigger && !this.refClickTrigger.contains(e.target)) {
			elContextMenu.style.display = 'none';
		}
	}

	handleClickMenu(e) {
		e.preventDefault();

		const { id } = this.props;
		const elContextMenu = document.querySelector(`#${id}`);

		if (elContextMenu) {
			elContextMenu.style.display = 'block';
			
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;
			const elWidth = elContextMenu.offsetWidth;
			const elHeight = elContextMenu.offsetHeight;

			if(e.clientY + elHeight < windowHeight && e.clientX + elWidth < windowWidth) {
				elContextMenu.style.top = `${e.clientY}px`;
				elContextMenu.style.left = `${e.clientX}px`;
			}
			
			else if(e.clientY + elHeight > windowHeight && e.clientX + elWidth < windowWidth) {
				const top = windowHeight - elHeight;
				elContextMenu.style.top = `${top}px`;
				elContextMenu.style.left = `${e.clientX}px`;
			}

			else if(e.clientY + elHeight < windowHeight && e.clientX + elWidth > windowWidth) {
				const left = windowWidth - elWidth;
				elContextMenu.style.top = `${e.clientY}px`;
				elContextMenu.style.left = `${left}px`;
			}
			else {
				const top = windowHeight - elHeight;
				const left = windowWidth - elWidth;
				elContextMenu.style.top = `${top}px`;
				elContextMenu.style.left = `${left}px`;
			}
		}
	}

	render() {
		const { children, id } = this.props;

		return (
			<div styleName="ui-contextmenu contextmenu-trigger"
				onClick={this.handleClickMenu}
				ref={c => this.refClickTrigger = c}
				id={`clicktrigger-${id}`}
			>
				{ children }
			</div>
		);
	}
}

export default ClickTrigger;