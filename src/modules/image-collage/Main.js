import { Component } from 'react';
import { observer, inject } from 'mobx-react';

import './styles/main.scss';

import Loading from '@media/ui/loading';
import Header from './Header';
import MenuBar from './MenuBar';
import Editor from './Editor';
import LayoutBar from './LayoutBar';
import BottomBar from './BottomBar';
import AdjustBox from './AdjustBox';
import Preview from './Preview';

import { SvgIcon } from '@media/ui/icons';
import { 
	ArrowRightIcon
} from '@media/ui/icons/svgs';
import BgToggleLayout from '@media/assets/svgs/bg-toggle-layout.svg';

@inject('store', 'imageCollageStore')
@observer
class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showLayout: true
		}
	}

	componentDidMount() {
		window.addEventListener('click', this.eventClick);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.eventClick);
	}

	eventClick = () => {
		const { imageCollageStore } = this.props;
		const { canvas } = imageCollageStore;
		const updatePosition = (e) => {
			const obj = canvas.getActiveObject();

			if (
				obj &&
				imageCollageStore.objectSelectedPosition &&
				imageCollageStore.objectSelectedPosition.id == obj.id
			) {
				imageCollageStore.calculatePostionObjectActive(obj.id, e);
			}
		};

		if (canvas) {
			canvas.on('mouse:down', (e) => {
				const obj = canvas.getActiveObject();

				if (obj) {
					imageCollageStore.objectSelectedId = obj.id;
					this.refAdj.onShowIcon();

					if (imageCollageStore.objectSelectedPosition.id != obj.id) {
						imageCollageStore.calculatePostionObjectActive(obj.id, e);
					}
				}
			});

			canvas.on('object:moving', updatePosition);

			canvas.on('mouse:up', updatePosition);

			// canvas.on('object:modified', imageCollageStore.updateCanvasState());
	
			// canvas.on('object:added', imageCollageStore.updateCanvasState());

			// canvas.on('object:removed', imageCollageStore.updateCanvasState());
		}
	}

	onToggleLayoutBar = () => {
		this.setState({
			showLayout: !this.state.showLayout
		});
	}

	render() {
		const { imageCollageStore } = this.props;
		const { showLayout } = this.state;
		const { initing, layoutSelectedId, width, height, rerenderKey, previewMode } = imageCollageStore;

		if (initing) {
			return (
				<div styleName="image-collage">
					<Loading
						bgColor="transparent"
						iconColor="#999"
						text={__('Đang khởi tạo...')}
					/>
				</div>
			);
		}

		return (
			<Loading
				visible={imageCollageStore.loading}
				icon="spinner"
				iconColor="#fff"
				bgColor="rgba(0,0,0,.5)"
			>
				<div styleName="image-collage">
					<Header />

					<div styleName="collage-container">
						{ previewMode && <Preview /> }

						<MenuBar />

						<div styleName="collage-main">
							<div 
								style={{
									width: 15,
									height: 60,
									alignItems: 'center',
									textAlign: 'center',
									lineHeight: '60px',
									cursor: 'pointer',
									background: 'url("'+BgToggleLayout+'") no-repeat center',
									position: 'absolute',
									right: 0,
									top: '43.5%',
									zIndex: 2
								}}
								onClick={this.onToggleLayoutBar}
							>
								<div style={{ transform: showLayout ? 'rotate(0deg)' : 'rotate(180deg)' }}>
									<SvgIcon icon={<ArrowRightIcon />} size={10} color="#222" />
								</div>
							</div>

							<Editor
								key={layoutSelectedId + width + height + rerenderKey}
							/>

							<BottomBar width={width} height={height} />
						</div>

						{
							imageCollageStore.layoutSelectedId > 1 && <>
								{
									showLayout && <LayoutBar />
								}
							</>
						}
					</div>

					<AdjustBox ref={c => this.refAdj = c} />
				</div>
			</Loading>
		);
	}
}

export default Main;