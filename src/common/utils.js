/* eslint-disable no-inner-declarations */
import { isString, isFunction, getExtname, getDomain, isEmpty, intParse, stringFormat, uuid, getUri } from 'coreutils-js';
import MediaAcceptType from '@media/constants/types/media-accept-type';
import MediaType from '@media/constants/types/media-type';
import moment from 'moment';
import config from '@media/config';

// Tính toán with, height của PhotoItem
function calculateSizeMedia(selector, minWidth = 140) {
	const el = document.querySelector(selector);

	if (el) {
		const pP = el.getBoundingClientRect();
		const cs = window.getComputedStyle(el);

		const pW = pP.width - (
			parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
			+ parseFloat(cs.borderRightWidth) + parseFloat(cs.borderLeftWidth)
		);
		const pH = pP.height - (
			parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
			+ parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
		);

		function cal(col) {
			const iW = pW / col;
			const niW = pW / (col + 1);

			if (niW > minWidth) {
				return cal(col + 1);
			} else {
				return {
					col,
					iW
				};
			}
		}

		const size = cal(1);
		const row = Math.ceil(pH / size.iW);

		return {
			width: size.iW,
			height: pH / row,
			col: size.col,
			row
		};
	}

	return null;
}

// Tính toán with, height của SvgItem
function calculateSizeSvg(selector) {
	const minWidth = 140;
	const el = document.querySelector(selector);
	const pP = el.getBoundingClientRect();
	const cs = window.getComputedStyle(el);

	const pW = pP.width - (
		parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
		+ parseFloat(cs.borderRightWidth) + parseFloat(cs.borderLeftWidth)
	);
	const pH = pP.height - (
		parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
		+ parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
	);

	function cal(col) {
		const iW = pW / col;
		const niW = pW / (col + 1);

		if (niW > minWidth) {
			return cal(col + 1);
		} else {
			return {
				col,
				iW
			};
		}
	}

	const size = cal(1);
	const row = Math.ceil(pH / size.iW);

	return {
		width: size.iW,
		height: pH / row,
		col: size.col,
		row
	};
}

//Build svg
function buildSvg(svg, width, height, color) {
	if (svg) {
		const colors = (isString(color) ? color : '').split(';');
		let svgContent = svg;

		if (colors.length === 1) {
			let c = colors[0];

			if (c.indexOf('#') < 0) {
				c = `#${c}`;
			}

			svgContent = svgContent.replace(/fillColor/g, c);
		} else {
			colors.forEach((color, index) => {
				let c = color;

				if (c.indexOf('#') < 0 && c.indexOf('rgb') < 0) {
					c = `#${c}`;
				}

				const regexStr = `"fillColor${(index === 0 ? '' : index)}"`;
				const regex = new RegExp(regexStr, 'g');
				svgContent = svgContent.replace(regex, `"${c}"`);
			});
		}

		svgContent = svgContent
			.replace(/svgWidth/g, width)
			.replace(/svgHeight/g, height);

		return svgContent;
	}

	return null;
}

function convertSvgToImage(svg, callback) {
	const DOMURL = window.URL || window.webkitURL || window;
	const img = new window.Image();
	const blob = new window.Blob([svg], { type: 'image/svg+xml' });
	const url = DOMURL.createObjectURL(blob);

	img.onload = () => {
		if (isFunction(callback)) {
			callback(img);
		}
		DOMURL.revokeObjectURL(url);
	};
	img.src = url;
}

function getMediaTypeFromFile(filename) {
	let type = MediaType.OTHER;
	const ext = getExtname(filename);

	Object.keys(MediaAcceptType).forEach(typeName => {
		if (MediaAcceptType[typeName].split(',').indexOf(ext) !== -1) {
			type = MediaType[typeName];
		}
	});

	return type;
}

function buildVid(fileDomain, filename) {
	let vid = `${getDomain(fileDomain, false)}/${filename}`;

	vid = vid.split('/');
	vid = vid.filter(v => !isEmpty(v));

	return vid.join('/');
}

function buildEmbedCode(store, media) {
	let embedCode = '';
	const vid = buildVid(store.fileDomain, media.file_name);
	const key = media.key || media.id || uuid().split('-').join('');
	const namespace = getDomain(store.fileDomain, false);

	if (store.videoEmbedType == 5) {
		embedCode = `<video width="600" height="400" class="player-${store.playerId}" data-vid="${vid}" data-info="${key}" data-location="" data-nopre="false" data-postroll="true" data-midroll="0.5" data-contentId="${media.policy_id || ''}"></video>`;
	}
	else if (store.videoEmbedType == 4) {
		embedCode = `<div class="VCSortableInPreviewMode" type="VideoStream" embed-type="4" data-width="600px" data-height="400px" data-vid="${vid}" data-info="${key}" data-autoplay="false" data-removedlogo="false" data-location="" data-displaymode="0" data-thumb="${media.avatar || ''}" data-contentId="${media.policy_id || ''}" data-namespace="${namespace}" data-originalId="${media.original_id || ''}"><div class="VideoCMS_Caption"><p class="NLPlaceholderShow" data-placeholder="[nhập chú thích]" style="text-align: center;" contenteditable="true">${media.name || ''}</p></div></div>`;
	}
	else {
		embedCode = `<iframe src="${stringFormat(config.formatApi.playerIframe, store.playerId)}?vid=${vid}&ads=true&autoplay=false&_info=${key}&poster=${media.avatar || ''}&location=" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>`;
	}

	return embedCode;
}

