import Store from './src/store';
import config from '@media/config';
import AccountAPI from '@media/api/account';

import imageCollage from './src/methods/image-collage';

export default {
	props: {
		getTokenFunction: {
			required: true,
			type: 'function'
		}
	},
	methods: {
		imageCollage,
	},
	resources: [
		config.resources.js.player
	],
	load() {
		console.log('vao day 1 =>', this.props);

		return new Promise((resolve) => {
			const store = new Store({
				...this.props,
				sessionId: this.id || '12313123123231',
				currentUser: {
					id: '1',
					username: 'trungdn',
					avatar: '',
					fullName: 'Dinh Trung',
					mid: '',
					permissions: [],
					role: 0,
					delegator: 1
				}
			});

			resolve(store);

			// const api = new AccountAPI({
			// 	sessionId: this.id,
			// 	getTokenFunction: this.props.getTokenFunction
			// });

			// api.getChannelInfo()
			// 	.then(data => {
			// 		const store = new Store({
			// 			...this.props,
			// 			sessionId: this.id || '12313123123231',
			// 			currentUser: {
			// 				id: data.id,
			// 				username: data.username,
			// 				avatar: data.avatar,
			// 				fullName: data.full_name,
			// 				mid: data.mid,
			// 				permissions: data.channel.permissions,
			// 				role: data.channel.role,
			// 				delegator: data.channel.delegator
			// 			}
			// 		});

			// 		store.initChannel(
			// 			data.channel,
			// 			data.channel_relations
			// 		);

			// 		resolve(store);
			// 	})
			// 	.catch(err => {
			// 		throw err;
			// 	});
		});
	}
};
