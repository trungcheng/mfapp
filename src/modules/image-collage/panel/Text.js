import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import texts from '@media/config/collage/texts';

import '../styles/panel.scss';

import { SvgIcon } from '@media/ui/icons';
import { AddTextIcon } from '@media/ui/icons/svgs';
import Scrollbar from '@media/ui/scrollbar';

@inject('svgStore', 'imageCollageStore')
@observer
class TextPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			
		};
	}

	handleAddText = () => {
		const { imageCollageStore } = this.props;
		
		imageCollageStore.createText();
	}

	handleChangeTextTemplate = (font) => {
		const { imageCollageStore } = this.props;

		imageCollageStore.createText('Sample', {
			fontFamily: font //template.frames[0].fontFamily
		});
	}

	renderTextTemplates = () => {
		const style = {
			width: '100%'
		};

		return texts.samples.map((font, idx) => (
			<div key={idx}
				style={style}
				styleName="listing-item"
				onClick={() => this.handleChangeTextTemplate(font)}
			>
				<div style={{
					fontSize: 27,
					// fontFamily: template.frames[0].fontFamily,
					// fontWeight: template.frames[0].fontWeight,
					fontFamily: font,
					color: '#fff',
					textAlign: 'center'
				}}>
					Sample
				</div>
			</div>
		));
	}

	render() {
		return (
			<div styleName="collage-panel">
				<div styleName="panel-header">
					<button
						styleName="add-text"
						onClick={this.handleAddText}
					>
						<SvgIcon icon={<AddTextIcon />} color="#999" size={16} />
						{ __('Thêm văn bản') }
					</button>
				</div>

				<div styleName="panel-body">
					<div styleName="background">
						<div styleName="background-title">
							{ __('Mẫu chữ') }
						</div>

						<Scrollbar>
							<div styleName="background-listing">
								{ this.renderTextTemplates() }
							</div>
						</Scrollbar>
					</div>
				</div>
			</div>
		);
	}
}

export default TextPanel;