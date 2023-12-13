import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { isNull } from 'coreutils-js';
import _ from 'lodash';
import ResizeObserverPolyfill from 'resize-observer-polyfill';

import './styles/main.scss';

import Scrollbar from '@media/ui/scrollbar';

@inject('store', 'imageCollageStore')
@observer
class Editor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			eWidth: 0,
			eHeight: 0,
		};

		this.resizeObserver = null;
	}

	componentDidMount() {
		this.calculateScale();
		this.init();

		if (this.refEditor) {
			const eHeight = this.refEditor.offsetHeight;
			const eWidth = this.refEditor.offsetWidth;

			this.setState({
				eWidth,
				eHeight
			});
		}

		this.resizeObserver = new ResizeObserverPolyfill(() => {
			if (this.refEditor) {
				const eHeight = this.refEditor.offsetHeight;
				const eWidth = this.refEditor.offsetWidth;

				this.setState({
					eWidth,
					eHeight
				});
			}
		});
		this.resizeObserver.observe(document.querySelector('#CollageEditor'));

		window.addEventListener('keyup', this.eventRmove);
		window.addEventListener('click', this.eventOutclick);
	}

	componentWillUnmount() {
		this.resizeObserver.disconnect();
		window.removeEventListener('keyup', this.eventRmove);
		window.removeEventListener('click', this.eventOutclick);
	}

	eventRmove = (e) => {
		if (e.which == 46) {
			const { imageCollageStore } = this.props;
			const { canvas, objects } = imageCollageStore;
			const currentlySelected = canvas.getActiveObject();

			if (currentlySelected) {
				if (currentlySelected.type == 'group') {
					for (const object of currentlySelected.getObjects()) {
						objects.splice(objects.findIndex(obj => obj.id == object.id), 1);
						canvas.remove(object);
					}
				}
				else if (currentlySelected.type == 'image') {
					return;
				}

				objects.splice(objects.findIndex(obj => obj.id == currentlySelected.id), 1);
				canvas.remove(currentlySelected);
			}
		}
	}

	eventOutclick = (e) => {
		const { imageCollageStore } = this.props;

		if (
			(!imageCollageStore.refEditorArea || !imageCollageStore.refEditorArea.contains(e.target)) &&
			(!imageCollageStore.refAdjustBox || !imageCollageStore.refAdjustBox.contains(e.target)) &&
			document.body.contains(e.target)
		) {
			imageCollageStore.objectSelectedId = null;
			imageCollageStore.objectSelectedPosition = {};
		}
	}

	init = () => {
		const { imageCollageStore } = this.props;

		imageCollageStore.createCanvas('canvas');
		imageCollageStore.createLayout();

		imageCollageStore.objects.forEach(object => {
			imageCollageStore.canvas.add(object.instance);
		});
	}

	calculateScale = () => {
		const { imageCollageStore } = this.props;
		const { width, height, scale } = imageCollageStore;

		if (this.refEditor && isNull(scale)) {
			const eHeight = this.refEditor.offsetHeight;
			const eWidth = this.refEditor.offsetWidth;
			const aspectW = eWidth / width;
			const aspectH = eHeight / height;

			if (aspectW < aspectH && aspectW < 1) {
				imageCollageStore.scale = aspectW - 0.01;
			} else if (aspectH < 1 && aspectH < aspectW) {
				imageCollageStore.scale = aspectH - 0.01;
			} else {
				imageCollageStore.scale = 0.9;
			}
		}
	}

	render() {
		const { eHeight, eWidth } = this.state;
		const { imageCollageStore } = this.props;
		const { scale, width, height } = imageCollageStore;
		const positionTop = (eHeight - height * scale) / 2;
		const positionLeft = (eWidth - width * scale) / 2;

		return (
			<div styleName="collage-editor"
				ref={c => this.refEditor = c}
				id="CollageEditor"
			>
				<Scrollbar>
					<div styleName="editor-area"
						style={{
							top: positionTop > 0 ? positionTop : 0,
							left: positionLeft > 0 ? positionLeft : 0,
							width: width * scale,
							height: height * scale
						}}
						ref={c => imageCollageStore.refEditorArea = c}
					>
						<div styleName="editor"
							style={{
								transform: `scale(${scale})`,
								top: (height * (scale - 1)) / 2,
								left: (width * (scale - 1)) / 2
							}}

						>
							<canvas
								id="canvas"
								width={imageCollageStore.width}
								height={imageCollageStore.height}
							/>
						</div>
					</div>
				</Scrollbar>
			</div>
		);
	}
}

export default Editor;