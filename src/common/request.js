import axios from 'axios';
import config from '@media/config';
import { error as createError, isError } from 'coreutils-js';
import ErrorMessage from '@media/constants/error-message';

const mediaToken = {};
const queueToken = [];

function ackQueue(token) {
	if (queueToken.length) {
		const currQueueHandling = queueToken.shift();

		if (token) {
			mediaToken[currQueueHandling.key] = token;
		}

		if (mediaToken[currQueueHandling.key]) {
			currQueueHandling.callback(null, mediaToken[currQueueHandling.key], ackQueue);
		} else {
			currQueueHandling.getTokenFunction((...args) => {
				let err, token;

				if (args.length == 1) {
					err = null;
					token = args[0];
				} else if (args.length > 1) {
					err = args[0];
					token = args[1];
				}

				if (err) {
					if (!isError(err)) {
						currQueueHandling.callback(createError(err), null, ackQueue);
					} else {
						currQueueHandling.callback(err, null, ackQueue);
					}
				} else if (token) {
					mediaToken[currQueueHandling.key] = token;
					currQueueHandling.callback(null, token, ackQueue);
				} else {
					currQueueHandling.callback(createError('Token is required'), null, ackQueue);
				}
			});
		}
	}
}

function getToken(key, getTokenFunction, callback) {
	queueToken.push({
		key,
		getTokenFunction,
		callback
	});

	ackQueue();
}

export function createMediaInstance(baseURL, props) {
	const instance = axios.create({
		baseURL,
		timeout: config.request.timeout,
		withCredentials: false,
		headers: {}
	});
	let errorCount = 0;

	instance.interceptors.request.use(
		config => new Promise((resolve, reject) => {
			getToken(props.sessionId, props.getTokenFunction, (err, token, ack) => {
				if (err) {
					reject(err);
				} else {
					config.headers['x-access-token'] = token;
					resolve(config);
					ack(token);
				}
			});
		}),
		error => {
			console.error(`${baseURL} =>`, error);
			return error;
		}
	);

	instance.interceptors.response.use(
		response => new Promise((resolve, reject) => {
			errorCount = 0;
			
			try {
				resolve(response.data.message);
			} catch(err) {
				reject(err);
			}
		}),
		error => new Promise((resolve, reject) =>  {
			try {
				if (error.response.status == 401 && errorCount < config.request.maxRetryError) {
					errorCount += 1;
					mediaToken[props.sessionId] = null;
					getToken(props.sessionId, props.getTokenFunction, (err, token, ack) => {
						if (err) {
							reject(err);
						} else {
							error.config.headers['x-access-token'] = token;
							resolve(instance(error.config));
							ack(token);
						}
					});
				} else if (error.response.status == 429 && errorCount < config.request.maxRetryError) {
					errorCount += 1;

					setTimeout(() => {
						resolve(instance(error.config));
					}, 1000);
				} else {
					console.error(`${baseURL} =>`, error);
					errorCount = 0;
					reject(createError(error.response.data.error.message, error.response.status));
				}
			} catch(e) {
				console.error(`${baseURL} =>`, error);
				errorCount = 0;

				if (ErrorMessage[error.message]) {
					error.message = ErrorMessage[error.message];
				}

				reject(error);
			}
		})
	);

	return instance;
}