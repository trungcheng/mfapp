import { isNumber } from 'coreutils-js';

export function number(newValue, oldValue) {
	if (!isNaN(newValue)) {
		return newValue;
	}

	return oldValue;
}

export function numberMin(newValue, oldValue, min) {
	if (isNumber(min)) {
		const minValue = Number(min);

		if (!isNaN(newValue) && Number(newValue) >= minValue) {
			return newValue;
		} else {
			return oldValue;
		}
	}

	return newValue;
}

export function numberMax(newValue, oldValue, max) {
	if (isNumber(max)) {
		const maxValue = Number(max);

		if (!isNaN(newValue) && Number(newValue) <= maxValue) {
			return newValue;
		} else {
			return oldValue;
		}
	}

	return newValue;
}

export function maxLength(newValue, oldValue, maxLength) {
	if (isNumber(maxLength)) {
		const max = Number(maxLength);

		if (newValue.length > max) {
			return newValue.slice(0, maxLength);
		} else {
			return newValue;
		}
	}

	return newValue;
}

export default {
	number,
	numberMin,
	numberMax,
	maxLength
};