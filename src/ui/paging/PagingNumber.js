import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { replaceParams, isFunction, isEmpty } from 'coreutils-js';

import './style.scss';

import { FontAwesome } from '../icons';

class Paging extends Component {
	static propTypes = {
		page: PropTypes.number,
		size: PropTypes.number,
		total: PropTypes.number,
		onChange: PropTypes.func,
		color: PropTypes.string,
		activeColor: PropTypes.string,
		showLabel: PropTypes.bool,
		fromIndex: PropTypes.any
	};
	
	static defaultProps = {
		page: 1,
		size: 20,
		total: 0,
		emptyLabel: __('Không có dữ liệu'),
		label: __('Hiển thị {{from}}-{{to}} / {{total}}'),
		onChange() {},
		color: '#666',
		activeColor: '#EB5757',
		showLabel: false,
		fromIndex: null
	};

	constructor(props) {
		super(props);
	}

	calculate = () => {
		const { size, page, total, label, emptyLabel, fromIndex } = this.props;
		let totalPage = Math.ceil(total / size);
		if(fromIndex) {
			totalPage = page + Math.floor((total - fromIndex) / size); 
		}
		let disbalePrev = true;
		let disableNext = true;
		let disableIndex = true;
		let fromSize = (total > 0) ? ((page - 1) * size + 1) : 0;
		let toSize = (total > (page * size)) ? (page * size) : total;
		if(fromIndex) {
			fromSize = fromIndex;
			toSize = total > (fromIndex + size - 1) ? (fromIndex + size - 1) : total;
		}
		let text = emptyLabel;
		const displayPages = [];

		if (total > 0) text = replaceParams(
			label,
			{
				from: fromSize,
				to: toSize,
				total,
				pageIndex: page,
				pageSize: size,
				totalPage
			}
		);

		if (page > 1) {
			disbalePrev = false;
		} else {
			disbalePrev = true;
		}

		if (page < totalPage) {
			disableNext = false;
		} else {
			disableNext = true;
		}

		if (totalPage <= 1) {
			disableIndex = true;
		} else {
			disableIndex = false;
		}

		if (totalPage <= 3) {
			for (let i = 1; i <= totalPage; i++) {
				displayPages.push(i);
			}
		} else if (page - 1 > 0) {
			displayPages.push(page - 1, page);

			if (page + 1 <= totalPage) {
				displayPages.push(page + 1);
			} else {
				displayPages.unshift(page - 2);
			}
		} else {
			displayPages.push(page);

			if (page + 1 <= totalPage) {
				displayPages.push(page + 1);
			}

			if (page + 2 <= totalPage) {
				displayPages.push(page + 2);
			}
		}

		return {
			fromSize,
			toSize,
			label: text,
			disbalePrev,
			disableNext,
			disableIndex,
			totalPage,
			displayPages
		};
	}

	handleChange = (page) => {
		const { total, size, onChange, fromIndex } = this.props;
		const totalPage = Math.ceil(total / size);
		let newPage = 1;
		let newFromIndex = null;
		
		if (!isEmpty(page) && !isNaN(page)) {
			newPage = parseInt(page);

			if (newPage < 1) {
				newPage = 1;
			} else if (newPage > totalPage) {
				newPage = totalPage;
			}
		}

		if (newPage !== this.props.page) {
			if (isFunction(onChange)) {
				if(fromIndex) {
					if(this.props.page > newPage) {
						newFromIndex = (page-1) * size + 1;
					}
					else {
						newFromIndex = fromIndex + size * (page - this.props.page);
					}
				}
				onChange(newPage, newFromIndex);
			}
		}
	}

	renderNumber = () => {
		const {
			page,
			color,
			activeColor,
			fromIndex
		} = this.props;
		const {
			totalPage,
			displayPages
		} = this.calculate();
		const templates = [];

		if (page > 1) {
			templates.push(
				<div styleName="page-number">
					<FontAwesome onClick={() => this.handleChange(1)} icon="fas fa-backward" color={color} size={11}/>
				</div>
			);
		} else {
			templates.push(
				<div styleName="page-number page-disabled">
					<FontAwesome icon="fas fa-backward" color={color} size={11}/>
				</div>
			);
		}

		if (page > 1) {
			templates.push(
				<div styleName="page-number">
					<FontAwesome onClick={() => this.handleChange(page - 1)} icon="fas fa-caret-left" color={color}/>
				</div>
			);
		} else {
			templates.push(
				<div styleName="page-number page-disabled">
					<FontAwesome icon="fas fa-caret-left" color={color}/>
				</div>
			);
		}

		if (page > 2 && totalPage > 3) {
			templates.push(
				<div styleName="page-number" style={{ color }}>...</div>
			);
		}

		displayPages.forEach(p => {
			templates.push(
				<div styleName="page-number"
					style={{
						color: page == p ? activeColor : color,
						fontWeight: page == p ? 'bold' : 'normal'
					}}
					onClick={() => this.handleChange(p)}>
					{p}
				</div>
			);
		});

		if (totalPage - 2 >= page && totalPage > 3) {
			templates.push(
				<div styleName="page-number">
					<div styleName="page-number" style={{ color }}>...</div>
				</div>
			);
		}

		if (totalPage > page) {
			templates.push(
				<div styleName="page-number">
					<FontAwesome onClick={() => this.handleChange(page + 1)} icon="fas fa-caret-right" color={color}/>
				</div>
			);
		} else {
			templates.push(
				<div styleName="page-number page-disabled">
					<FontAwesome icon="fas fa-caret-right" color={color}/>
				</div>
			);
		}

		if (totalPage > page) {
			templates.push(
				<div styleName="page-number">
					<FontAwesome onClick={() => this.handleChange(totalPage)} icon="fas fa-forward" color={color} size={11}/>
				</div>
			);
		} else {
			templates.push(
				<div styleName="page-number page-disabled">
					<FontAwesome icon="fas fa-forward" color={color} size={11}/>
				</div>
			);
		}

		return templates.map((item, idx) => cloneElement(item , { key: idx }));
	}

	render() {
		const { showLabel, color } = this.props;
		const { label, totalPage } = this.calculate();

		return (
			<div styleName="ui-paging paging-number">
				{ (showLabel || totalPage === 0) && <span styleName="page-label" style={{color}}>{ label }</span> }
				{ this.renderNumber() }
			</div>
		);
	}
}

export default Paging;