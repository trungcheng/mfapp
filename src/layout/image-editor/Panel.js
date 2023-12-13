import PropTypes from 'prop-types';
import { isString } from 'coreutils-js';

import './style.scss';

import ScrollBar from '@media/ui/scrollbar';

const PanelWrapper = ({ title, header, footer, onScroll, children, scrollbarRef }) => (
	<div styleName="panel">
		{
			title && [
				<div key="0" styleName="title">{ title }</div>,
				<div key="1" styleName="splitter"></div>
			]
		}

		{
			header && <div styleName="header">{ header }</div>
		}

		<div styleName="content">
			<ScrollBar onScroll={ onScroll } nativeRef={scrollbarRef}>
				{ children }
			</ScrollBar>
		</div>

		{
			footer && [
				<div key="0" styleName="splitter"></div>,
				<div key="1" styleName="footer">{ footer }</div>
			]
		}
	</div>
);

PanelWrapper.propTypes = {
	title: PropTypes.string.isRequired,
	header: PropTypes.any,
	footer: PropTypes.any,
	children: PropTypes.any,
	onScroll: PropTypes.func,
	scrollbarRef: PropTypes.func
};

PanelWrapper.defaultProps = {
	title: '',
	header: null,
	children: null,
	footer: null,
	onScroll() {},
	scrollbarRef() {}
};

const PanelItem = ({ title, component, children }) => (
	<div styleName="panel-item">
		{
			title && <div styleName="item-title">
				<h4>{ title }</h4>
				{ isString(component) ? <p>{ component }</p> : component }
			</div>
		}

		<div styleName="item-content">
			{ children }
		</div>
	</div>
);

PanelItem.propTypes = {
	title: PropTypes.string.isRequired,
	component: PropTypes.element,
	children: PropTypes.any
};

PanelItem.defaultProps = {
	title: '',
	component: null,
	children: null
};

const PanelSplitter = () => (
	<div styleName="panel-splitter" />
);

const PanelButton = ({ children, onClick }) => (
	<button styleName="panel-button" onClick={onClick}>
		{ children }
	</button>
);

PanelButton.propTypes = {
	children: PropTypes.any,
	onClick: PropTypes.func
};

PanelButton.defaultProps = {
	children: null,
	onClick() {}
};

const SwitchField = ({ data, value, onClick }) => (
	<div styleName='switch-field'>
		{
			data.map((item, idx) => (
				<div styleName={`switch-item ${value === item.value ? 'active' : ''}`}
					key={idx}
					onClick={() => onClick(item.value)}
				>
					{ item.content }
				</div>
			))
		}
	</div>
);

SwitchField.propTypes = {
	data: PropTypes.array,
	value: PropTypes.any,
	onClick: PropTypes.func
};

SwitchField.defaultProps = {
	data: [],
	value: null,
	onClick() {}
};

const SwitchButton = ({ data, value, onClick, width }) => (
	<div styleName='switch-button'>
		{
			data.map((item, idx) => (
				<div styleName="switch-item"
					style={{
						width
					}}
					key={idx}
					onClick={() => onClick(item.value)}
				>
					<div styleName={`item-content ${value === item.value ? 'active' : ''}`}>
						{ item.content }
					</div>
				</div>
			))
		}
	</div>
);

SwitchButton.propTypes = {
	data: PropTypes.array,
	width: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	value: PropTypes.any,
	onClick: PropTypes.func
};

SwitchButton.defaultProps = {
	data: [],
	width: 'auto',
	value: null,
	onClick() {}
};

export {
	PanelWrapper,
	PanelItem,
	PanelSplitter,
	PanelButton,
	SwitchField,
	SwitchButton
};
