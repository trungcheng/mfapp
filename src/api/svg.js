import config from '@media/config';
import API from './baseAPI';
import { createMediaInstance } from '@media/common/request';
import { propTypes } from 'coreutils-js'; 

class SvgAPI extends API {
	constructor(props) {
		super(propTypes(props, {
			sessionId: {
				type: 'string',
				empty: false,
				required: true
			},
			getTokenFunction: {
				type: 'function',
				empty: false,
				required: true
			},
			username: 'string'
		}));

		this.svgInstance = this.createInstance(
			config.api.svg,
			createMediaInstance
		);

		this.svgFolderInstance = this.createInstance(
			config.api.svgFolder,
			createMediaInstance
		);
	}

	getListSvgFolder(params) {
		return this.svgFolderInstance.get('/', {
			params
		});
	}

	getListSvg(params = {}) {
		return this.svgInstance.get('/', {
			params
		});
	}

	getSvgInfo(id) {
		return this.svgInstance.get(`/${id}`);
	}
}

export default SvgAPI;