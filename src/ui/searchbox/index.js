/* eslint-disable max-lines-per-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isArray, isFunction, isUndefined, isEmpty } from 'coreutils-js';

import './style.scss';

import DropList from '../droplist';
import { FontAwesome } from '../icons';

class SelectBox extends Component {
	static propTypes = {
		multiple: PropTypes.bool,
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
		width: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		height: PropTypes.number,
		dropWidth: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		dropHeight: PropTypes.number,
		isLoading: PropTypes.bool,
		disabled: PropTypes.bool,
		placeholder: PropTypes.string,
		isSearch: PropTypes.bool,
		isClearable: PropTypes.bool,
		onChange: PropTypes.func,
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
		emptyText: PropTypes.string,
		loadingText: PropTypes.string,
		ignoreValues: PropTypes.any,
		disableValues: PropTypes.any
	}

	static defaultProps = {
		multiple: false,
		data: [],
		value: null,
		width: '100%',
		height: 30,
		dropWidth: '100%',
		dropHeight: 300,
		isLoading: false,
		disabled: true,
		isSearch: false,
		isClearable: false,
		placeholder: __('Chọn giá trị'),
		onChange() {},
		fontSize: 13,
		boldLevel: [],
		noSelectLevel: [],
		emptyText: __('Không có dữ liệu'),
		loadingText: __('Đang tải...'),
		ignoreValues: [],
		disableValues: []
	}

	constructor(props) {
		super(props);

		this.unmouted = false;
		this.state = {
			data: [],
			loading: true,
			selecting: false,
			selectedItem: null,
			searching: false,
			searchKeyword: ''
		};

		this.loadData = this.loadData.bind(this);
		this.togleDropdown = this.togleDropdown.bind(this);
		this.eventOutClick = this.eventOutClick.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handeClear = this.handeClear.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	componentWillMount() {
		const { data } = this.props;

		this.loadData(data);
	}

	componentDidMount() {
		window.addEventListener('click', this.eventOutClick);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.eventOutClick);
		this.unmouted = true;
	}

	componentWillReceiveProps(nextProps) {
		if (!isUndefined(nextProps.value)) {
			this.setState({
				selectedItem: this.getSelectedItem(nextProps.value, this.state.data),
				searching: false
			});
		}

		if (this.props.isLoading !== nextProps.isLoading) {
			this.setState({
				loading: nextProps.isLoading
			});
		}

		if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
			this.loadData(nextProps.data);
		}
	}

	eventOutClick(e) {
		if ((!this.refSelectInput || !this.refSelectInput.contains(e.target))
			&& (!this.refDropDown || !this.refDropDown.contains(e.target))
		) {
			this.setState({
				selecting: false,
				searching: false,
				searchKeyword: ''
			});
		}
	}

	loadData(data) {
		if (isArray(data) && data.length > 0) {
			this.setState({
				data,
				loading: false,
				selectedItem: this.getSelectedItem(this.props.value, data)
			});
		} else if (isFunction(data)) {
			data()
				.then(data => {
					if (!this.unmouted) {
						this.setState({
							data,
							loading: false,
							selectedItem: this.getSelectedItem(this.props.value, data)
						});
					}
				})
				.catch(() => {
					if (!this.unmouted) {
						this.setState({
							data: [],
							loading: false
						});
					}
				});
		} else {
			this.setState({
				data: [],
				loading: false
			});
		}
	}

	togleDropdown(e) {
		const { selecting } = this.state;

		if ((!this.refClearButton || !this.refClearButton.contains(e.target))
			&& (!selecting || !this.refSelectInputBox || !this.refSelectInputBox.contains(e.target))
		) {
			this.setState({
				selecting: !selecting
			});
		}
	}

	handleSelect(val, childs) {
		const { onChange, multiple, value } = this.props;
		const { data } = this.state;

		if (multiple) {
			let values = [];

			if (isArray(value)) {
				data.forEach(item => {
					if (value.indexOf(item.value) !== -1) {
						values.push(item.value);
					}
				})
			} else {
				const currItem = data.find(i => i.value == value);

				if (currItem) values.push(value);
			}

			if (values.indexOf(val) === -1)
				values.push(val);

			onChange(values, childs);
		} else {
			this.setState({
				selecting: false,
				searching: false,
				searchKeyword: ''
			});

			const rawValue = data.find(d => d.value === val);

			onChange(val, childs, rawValue);
		}
	}

	handeClear() {
		const { onChange, multiple } = this.props;

		if (multiple) {
			onChange([], []);
		} else {
			onChange(null, []);
		}
	}

	handleSearch(e) {
		const value = e.target.value;

		this.setState({
			searching: true,
			searchKeyword: value
		});
	}

	getSelectedItem = (value, data) => {
		const { multiple } = this.props;

		if (multiple) {
			let arrValue = [];

			if (isArray(value)) {
				arrValue = value;
			} else {
				arrValue = [ value ];
			}

			return data.filter(d => arrValue.indexOf(d.value) !== -1);
		} else {
			if (!isUndefined(value) && isArray(data)) {
				const item = data.find(d => d.value === value);

				return item;
			}
		}

		return null;
	}

	handleRemoveValue = (val) => {
		const { value, multiple, onChange } = this.props;

		if (multiple) {
			const index = value.findIndex(i => i === val);

			if (!isUndefined(index)) {
				value.splice(index, 1);

				onChange(value);
			}
		}
	}

	renderSingle = () => {
		const {
			width,
			height,
			placeholder,
			isSearch,
			isLoading,
			isClearable,
			loadingText,
		} = this.props;
		const {
			loading,
			selecting,
			searching,
			searchKeyword,
			selectedItem
		} = this.state;
		let styleInput = {};

		if (selecting) {
			styleInput = {
				width,
				minHeight: height,
				borderBottom: 'none',
				borderBottomLeftRadius: 0,
				borderBottomRightRadius: 0,
				paddingBottom: 1,
				zIndex: 5
			};
		} else {
			styleInput = {
				width,
				minHeight: height
			};
		}

		return (
			<div styleName="selectbox-input selectbox-single"
				style={styleInput}
				onClick={this.togleDropdown}
				ref={(c) => this.refSelectInput = c}
			>
				{
					loading || isLoading ?
						<div styleName="input-value">
							<p styleName="placeholder">{loadingText}</p>
						</div>
						: null
				}

				{
					isSearch && (!loading && !isLoading) ?
						<input
							ref={(c) => this.refSelectInputBox = c}
							type="text"
							placeholder={placeholder}
							onChange={this.handleSearch}
							value={searching ? searchKeyword : (selectedItem ? selectedItem.label : '')}
						/>
						: null
				}

				{
					!isSearch && (!loading && !isLoading) ?
						<div styleName="input-value">
							{
								selectedItem ?
									selectedItem.label
									:
									<p styleName="placeholder">{placeholder}</p>
							}
						</div>
						: null
				}

				{
					selectedItem && !loading && !isLoading && isClearable ? 
						<div styleName="input-remove"
							ref={c => this.refClearButton = c}
							onClick={this.handeClear}>
							<FontAwesome icon="far fa-times" />
						</div>
						: null
				}

				<div styleName="input-toogle">
					<FontAwesome icon={(() => {
						if (loading)
							return 'far fa-spinner fa-spin';
						else if (selecting)
							return 'fal fa-search';

						return 'fal fa-search';
					})()} />
				</div>
			</div>
		);
	}

	renderMultiple = () => {
		const {
			value,
			width,
			height,
			placeholder,
			isSearch,
			isLoading,
			isClearable,
			loadingText,
		} = this.props;
		const {
			loading,
			selecting,
			selectedItem,
			searching,
			searchKeyword
		} = this.state;
		let styleInput = {};

		if (selecting) {
			styleInput = {
				width,
				minHeight: height,
				borderBottom: 'none',
				borderBottomLeftRadius: 0,
				borderBottomRightRadius: 0,
				paddingBottom: 1,
				zIndex: 5
			};
		} else {
			styleInput = {
				width,
				minHeight: height
			};
		}

		return (
			<div styleName="selectbox-input selectbox-multiple"
				style={styleInput}
				onClick={this.togleDropdown}
				ref={(c) => this.refSelectInput = c}
			>
				{
					loading || isLoading ?
						<div styleName="input-value">
							<p styleName="placeholder">{loadingText}</p>
						</div>
						: null
				}

				{
					!loading && !isLoading ?
						<div styleName="input-value">
							{
								selectedItem && selectedItem.length ?
									selectedItem.map(item => (
										<div key={item.value}
											styleName="value-item"
										>
											{item.label}

											<FontAwesome icon="far fa-times" onClick={() => this.handleRemoveValue(item.value)} />
										</div>
									))
								: null
							}

							{
								isSearch && !loading && !isLoading ?
									<input
										ref={(c) => this.refSelectInputBox = c}
										type="text"
										placeholder={placeholder}
										onChange={this.handleSearch}
										value={searching ? searchKeyword : ''}
									/>
									: null
							}

							{
								!isSearch && (!selectedItem || !selectedItem.length) && !loading && !isLoading ?
									<p styleName="placeholder">{placeholder}</p>
									: null
							}
						</div>
						: null	
				}



				{
					selectedItem && selectedItem.length && !loading && !isLoading && isClearable ? 
						<div styleName="input-remove"
							ref={c => this.refClearButton = c}
							onClick={this.handeClear}>
							<FontAwesome icon="far fa-times" />
						</div>
						: null
				}

				<div styleName="input-toogle">
					<FontAwesome icon={(() => {
						if (loading)
							return 'far fa-spinner fa-spin';
						else if (selecting)
							return 'fa fa-caret-up';

						return 'fa fa-caret-down';
					})()} />
				</div>
			</div>
		);
	}

	render() {
		const {
			multiple,
			width,
			height,
			dropHeight,
			dropWidth,
			fontSize,
			boldLevel,
			noSelectLevel,
			loadingText,
			emptyText,
			disableValues,
			ignoreValues,
			value
		} = this.props;
		const {
			data,
			selecting,
			searchKeyword
		} = this.state;

		return (
			<div styleName="ui-searchbox" style={{
				width,
				minHeight: height
			}}>
				{
					multiple ? this.renderMultiple() : this.renderSingle()
				}

				{
					selecting ? 
						<div styleName="selectbox-dropdown"
							style={{
								top: 'calc(100% - 1px)',
								maxHeight: dropHeight,
								width: dropWidth,
								borderTopRightRadius: dropWidth > width ? '3px' : 0
							}}
							ref={c => this.refDropDown = c}
						>
							<DropList
								multiple={multiple}
								fontSize={fontSize}
								keyword={searchKeyword}
								data={data}
								value={value}
								itemHeight={height}
								height={dropHeight}
								width={dropWidth}
								onSelect={this.handleSelect}
								boldLevel={boldLevel}
								noSelectLevel={noSelectLevel}
								emptyText={emptyText}
								loadingText={loadingText}
								disableValues={disableValues}
								ignoreValues={ignoreValues}
							/>
						</div>
						: null
				}
			</div>
		);
	}
}

export default SelectBox;
