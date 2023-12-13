import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { replaceParams, isFunction, isEmpty } from 'coreutils-js';

import './style.scss';

import { FontAwesome } from '../icons';

class Paging extends Component {
	static propTypes = {
		page: PropTypes.number,
		size: PropTypes.number,
		total: PropTypes.number,
		label: PropTypes.string, // {{from}} {{to}} {{total}} {{pageIndex}} {{pageSize}} {{totalPage}}
		showLabel: PropTypes.bool,
		showIndex: PropTypes.bool,
		onChange: PropTypes.func
	};
	
	static defaultProps = {
		page: 1,
		size: 20,
		total: 0,
		emptyLabel: __('Không có dữ liệu'),
		label: __('{{from}} đến {{to}} trong tổng số {{total}}'),
		showLabel: true,
		showIndex: true,
		onChange() {}
	};

	constructor(props) {
		super(props);

		this.calculate = this.calculate.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.page !== nextProps.page
			&& this.props.showIndex === true) {
			this.refIndex.value = nextProps.page;
		}
	}

	calculate() {
		const { size, page, total, label } = this.props;
		const totalPage = Math.ceil(total / size);
		let disbalePrev = true;
		let disableNext = true;
		let disableIndex = true;
		const fromSize = (total > 0) ? ((page - 1) * size + 1) : 0;
		const toSize = (total > (page * size)) ? (page * size) : total;
		let text = __('Không có dữ liệu');

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

		return {
			fromSize,
			toSize,
			label: text,
			disbalePrev,
			disableNext,
			disableIndex
		};
	}

	handleChange(page) {
		const { total, size, onChange } = this.props;
		const totalPage = Math.ceil(total / size);
		let newPage = 1;
		
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
				onChange(newPage);
			}
		}
	}

	render() {
		const {
			showLabel,
			showIndex,
			total,
			size,
			page
		} = this.props;
		const {
			label,
			fromSize,
			toSize,
			disbalePrev,
			disableNext,
			disableIndex
		} = this.calculate();

		return (
			<div styleName="ui-paging">
				{
					showLabel &&
					<span styleName="page-label">
						{
							replaceParams(
								label,
								{
									fromSize,
									toSize,
									total,
									page,
									size
								}
							)
						}
					</span>
				}

				<button styleName={`page-prev ${disbalePrev ? 'disabled' : ''}`}
					onClick={() => this.handleChange(page - 1)}>
					<FontAwesome icon="fas fa-chevron-left" color="#999" />
				</button>

				{
					showIndex &&
					<input
						type="number"
						styleName={`page-index ${disableIndex ? 'disabled' : ''}`}
						defaultValue={page}
						onKeyPress={
							(e) => {
								if (e.which === 13) {
									this.handleChange(e.target.value);
								}
							}
						}
						ref={(c) => this.refIndex = c}
					/>
				}

				<button styleName={`page-next ${disableNext ? 'disabled' : ''}`}
					onClick={() => this.handleChange(page + 1)}>
					<FontAwesome icon="fas fa-chevron-right" color="#999" />
				</button>
			</div>
		);
	}
}

export default Paging;