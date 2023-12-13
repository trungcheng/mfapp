import { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { buildSvg } from '@media/common/utils';

import '../styles/panel.scss';

import { SvgIcon } from '@media/ui/icons';
import { SearchIconV2 } from '@media/ui/icons/svgs';
import { FontAwesome, LoadingIcon } from '@media/ui/icons';
import Loading from '@media/ui/loading';
import Scrollbar from '@media/ui/scrollbar';

@inject('svgStore', 'imageCollageStore')
@observer
class IconPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			folders: [],
			keyword: ''
		};
	}

	componentWillMount() {
		this.loadFolders();
	}

	loadFolders = () => {
		const { svgStore } = this.props;
		const { keyword } = this.state;

		this.setState({
			loading: true
		});

		svgStore.getListSvgFolder({
			keyword,
			search_mode: 1,
			page_size: 9999
		})
			.then(data => {
				this.setState({
					loading: false,
					folders: data.data.map(folder => {
						return {
							id: folder.id,
							name: folder.name,
							initing: true,
							loading: false,
							data: [],
							total: 0,
							page_index: 1,
							page_size: 9
						};
					})
				});
			})
			.catch(err => {
				console.error(err);

				this.setState({
					loading: false
				});
			});
	}

	loadSvgs = (folderId) => {
		const { svgStore } = this.props;
		const { folders, keyword } = this.state;
		const folder = folders.find(f => f.id == folderId);

		if (folder) {
			if (!folder.initing) {
				folder.loading = true;

				this.setState({
					folders
				});
			}

			svgStore.getListSvg({
				folder_id: folderId,
				page_size: folder.page_size,
				page_index: folder.page_index,
				keyword
			})
				.then(data => {
					folder.loading = false;
					folder.initing = false;
					folder.data = [ ...(folder.data || []), ...(data.data || []) ];
					folder.total = data.total;
					folder.page_index += 1;

					this.setState({
						folders
					});
				})
				.catch(err => {
					console.error(err);
	
					folder.loading = false;
					folder.initing = false;

					this.setState({
						folders
					});
				});
		}
	}

	handleSearchInput = (e) => {
		if (e.which == 13) {
			this.setState({
				keyword:e.target.value
			}, () => {
				this.loadFolders();
			});
		}
	}

	handleToogeFolder = (folderId) => {
		const { folders } = this.state;
		const folder = folders.find(f => f.id == folderId);

		if (folder) {
			folder.isOpen = !folder.isOpen;

			this.setState({
				folders
			});

			if (folder.isOpen && folder.page_index == 1) {
				this.loadSvgs(folderId);
			}
		}
	}

	renderIcons = (folder) => {
		const { imageCollageStore } = this.props;

		if (folder.initing) {
			return (
				<div styleName="icon-loading">
					<Loading bgColor="transparent" iconColor="#999" iconSize={20} />
				</div>
			);
		}

		if ((folder.data || []).length == 0) {
			return (
				<div styleName="icon-empty">
					{ __('Không có dữ liệu') }
				</div>
			);
		}

		return (
			<Fragment>
				{
					(folder.data || []).map(item => (
						<div styleName="icon-item"
							key={item.id}
							onClick={() => imageCollageStore.createSvg(buildSvg(
								item.content,
								item.width,
								item.height,
								item.color
							))}
						>
							<span dangerouslySetInnerHTML={{
								__html: buildSvg(item.content, 20, 20, item.color)
							}} />
						</div>
					))
				}

				{
					folder.page_index * folder.page_size < folder.total &&
					<div styleName="icon-load-more">
						{
							folder.loading ?
								<Fragment>
									<LoadingIcon icon="snipper" color="#999" />
									<span>{ __('Đang tải...') }</span>
								</Fragment>
								:
								<span onClick={() => this.loadSvgs(folder.id)}>{ __('Xem thêm') }</span>
						}
					</div>
				}
			</Fragment>
		);
	}

	renderFolders = () => {
		const { folders, loading } = this.state;

		if (loading) {
			return (
				<Loading bgColor="transparent" iconColor="#999" iconSize={36} />
			);
		}

		return folders.map(folder => (
			<div styleName="folder-item" key={folder.id}>
				<div styleName="folder-select"
					onClick={() => this.handleToogeFolder(folder.id)}
					title={folder.name}
				>
					<p>{ folder.name }</p>
					
					<FontAwesome icon={`fal ${folder.isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
				</div>

				{
					folder.isOpen &&
					<div styleName="folder-icons">
						{ this.renderIcons(folder) }
					</div>
				}
			</div>
		));
	}

	render() {
		return (
			<div styleName="collage-panel">
				<div styleName="panel-header">
					<div styleName="header-search">
						<SvgIcon icon={<SearchIconV2 />} color="#999" size={16} />
						
						<input
							type="text"
							placeholder={__('Tìm kiếm')}
							ref={c => this.refSearchInput = c}
							onKeyDown={this.handleSearchInput}
						/>
					</div>
				</div>

				<div styleName="panel-body">
					<Scrollbar>
						<div styleName="folders">
							{ this.renderFolders() }
						</div>
					</Scrollbar>
				</div>
			</div>
		);
	}
}

export default IconPanel;