function loadMime(file, callback) {
	//List of known mimes
	const mimes = [
		{
			mime: 'image/jpeg',
			type: 'jpeg',
			pattern: [0xFF, 0xD8, 0xFF],
			mask: [0xFF, 0xFF, 0xFF],
		},
		{
			mime: 'image/png',
			type: 'png',
			pattern: [0x89, 0x50, 0x4E, 0x47],
			mask: [0xFF, 0xFF, 0xFF, 0xFF],
		},
		{
			mime: 'image/gif',
			type: 'gif',
			pattern: [0x47, 0x49, 0x46, 0x38],
			mask: [0xFF, 0xFF, 0xFF, 0xFF],
		}
	];
	const defaultMine = {
		mine: 'unknow',
		type: 'unknow'
	};

	function check(bytes, mime) {
		for (let i = 0, l = mime.mask.length; i < l; ++i) {
			if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
				return false;
			}
		}
		return true;
	}

	const blob = file.slice(0, 4); //read the first 4 bytes of the file
	const reader = new FileReader();

	reader.onloadend = (e) => {
		if (!e.target.error) {
			const bytes = new Uint8Array(e.target.result);

			for (let i = 0, l = mimes.length; i < l; ++i) {
				if (check(bytes, mimes[i])) {
					return callback(mimes[i]);
				}
			}

			return callback(defaultMine);
		}

		return callback(defaultMine);
	};
	reader.readAsArrayBuffer(blob);
}

// Tính toán tiến trình converting
function processingConvert(startTimeStr, estimateTime, callback) {
	const diffTime = moment.duration(moment().diff(moment(startTimeStr))).asMilliseconds();
	const estTime = intParse(estimateTime, 0) * 1000;
	const process = intParse((diffTime / estTime) * 100, 99);
	let percent = 0;

	if (process < 0) {
		percent = 0;
	} else if (process > 99) {
		percent = 99;
	} else {
		percent = isNaN(process) ? 99 : process;
	}

	if (isFunction(callback)) {
		callback(percent);

		if (percent < 99) {
			setTimeout(() => {
				processingConvert(startTimeStr, estimateTime, callback);
			}, 1);
		}
	}
}

// Kiểm tra domain có được enabled cookie
function areCookieEnabled(checkDomain, callback) {
	const iframe = document.createElement('iframe');

	iframe.src = checkDomain;
	iframe.style.display = 'none';

	document.body.appendChild(iframe);

	function receiveData(e) {
		const data = e.data;

		if (typeof callback == 'function' &&
			iframe.contentWindow === e.source
		) {
			callback(data.cookieEnabled ? true : false);
		}
	}

	if (typeof window.addEventListener != 'undefined') {
		window.addEventListener('message', receiveData, false);
	} else if (typeof window.attachEvent != 'undefined') {
		window.attachEvent('onmessage', receiveData);
	}
}

// Convert base64 to Blob file
function base64toBlob(base64, sliceSize = 512) {
	// Split the base64 string in data and contentType
	const block = base64.split(';');

	// Get the content type of the image
	const contentType = block[0].split(':')[1]; // In this case "image/gif"

	// get the real base64 content of the file
	const realData = block[1].split(',')[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

	const byteCharacters = atob(realData);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);
		const byteNumbers = new Array(slice.length);

		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: contentType });

	return blob;
}

function timeToSecond(d = 0, h = 0, m = 0, s = 0, revert = false) {
	if (!revert) {
		return ((+d) * 24 * 60 * 60) + ((+h) * 60 * 60) + ((+m) * 60) + (+s);
	}

	let seconds = Number(s);
	let days = Math.floor(seconds / (24 * 60 * 60));
	seconds -= days * (24 * 60 * 60);
	
	let hours = Math.floor(seconds / (60 * 60));
	seconds -= hours * (60 * 60);
	
	let minutes = Math.floor(seconds / (60));
	seconds -= minutes * (60);

	return {
		d: days,
		h: hours,
		m: minutes,
		s: seconds
	}
}

export {
	calculateSizeMedia,
	calculateSizeSvg,
	buildSvg,
	convertSvgToImage,
	getMediaTypeFromFile,
	buildVid,
	loadMime,
	processingConvert,
	areCookieEnabled,
	buildEmbedCode,
	base64toBlob,
	timeToSecond
};
