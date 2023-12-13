import { isFunction } from 'coreutils-js';

export default function(e, callback) {
	if (e && e.target && e.target.files) {
		const files = Object.values(e.target.files);
		let count = files.length;
		const images = [];

		files.forEach(file => {
			const reader = new FileReader();

			reader.onload = (event) => {
				count -= 1;
				images.push(event.target.result);

				if (count === 0 && isFunction(callback)) {
					callback(images);
				}
			};
			reader.onerror = () => {
				count -= 1;

				if (count === 0 && isFunction(callback)) {
					callback(images);
				}
			};
			reader.readAsDataURL(file);
		});
	}
}
