import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clone, removeUnicode, isArray, isFunction, isUndefined, isEmpty, isNumber, isObject } from 'coreutils-js';

import './style.scss';

import { FontAwesome } from '../icons';
import Scrollbar from '../scrollbar';

class DropList extends Component {
	static propTypes = {
		keyword: PropTypes.string,
		data: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.func
		]),
		value: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.number,
			PropTypes.string,
			PropTypes.array
		]),
		emptyText: PropTypes.string,
		loadingText: PropTypes.string,
		width: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		height: PropTypes.number,
		itemHeight: PropTypes.number,
		fontSize: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		boldLevel: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.array
		]),
		noSelectLevel: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.array
		]),
		disableValues: PropTypes.any,
		ignoreValues: PropTypes.any,
		onSelect: PropTypes.func,
		style: PropTypes.object
	}

	static defaultProps = {
		keyword: '',
		data: [],
		value: null,
		emptyText: __('Không có dữ liệu'),
		loadingText: __('Đang tải dữ liệu...'),
		width: '100%',
		height: 300,
		itemHeight: 30,
		fontSize: 11,
		boldLevel: [],
		noSelectLevel: [],
		disableValues: null,
		ignoreValues: [],
		onSelect() {},
		style: {}
	}

	constructor(props) {
		super(props);

		this.unmouted = false;
		this.state = {
			data: [],
			rawData: [],
			loading: true,
			showScrollbar: false,
			listHeight: 0
		};

		this.loadData = this.loadData.bind(this);
		this.buildData = this.buildData.bind(this);
		this.updateHeight = this.updateHeight.bind(this);
		this.renderData = this.renderData.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.getChildByParent = this.getChildByParent.bind(this);
	}

	componentWillMount() {
		this.loadData();
	}

	componentDidMount() {
		this.updateHeight();

		const target = document.getElementById(this.dropdownId);
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'style' &&
					window.getComputedStyle(target).getPropertyValue('display') === 'block'
				) {
					this.updateHeight();
				}
			});
		});

		if (target) {
			observer.observe(target, {
				attributes: true,
				attributeFilter: ['style']
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		this.handleSearch(nextProps.keyword);
	}

	loadData() {
		const { data, keyword } = this.props;

		if (isArray(data) && data.length > 0) {
			this.setState({
				data: this.buildData(data),
				rawData: data,
				loading: false
			}, () => {
				this.updateHeight();
				this.handleSearch(keyword);
			});
		} else if (isFunction(data)) {
			data()
				.then(data => {
					if (!this.unmouted) {
						this.setState({
							data: this.buildData(data),
							rawData: data,
							loading: false
						}, () => {
							this.updateHeight();
							this.handleSearch(keyword);
						});
					}
				})
				.catch(() => {
					if (!this.unmouted) {
						this.setState({
							data: [],
							rawData: [],
							loading: false
						}, () => {
							this.updateHeight();
						});
					}
				});
		} else {
			this.setState({
				data: [],
				rawData: [],
				loading: false
			}, () => {
				this.updateHeight();
			});
		}
	}

	buildData(data = []) {
		const { ignoreValues } = this.props;
		let list = [ ...data ];
		const map = {};
		const roots = [];
		let node, i;
		let ignores = [];

		if (isArray(ignoreValues)) {
			ignores = ignoreValues;
		} else if (!isUndefined(ignoreValues)) {
			ignores.push(ignoreValues);
		}

		list = list.filter(l => ignores.indexOf(l.value) === -1);

		for (i = 0; i < list.length; i += 1) {
			map[list[i].value] = i;
			list[i].children = [];
		}

		for (i = 0; i < list.length; i += 1) {
			node = list[i];

			if (!isUndefined(node.parent) && !isEmpty(node.parent) &&
				node.parent != 0) {
				if (!isUndefined(list[map[node.parent]])) {
					list[map[node.parent]].children.push(node);
				}
			} else {
				roots.push(node);
			}
		}

		return roots;
	}

	getChildByParent(parent) {
		const { data } = this.props;
		const allValue = [];

		if (isArray(data)) {
			data.forEach(item => {
				if (isObject(item) && !isUndefined(item.value)) {
					if (item.parent == parent) {
						allValue.push(item.value);
					}
				}
			});
		}

		return allValue;
	}

	updateHeight() {
		const { height } = this.props;

		if (this.refDropList) {
			const scrollHeight = this.refDropList.scrollHeight;

			if (scrollHeight > height) {
				this.setState({
					listHeight: height,
					showScrollbar: true
				});
			} else {
				this.setState({
					listHeight: scrollHeight,
					showScrollbar: false
				});
			}
		} else {
			this.setState({
				listHeight: 'auto',
				showScrollbar: false
			});
		}
	}

	handleSelect(val) {
		const { onSelect } = this.props;
		const childs = this.getChildByParent(val);

		onSelect(val, childs);
	}

	handleSearch(keyword) {
		const { rawData } = this.state;
		let searchData = [ ...rawData ];

		if (keyword) {
			const inputVal = removeUnicode(keyword.toLowerCase());

			searchData = rawData.filter(item => {
				let inputItem;
				if (item.label.props) {
					inputItem = removeUnicode(item.label.props.children.toLowerCase());
				} else {
					inputItem = removeUnicode(item.label.toLowerCase());
				}

				return inputItem.search(inputVal) !== -1;
			});
		}

		const findParent = (parentVal) => {
			const node = rawData.find(i => i.value === parentVal);

			if (node) {
				const index = searchData.findIndex(i => i.value === node.value);

				if (index === -1) {
					searchData.push(node);
				}
			}
		};

		searchData.forEach(node => {
			if (!isUndefined(node.parent) && !isEmpty(node.parent) &&
					node.parent != 0) {
				findParent(node.parent);
			}
		});

		this.setState({
			data: this.buildData(searchData)
		}, () => {
			if (this.refScrollBar) {
				this.refScrollBar.reset();
			}
			
			this.updateHeight();
		});
	}

	renderData(list, level = 1) {
		if (isArray(list) && !isEmpty(list)) {
			const {
				itemHeight,
				value,
				fontSize,
				boldLevel,
				noSelectLevel,
				disableValues,
				style
			} = this.props;
			const template = [];
			let classes = '';
			const values = [];

			if (isArray(value)) {
				list.forEach(item => {
					if (value.indexOf(item.value) !== -1) {
						values.push(item.value);
					}
				});
			} else {
				const currItem = list.find(i => i.value == value);

				if (currItem) values.push(value);
			}

			if (isNumber(boldLevel) && boldLevel == level) {
				classes += ' is-bold';
			} else if (isArray(boldLevel) && boldLevel.indexOf(level) !== -1) {
				classes += ' is-bold';
			}

			if (isNumber(noSelectLevel) && noSelectLevel == level) {
				classes += ' no-select';
			} else if (isArray(noSelectLevel)
				&& noSelectLevel.indexOf(level) !== -1) {
				classes += ' no-select';
			}

			const styleItem = {
				minHeight: itemHeight,
				paddingLeft: (level - 1) * 15 + 10,
				fontSize,
				...style
			};
			
			list.forEach(item => {
				let classesItem = '';
				let classesActive = classes;
				
				if (disableValues === item.value) {
					classesItem += ' disabled';
				} else if (isArray(disableValues)
					&& disableValues.indexOf(item.value) !== -1) {
					classesItem += ' disabled';
				}

				if (item.noSelect === true) {
					classesActive += ' no-select';
				}

				if (item.bold === true) {
					classesActive += ' is-bold';
				}

				if (item.disabled === true) {
					classesActive += ' disabled';
				}
				
				template.push(
					<div styleName={`droplist-item${classesItem}`}
						key={item.value}>
						<p style={styleItem}
							onClick={() => this.handleSelect(item.value)}
							styleName={`${values.indexOf(item.value) !== -1 ? 'selected' : ''}${classesActive}`}>
							<span styleName="droplist-item-label">{ item.label }</span>

							{
								item.description ? <span styleName="droplist-item-desc">{item.description}</span> : null
							}
						</p>

						{ this.renderData(item.children, level + 1) }
					</div>
				);
			});

			return (
				<div id="dropdown-wrapper" ref={level === 1 ? (c) => this.refDropList = c : ''}>
					{template}
				</div>
			);
		} else {
			return null;
		}
	}

	render() {
		const { data, loading, showScrollbar, listHeight } = this.state;
		const {
			emptyText,
			loadingText,
			width,
			fontSize,
			style
		} = this.props;

		return (
			<div styleName="ui-droplist-v2"
				style={{
					width,
					height: listHeight ? listHeight : null
				}}>
				{
					loading ?
						<div styleName="droplist-loading" style={{fontSize}}>
							<FontAwesome icon="far fa-spinner fa-spin" /> {loadingText}
						</div>
						: null
				}

				{
					!loading && data.length <= 0 ?
						<div styleName="droplist-empty" style={{
							fontSize,
							...style
						}}>
							{emptyText}
						</div>
						: null
				}

				{
					!loading && data.length > 0 ?
						<Scrollbar visible={!showScrollbar}
							ref={c => this.refScrollBar = c}>
							{ this.renderData(data) }
						</Scrollbar>
						:
						null
				}
			</div>
		);
	}
}

export default DropList;