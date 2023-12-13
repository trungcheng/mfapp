import Store from './baseStore';
import SvgAPI from '@media/api/svg';
import { action, observable } from 'mobx';
import { isArray, invokeOutside, isObject } from 'coreutils-js';

class SvgStore extends Store {
	constructor(rootStore) {
		super();

		this.rootStore = rootStore;

		this.apiSvg = new SvgAPI({
			sessionId: rootStore.sessionId,
			getTokenFunction: rootStore.getTokenFunction,
			username: rootStore.currentUser.username
		});
	}

	// Init
	@observable maxSelect = 0;
	@observable svgCallback = null;
	@observable dialog = null;
	@observable onExpand = null;
	@observable svgSelected = [];
	@observable selectedId = null;

	@action
	handleSvgCallback(svgs) {
		let arrSvg = [];

		if (isArray(svgs)) {
			arrSvg = svgs;
		} else {
			arrSvg = [ svgs ];
		}

		if (isObject(this.dialog)) {
			this.dialog.close();
		}

		invokeOutside(this.svgCallback, arrSvg);
	}

	// API
	@action
	getListSvgFolder(params) {
		return new Promise((resolve, reject) => {
			this.apiSvg.getListSvgFolder(params)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	@action
	getListSvg(params) {
		return new Promise((resolve, reject) => {
			this.apiSvg.getListSvg(params)
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	@action
	getSvgInfo() {
		return new Promise((resolve, reject) => {
			this.apiSvg.getSvgInfo()
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

}

export default SvgStore;