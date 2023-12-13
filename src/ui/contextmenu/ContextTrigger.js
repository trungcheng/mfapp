import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class ContextTrigger extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired
	}
	
	constructor(props) {
		super(props);

		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.eventOutContextMenu = this.eventOutContextMenu.bind(this);
		this.eventOutClick = this.eventOutClick.bind(this);
	}

	componentDidMount() {
		window.addEventListener('contextmenu', this.eventOutContextMenu);
		window.addEventListener('click', this.eventOutClick);
	}

	componentWillUnmount() {
		window.removeEventListener('contextmenu', this.eventOutContextMenu);
		window.removeEventListener('click', this.eventOutClick);
	}

	eventOutContextMenu(e) {
		if (this.refContextTrigger && 
			!this.refContextTrigger.contains(e.target)) {
			const { id } = this.props;
			const elContextMenu = document.querySelector(`#${id}`);

			if (elContextMenu) {
				elContextMenu.style.display = 'none';
			}
		}
	}

	eventOutClick(e) {
		const { id } = this.props;
		const elContextMenu = document.querySelector(`#${id}`);
		const elClickTrigger = document.querySelector(`#clicktrigger-${id}`);

		if (elContextMenu && !elContextMenu.contains(e.target) && elClickTrigger && !elClickTrigger.contains(e.target)) {
			elContextMenu.style.display = 'none';
		}
	}

	handleContextMenu(e) {
		const { id } = this.props;
		e.preventDefault();

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
			<div
				styleName="ui-contextmenu contextmenu-trigger"
				onContextMenu={this.handleContextMenu}
				ref={c => this.refContextTrigger = c}
				id={`conexttrigger-${id}`}
			>
				{ children }
			</div>
		);
	}
}

export default ContextTrigger;