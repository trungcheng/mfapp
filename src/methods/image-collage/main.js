import { Provider } from 'mobx-react';
import { render, unmountComponentAtNode } from 'react-dom';
import { safeRender } from 'coreutils-js';

import { ImageCollageMain, ImageCollagePopup } from '@media/modules/image-collage';

export default function(store, placeholder) {
	if (placeholder) {
		const element = document.querySelector(placeholder);

		safeRender(
			render,
			<Provider
				store={store}
				imageCollageStore={store.imageCollageStore}
				svgStore={store.svgStore}
			>
				<ImageCollageMain />
			</Provider>,
			element
		);
	} else {
		const dialogEl = document.createElement('div');

		document.body.appendChild(dialogEl);

		render(
			<Provider
				store={store}
				imageCollageStore={store.imageCollageStore}
				svgStore={store.svgStore}
			>
				<ImageCollagePopup onClose={() => unmountComponentAtNode(dialogEl)} />
			</Provider>,
			dialogEl
		);
	}
}