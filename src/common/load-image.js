import { isUrl, isImageBase64, isFunction, imageToBase64 } from 'coreutils-js'; 

export default function loadImage(src, callback) {
	return new Promise((resolve) => {
		if (isUrl(src) || isImageBase64(src)) {
			const img = new Image();
	
			img.crossOrigin = 'anonymous';
			img.onload = () => {
				const data = {
					base64: imageToBase64(img),
					width: img.width,
					height: img.height,
					target: img
				};

				resolve(data);
				if (isFunction(callback)) callback(data);
			};
			img.onerror = () => {
				resolve(null);
				if (isFunction(callback)) callback(null);
			};
			img.src = src;
		} else {
			resolve(null);
			if (isFunction(callback)) callback(null);
		}
	});
}