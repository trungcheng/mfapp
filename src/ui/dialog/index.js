import { cloneElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { isFunction } from 'coreutils-js';

import Dialog from './Dialog';
import MessageBox from './MessageBox';
import ConfirmBox from './ConfirmBox';
import WaitingBox from './WaitingBox';

function renderDialog(component, onOpen, onClose) {
	const dialogEl = document.createElement('div');
	const dialogConfig = {
		onClose() {
			unmountComponentAtNode(dialogEl);

			if (isFunction(onClose)) {
				onClose();
			}
		},
		onOpen(dialog) {
			if (isFunction(onOpen)) {
				onOpen(dialog);
			}
		}
	};

	document.body.appendChild(dialogEl);

	render(
		cloneElement(
			component,
			dialogConfig
		),
		dialogEl
	);
}

export {
	renderDialog,
	Dialog,
	MessageBox,
	ConfirmBox,
	WaitingBox
};