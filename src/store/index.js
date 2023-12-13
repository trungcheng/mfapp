/* eslint-disable lines-between-class-members */
import Store from './baseStore';
import {observable, action} from 'mobx';

import ImageCollageStore from './ImageCollageStore';
import SvgStore from './SvgStore';

class RootStore extends Store {
	constructor(props) {
		super(props);

		this.imageCollageStore = new ImageCollageStore(this);
		this.svgStore = new SvgStore(this);
	}

	// Default
	@observable sessionId = null;
	@observable currentUser = {};
	@observable getTokenFunction = null;
}

export default RootStore;
