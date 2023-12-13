/* eslint-disable max-lines-per-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isArray, isFunction, isUndefined, isEmpty } from 'coreutils-js';

import './style.scss';

import DropList from '../droplist-v2';
import { FontAwesome } from '../icons';
import { SvgIcon } from '@media/ui/icons';
import { 
	ArrowDownIcon, 
	ArrowUpIcon,
	TextLineHeightIcon, 
	TextSpacingIcon,
	BoldFontIcon, 
	ItalicFontIcon, 
	UnderlineFontIcon, 
	AlignLeftIcon, 
	AlignMiddleIcon, 
	AlignRightIcon 
} from '@media/ui/icons/svgs';

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
		borderRadius: PropTypes.oneOfType([
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
		disableValues: PropTypes.any,
		style: PropTypes.object
	}

	static defaultProps = {
		multiple: false,
		data: [],
		value: null,
		width: '100%',
		height: 25,
		borderRadius: 4,
		dropWidth: '100%',
		dropHeight: 300,
		isLoading: false,
		disabled: false,
		isSearch: false,
		isClearable: false,
		placeholder: __('Chọn giá trị'),
		onChange() {},
		fontSize: 11,
		boldLevel: [],
		noSelectLevel: [],
		emptyText: __('Không có dữ liệu'),
		loadingText: __('Đang tải...'),
		ignoreValues: [],
		disableValues: [],
		style: {}
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

		// if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
		// 	this.loadData(nextProps.data);
		// }
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
		const { disabled } = this.props;

		if ((!this.refClearButton || !this.refClearButton.contains(e.target))
			&& (!selecting || !this.refSelectInputBox || !this.refSelectInputBox.contains(e.target))
			&& !disabled
		) {
			this.setState({
				selecting: !selecting
			});
		}
	}

	handleSelect(val, childs) {
		const { onChange, multiple, value, disabled } = this.props;
		const { data } = this.state;

		if (disabled) return;

		if (multiple) {
			const values = [];

			if (isArray(value)) {
				data.forEach(item => {
					const currItem = value.find(val => item.value == val);

					if (currItem) values.push(item.value);
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

			const rawValue = data.find(d => d.value == val);

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

			return data.filter(d => arrValue.indexOf(d.value) != -1);
		} else {
			if (!isUndefined(value) && isArray(data)) {
				const item = data.find(d => d.value == value);

				return item;
			}
		}

		return null;
	}

	handleRemoveValue = (val) => {
		const { value, multiple, onChange } = this.props;

		if (multiple) {
			const index = value.findIndex(i => i == val);

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
			borderRadius,
			style
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
				borderTopLeftRadius: borderRadius,
				borderTopRightRadius: borderRadius,
				borderBottomLeftRadius: 0,
				borderBottomRightRadius: 0,
				paddingBottom: 1,
				zIndex: 5,
				...style
			};
		} else {
			styleInput = {
				width,
				minHeight: height,
				borderRadius,
				...style
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
							value={searching ? searchKeyword : (selectedItem ? ((selectedItem.label.props) ? selectedItem.label.props.children : selectedItem.label) : '')}
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

				<div styleName="input-toogle" onClick={this.togleDropdown}>
					<SvgIcon icon={(() => {
						if (loading)
							return 'far fa-spinner fa-spin';
						else if (selecting)
							return <ArrowUpIcon />;

						return <ArrowDownIcon />;
					})()} size={10} color="#666" />
				</div>
			</div>
		);
	}

	renderMultiple = () => {
		const {
			width,
			height,
			placeholder,
			isSearch,
			isLoading,
			isClearable,
			loadingText,
			borderRadius,
			style
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
				borderTopLeftRadius: borderRadius,
				borderTopRightRadius: borderRadius,
				borderBottomLeftRadius: 0,
				borderBottomRightRadius: 0,
				paddingBottom: 1,
				zIndex: 5,
				...style
			};
		} else {
			styleInput = {
				width,
				minHeight: height,
				borderRadius,
				...style
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
			value,
			borderRadius,
			style,
			disabled
		} = this.props;
		const {
			data,
			selecting,
			searchKeyword
		} = this.state;

		return (
			<div styleName="ui-selectbox-v2" style={{
				width,
				minHeight: height
			}}>
				{
					multiple ? this.renderMultiple() : this.renderSingle()
				}

				{
					selecting && !disabled ? 
						<div styleName="selectbox-dropdown"
							style={{
								top: 'calc(100% - 1px)',
								maxHeight: dropHeight,
								width: dropWidth,
								borderRadius,
								borderTopLeftRadius: 0,
								borderTopRightRadius: dropWidth > width ? borderRadius : 0
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
								style={style}
							/>
						</div>
						: null
				}
			</div>
		);
	}
}

export default SelectBox;