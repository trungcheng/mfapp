import config from '@media/config';
import API from './baseAPI';
import { createMediaInstance } from '@media/common/request';
import { propTypes } from 'coreutils-js'; 

class AccountAPI extends API {
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

		this.instance = this.createInstance(
			config.api.account,
			createMediaInstance
		);
	}

	getChannelInfo() {
		return this.instance.get('/channels/info');
	}

	getListAccount() {
		return this.instance.get('/');
	}
}

export default AccountAPI;