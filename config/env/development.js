module.exports = {
	cssPrefix: 'm__',
	publicUrl: '//127.0.0.1:7777/dist/',
	staticUrl: '//127.0.0.1:7777/dist/statics/media/',
	api: {
		account: '//127.0.0.1:3146/api/v1/accounts/',
	},
	request: {
		timeout: 100000,
		maxRetryError: 5
	},
	resources: {
		js: {
			bootstrap: {
				namespace: 'bootstrapScript',
				url: '//cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.min.js'
			}
		},
	},
	formatApi: {
		shareMedia: 'http://127.0.0.1:1301/share/{0}',
	}
};
