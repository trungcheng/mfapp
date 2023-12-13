/* eslint-disable no-case-declarations */
/* eslint-disable max-lines-per-function */
import Store from './baseStore';
import { action, observable, computed } from 'mobx';
import {
	isUrl,
	isImageBase64,
	isArray,
	uuid,
	isFunction,
	isUndefined,
	isEmpty,
	isObject
} from 'coreutils-js';

import loadImage from '@media/common/load-image';
import layouts from '@media/config/collage/layouts';
import { fabric } from 'fabric';
import _ from 'lodash';
import MediaType from '@media/constants/types/media-type';

import 'fabric-history';

class ImageLayoutStore extends Store {
	constructor(rootStore) {
		super();

		this.rootStore = rootStore;
	}

	// Data
	@observable background = null;
	@observable layout = null;
	@observable objects = [];
	@observable images = [];
	@observable canvas = null;
	@observable width = 0;
	@observable height = 0;
	@observable scale = null;
	@observable spacing = 0;
	@observable roundness = 0;
	@observable initing = true;
	@observable loading = false;
	@observable layoutSelectedId = null;
	@observable objectSelectedId = null;
	@observable objectSelectedPosition = {};
	@observable rerenderKey = Date.now();
	@observable allowSave = false;
	@observable refEditorArea = null;
	@observable refAdjustBox = null;
	@observable refSelectBox = null;
	@observable mainColor = '#999999';
	@observable onSave = () => { };
	@observable onCancel = () => { };
	@observable previewMode = false;
	@observable quickSave = false;
	@observable config = {
		// state: [],
		// mods: 0,
		// disableUndoButton: true,
		// disableRedoButton: true
		canvasState: [],
		currentStateIndex: -1,
		undoStatus: false,
		redoStatus: false,
		undoFinishedStatus: true,
		redoFinishedStatus: true,
		disableUndoButton: true,
		disableRedoButton: true
	};

	// Computed
	@computed get objectSelected() {
		return this.objects.find(o => o.id == this.objectSelectedId);
	}

	// Init
	@action
	init(props, callback) {
		let countInit = Object.keys(props).length;
		const invokeCallback = () => {
			if (countInit <= 0) {
				if (!this.width) {
					this.width = 500;
				}

				if (!this.height) {
					this.height = 500;
				}

				this.initing = false;

				if (isFunction(callback)) {
					callback();
				}
			}
		};

		this.initing = true;
		this.loading = false;
		this.images = [];
		this.quickSave = false;

		Object.keys(props).forEach(key => {
			const value = props[key];

			switch (key) {
				case 'background': // Thêm background
					this.createBackground(value, () => {
						countInit -= 1;
						invokeCallback();
					});
					break;
				case 'images':
					const addImage = (src, callback) => {
						if (isUrl(src) || isImageBase64(src)) {
							loadImage(src, data => {
								this.images.push(data.target);

								if (this.width < data.target.naturalWidth) {
									this.height = this.width ? data.target.naturalWidth * 1.5 : data.target.naturalHeight;
									this.width = data.target.naturalWidth;
								}

								if (isFunction(callback)) callback(data.target);
							});
						} else {
							countInit -= 1;
						}
					};

					if (isArray(value)) {
						if (value.length > 1) {
							this.layoutSelectedId = 2;
						} else {
							this.layoutSelectedId = 1;
						}

						let count = 0;
						const load = () => {
							addImage(value[count], () => {
								count += 1;

								if (count >= value.length) {
									countInit -= 1;
									invokeCallback();
								} else {
									load();
								}
							});
						};

						load();
					} else {
						this.layoutSelectedId = 1;
						addImage(value, () => {
							countInit -= 1;
							invokeCallback();
						});
					}

					console.log(this.images)
					break;
				case 'callback':
					this.onSave = (sources) => {
						this.loading = true;

						if (isFunction(value)) {
							this.rootStore.uploadSources(
								sources.map(src => ({ src })),
								{
									mediaType: MediaType.IMAGE,
									allowSave: this.allowSave
								},
								null,
								(arrImage) => {
									value(arrImage);
									this.loading = false;

									if (!this.quickSave) {
										if (isObject(this.dialog)) {
											this.dialog.close();
										}
									}
								}
							);

							if (this.quickSave) {
								value();

								if (isObject(this.dialog)) {
									this.dialog.close();
								}
							}
						}
					};
					countInit -= 1;
					break;
				default:
					this.set({ [key]: value });
					countInit -= 1;
					break;
			}

			invokeCallback();
		});
	}

	// @action extendCanvas() {
	// 	let originalRender = fabric.Textbox.prototype._render;
	// 	fabric.Object.prototype.objectCaching = false;
	// 	fabric.Textbox.prototype._render = function (ctx) {
	// 		originalRender.call(this, ctx);
	// 		if (this.showTextBoxBorder && this.textboxBorderWidth != 0) {
	// 			let w = this.width,
	// 				h = this.height,
	// 				x = -this.width / 2,
	// 				y = -this.height / 2
	// 			ctx.beginPath();
	// 			ctx.moveTo(x - this.textboxBorderWidth / 2, y - this.textboxBorderWidth / 2);
	// 			ctx.lineTo(x + w + this.textboxBorderWidth / 2, y - this.textboxBorderWidth / 2);
	// 			ctx.lineTo(x + w + this.textboxBorderWidth / 2, y + h + this.textboxBorderWidth / 2);
	// 			ctx.lineTo(x - this.textboxBorderWidth / 2, y + h + this.textboxBorderWidth / 2);
	// 			ctx.lineTo(x - this.textboxBorderWidth / 2, y + h);
	// 			ctx.closePath();
	// 			ctx.lineWidth = this.textboxBorderWidth;
	// 			ctx.strokeStyle = this.textboxBorderColor;
	// 			ctx.stroke();
	// 		}
	// 	}
	// }

	@action
	updateCanvasState() {
		// let json = JSON.stringify(this.canvas.toObject(['polygon', 'obj', 'roundness', 'spacing']));

		// if (this.config.mods > 0) {
		// 	this.config.state = this.config.state.slice(0, this.config.state.length - this.config.mods);
		// 	this.config.mods = 0
		// }

		// this.config.state.push(json);
		// this.updateBtnsStyle();
		if ((this.config.undoStatus == false && this.config.redoStatus == false)) {
			let canvasAsJson = JSON.stringify(this.canvas.toObject(['image', 'polygon', 'obj', 'roundness', 'spacing']));
			// let canvasAsJson = JSON.stringify(this.canvas.toJSON());

			if (this.config.currentStateIndex < this.config.canvasState.length - 1) {
				let indexToBeInserted = this.config.currentStateIndex + 1;
				this.config.canvasState[indexToBeInserted] = canvasAsJson;
				let numberOfElementsToRetain = indexToBeInserted + 1;
				this.config.canvasState = this.config.canvasState.splice(0, numberOfElementsToRetain);
			} else {
				this.config.canvasState.push(canvasAsJson);
			}

			this.config.currentStateIndex = this.config.canvasState.length - 1;

			if ((this.config.currentStateIndex == this.config.canvasState.length - 1) && this.config.currentStateIndex != -1) {
				this.config.disableRedoButton = true;
			}
		}
	}

	// @action
	// loadState(state) {
    //     this.canvas.clear().renderAll();
    //     this.canvas.loadFromJSON(state, () => {
    //         this.canvas.renderAll();
    //     });
    // }

	// @action
	// updateBtnsStyle() {
	// 	if ((this.config.mods < this.config.state.length - 1)) {
	// 		this.config.disableUndoButton = false;
    //     } else {
	// 		this.config.disableUndoButton = true;
	// 	}

    //     if (this.config.state.length > 1 && this.config.mods > 0) {
	// 		this.config.disableRedoButton = false;
    //     } else {
	// 		this.config.disableRedoButton = true;
    //     }
	// }

	@action
	undo() {
		// if (this.config.mods < this.config.state.length) {
		// 	console.log('undo');
        //     this.loadState(this.config.state[this.config.state.length - this.config.mods - 2]);
        //     this.config.mods += 1;
        //     this.updateBtnsStyle();
        // }

		if (this.config.undoFinishedStatus) {
			if (this.config.currentStateIndex == -1) {
				this.config.undoStatus = false;
			} else {
				if (this.config.canvasState.length >= 1) {
					this.config.undoFinishedStatus = 0;
					if (this.config.currentStateIndex != 0) {
						this.config.undoStatus = true;
						this.canvas.loadFromJSON(this.config.canvasState[this.config.currentStateIndex - 1], () => {
							this.canvas.renderAll();
							this.config.undoStatus = false;
							this.config.currentStateIndex -= 1;
							this.config.disableUndoButton = false;
							if (this.config.currentStateIndex !== this.config.canvasState.length - 1) {
								this.config.disableRedoButton = false;
							}
							this.config.undoFinishedStatus = 1;
						});
					} else if (this.config.currentStateIndex == 0) {
						this.canvas.clear();
						this.config.undoFinishedStatus = 1;
						this.config.disableUndoButton = true;
						this.config.disableRedoButton = false;
						this.config.currentStateIndex -= 1;
					}
				}
			}
		}

		// if (this.config.currentStateIndex - 1 === -1) {
		// 	console.log('do not do anything');
		// 	return;
		// }

		// if (this.config.undoFinishedStatus) {
		// 	this.config.undoFinishedStatus = false;
		// 	this.config.undoStatus = true;

		// 	this.canvas.loadFromJSON(this.config.canvasState[this.config.currentStateIndex - 1], (o, object) => {
		// 		fabric.log(o, object);
		// 	});

		// 	this.canvas.loadFromJSON(this.config.canvasState[this.config.currentStateIndex - 1], () => {
		// 		this.canvas.renderAll();
		// 		this.config.undoStatus = false;
		// 		this.config.currentStateIndex--;
		// 		this.config.undoFinishedStatus = true;
		// 	});
		// }
	}

	@action
	redo() {
		// if (this.config.mods > 0) {
		// 	console.log('redo');
        //     this.loadState(this.config.state[this.config.state.length - this.config.mods]);
        //     this.config.mods -= 1;
        //     this.updateBtnsStyle();
        // }

		if (this.config.redoFinishedStatus) {
			if ((this.config.currentStateIndex == this.config.canvasState.length - 1) && this.config.currentStateIndex != -1) {
				this.config.disableRedoButton = true;
			} else {
				if (this.config.canvasState.length > this.config.currentStateIndex && this.config.canvasState.length != 0) {
					this.config.redoFinishedStatus = 0;
					this.config.redoStatus = true;
					this.canvas.loadFromJSON(this.config.canvasState[this.config.currentStateIndex + 1], () => {
						this.canvas.renderAll();
						this.config.redoStatus = false;
						this.config.currentStateIndex += 1;
						if (this.config.currentStateIndex != -1) {
							this.config.disableUndoButton = false;
						}

						this.config.redoFinishedStatus = 1;

						if ((this.config.currentStateIndex == this.config.canvasState.length - 1) && this.config.currentStateIndex != -1) {
							this.config.disableRedoButton = true;
						}
					});
				}
			}
		}

		// if (this.config.currentStateIndex + 1 === this.config.canvasState.length) {
		// 	console.log('do not do anything');
		// 	return;
		// }

		// if (this.config.redoFinishedStatus) {
		// 	this.config.redoFinishedStatus = false;
		// 	this.config.redoStatus = true;
		// 	this.canvas.loadFromJSON(this.config.canvasState[this.config.currentStateIndex + 1], () => {
		// 		this.canvas.renderAll();
		// 		this.config.redoStatus = false;
		// 		this.config.currentStateIndex++;
		// 		this.config.redoFinishedStatus = true;
		// 	});
		// }
	}

	@action
	undoCanvas() {
		this.canvas.undo();
	}

	@action
	redoCanvas() {
		this.canvas.redo();
	}

	// Canvas
	@action
	createCanvas(selector, options = {}) {
		const opts = {
			selection: false,
			snapAngle: 90,
			uniScaleTransform: false,
			controlsAboveOverlay: false,
			preserveObjectStacking: true,
			objectCaching: false,
			...options
		};

		this.canvas = new fabric.Canvas(selector, opts);
		this.canvas.hoverCursor = 'inherit';
		if (this.background) {
			this.canvas.setBackgroundColor(
				this.background.target,
				this.canvas.renderAll.bind(this.canvas)
			);
		}

		// this.triggerUndoRedo();
	}

	// Background
	@action
	createBackground(value, callback) {
		this.background = {
			id: uuid()
		};

		if (isUrl(value) || isImageBase64(value)) {
			loadImage(value, data => {
				this.background.target = new fabric.Pattern({
					source: data.target,
					repeat: 'repeat'
				});

				if (isFunction(callback)) callback(this.background);
			});
		} else {
			this.background.target = value;

			if (isFunction(callback)) callback(this.background);
		}
	}

	@action
	changeBackground(value) {
		if (isUrl(value) || isImageBase64(value)) {
			loadImage(value, data => {
				this.canvas.setBackgroundColor(
					{
						source: data.base64
					},
					this.canvas.renderAll.bind(this.canvas)
				);
			});
		} else {
			this.background.target = value;

			if (this.canvas) {
				this.canvas.setBackgroundColor(value, this.canvas.renderAll.bind(this.canvas));
			}
		}
	}

	// Layout
	@action
	createLayout_Old(callback) {
		const layoutSelected = layouts.find(l => l.id == this.layoutSelectedId) || layouts[0];

		if (layoutSelected) {
			const layoutObj = {
				id: uuid(),
				frames: []
			};

			const degToRad = (degrees) => degrees * (Math.PI / 180);

			const roundRect = (ctx, x, y, width, height, radius = 0, fill, stroke = true) => {
				if (typeof stroke == 'undefined') {
					stroke = true;
				}

				if (typeof radius === 'undefined') {
					radius = 0;
				}

				if (typeof radius === 'number') {
					radius = {
						tl: radius,
						tr: radius,
						br: radius,
						bl: radius
					};
				} else {
					const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };

					for (const side in defaultRadius) {
						radius[side] = radius[side] || defaultRadius[side];
					}
				}

				ctx.beginPath();
				ctx.moveTo(x + radius.tl, y);
				ctx.lineTo(x + width - radius.tr, y);
				ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
				ctx.lineTo(x + width, y + height - radius.br);
				ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
				ctx.lineTo(x + radius.bl, y + height);
				ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
				ctx.lineTo(x, y + radius.tl);
				ctx.quadraticCurveTo(x, y, x + radius.tl, y);
				ctx.closePath();

				if (fill) {
					ctx.fill();
				}

				if (stroke) {
					ctx.stroke();
				}
			};

			const clipByName = (ctx, image, slot) => {
				ctx.translate(this.this.spacing, this.this.spacing);

				const scaleXTo1 = (1 / image.scaleX);
				const scaleYTo1 = (1 / image.scaleY);

				// Save context of the canvas so it can be restored after the clipping
				ctx.save();
				ctx.rotate(degToRad(image.angle * -1));
				ctx.scale(scaleXTo1, scaleYTo1);

				const boundingRect = image.getBoundingRect();

				if (this.roundness) {
					roundRect(ctx,
						slot.left - image.left - Math.floor(boundingRect.width / 2),
						slot.top - image.top - Math.floor(boundingRect.height / 2),
						slot.width,
						slot.height,
						this.roundness,
						false,
						false
					);
				} else {
					ctx.beginPath();
					ctx.rect(
						slot.left - image.left - Math.floor(boundingRect.width / 2),
						slot.top - image.top - Math.floor(boundingRect.height / 2),
						slot.width,
						slot.height
					);
					ctx.stroke();
					ctx.closePath();
				}

				// Restore the original context.
				ctx.restore();
			};

			layoutSelected.frames.forEach((frame, idx) => {
				const id = uuid();
				const frameObj = {
					id,
					type: frame.type,
					width: 0,
					height: 0,
					x: 0,
					y: 0,
					points: [],
					target: this.images[idx],
					instanceRect: null,
					instanceImage: null
				};

				frameObj.width = this.width * frame.width / 100;
				frameObj.height = this.height * frame.height / 100;
				frameObj.x = this.width * frame.x / 100;
				frameObj.y = this.height * frame.y / 100;

				frameObj.instanceRect = new fabric.Rect({
					left: frameObj.x,
					top: frameObj.y,
					fill: 'transparent',
					width: frameObj.width - (this.this.spacing * 2),
					height: frameObj.height - (this.this.spacing * 2),
					scaleX: 1,
					scaleY: 1,
					hasControls: false,
					hasRotatingPoint: false,
					lockMovementX: true,
					lockMovementY: true,
					selectable: false,
					strokeWidth: this.this.spacing
				});

				layoutObj.frames.push(frameObj);
				this.canvas.add(frameObj.instanceRect);

				if (frameObj.type == 'image' && frameObj.target) {
					let drawWidth = 0;
					let drawHeight = 0;
					let drawX = 0;
					let drawY = 0;
					const aspectW = frameObj.width / frameObj.target.naturalWidth;
					const aspectH = frameObj.height / frameObj.target.naturalHeight;

					if (aspectW > aspectH) {
						drawWidth = frameObj.target.naturalWidth * aspectW;
						drawHeight = frameObj.target.naturalHeight * aspectW;
					} else {
						drawWidth = frameObj.target.naturalWidth * aspectH;
						drawHeight = frameObj.target.naturalHeight * aspectH;
					}

					drawX = (frameObj.width / 2) - (drawWidth / 2) + frameObj.x;

					drawY = (frameObj.height / 2) - (drawHeight / 2) + frameObj.y;

					frameObj.instanceImage = new fabric.Image(frameObj.target, {
						width: drawWidth,
						height: drawHeight,
						left: drawX,
						top: drawY,
						hasControls: false,
						clipName: id,
						borderOpacityWhenMoving: 0,
						hasBorders: false,
						perPixelTargetFind: true,
						clipTo(ctx) {
							return _.bind(clipByName, frameObj.instanceImage)(ctx, frameObj.instanceImage, frameObj.instanceRect, frameObj);
						}
					});

					frameObj.instanceImage.on('moving', (e) => {
						const actObj = e.target;
						const coords = actObj.calcCoords();
						const left = coords.tl.x;
						const top = coords.tl.y;

						//new
						const cv = document.getElementById('canvas');
						const post = cv.getBoundingClientRect();

						let cursorWidth = 100;
						let cursorHeight = 100;
						const x = post.x;
						const y = post.y;

						const scale = Math.round(this.scale * 100);
						const frameXReal = frameObj.x * scale / 100;
						const frameYReal = frameObj.y * scale / 100;
						const frameWidthReal = frameObj.width * scale / 100;
						const frameHeightReal = frameObj.height * scale / 100;

						const rate = this.images[idx].width / this.images[idx].height;

						if (rate > 1) {
							cursorWidth = 100;
							cursorHeight = 100 / rate;
						} else {
							cursorWidth = 100 * rate;
							cursorHeight = 100;
						}

						let img = document.getElementById('cursor-img');

						if (!img) {
							img = document.createElement('img');
							img.src = this.images[idx].src;
							img.setAttribute('id', 'cursor-img');
							img.style.position = 'absolute';
							img.style.top = `${e.e.y}px`;
							img.style.left = `${e.e.x}px`;
							img.style.zIndex = 99999999999;
							img.width = cursorWidth;
							img.height = cursorHeight;
							const body = document.getElementsByTagName('body');
							body[0].appendChild(img);
						}
						else {
							img.style.top = `${e.e.y}px`;
							img.style.left = `${e.e.x}px`;
						}

						if (e.e.x < x + frameXReal) {
							// document.body.style.cursor = `url('${imageToDataUri(frameObj.target, cursorWidth, cursorHeight)}'), auto`;
						}
						else if (e.e.y < y + frameYReal) {
							// document.body.style.cursor = `url('${imageToDataUri(frameObj.target, cursorWidth, cursorHeight)}'), auto`;
						}
						else if (e.e.x > x + frameXReal + frameWidthReal) {
							// document.body.style.cursor = `url('${imageToDataUri(frameObj.target, cursorWidth, cursorHeight)}'), auto`;
						}
						else if (e.e.y > y + frameYReal + frameHeightReal) {
							// document.body.style.cursor = `url('${imageToDataUri(frameObj.target, cursorWidth, cursorHeight)}'), auto`;
						}
						else {
							document.body.style.cursor = 'auto';
							if (img) {
								img.remove();
							}
						}

						frameObj.instanceImage.on('moved', function (e) {
							document.body.style.cursor = 'auto';
							if (img) {
								img.remove();
							}
						})
						// new

						if (left > frameObj.x) {
							frameObj.instanceImage.set('left', frameObj.x);
						}

						if (top > frameObj.y) {
							frameObj.instanceImage.set('top', frameObj.y);
						}

						if ((frameObj.width - drawWidth + frameObj.x) >= (left)) {
							frameObj.instanceImage.set('left', frameObj.width - drawWidth + frameObj.x);
						}

						if ((frameObj.height - drawHeight + frameObj.y) >= (top)) {
							frameObj.instanceImage.set('top', frameObj.height - drawHeight + frameObj.y);
						}

						return {
							left,
							top
						};
					});

					frameObj.instanceImage.on('moved', (e) => {
						const actObj = e.target;
						const coords = actObj.calcCoords();
						const left = coords.tl.x;
						const top = coords.tl.y;

						//new
						const imgLink = this.images[idx].src;
						const cv = document.getElementById('canvas');
						const post = cv.getBoundingClientRect();

						const x = post.x;
						const y = post.y;

						const scale = Math.round(this.scale * 100);
						const frameXReal = frameObj.x * scale / 100;
						const frameYReal = frameObj.y * scale / 100;
						const frameWidthReal = frameObj.width * scale / 100;
						const frameHeightReal = frameObj.height * scale / 100;
						const layoutWidthReal = this.width * scale / 100;
						const layoutHeightReal = this.height * scale / 100;

						const rate = this.images[idx].width / this.images[idx].height;

						if ((e.e.x < x + frameXReal ||
							e.e.y < y + frameYReal ||
							e.e.x > x + frameXReal + frameWidthReal ||
							e.e.y > y + frameYReal + frameHeightReal)
							&&
							e.e.x > x &&
							e.e.y > y &&
							e.e.x < x + layoutWidthReal &&
							e.e.y < y + layoutHeightReal
						) {
							const clone = this.images[0];
							this.images[0] = this.images[1];
							this.images[1] = clone;

							// frameObj.target = this.images[idx];

							// frameObj.instanceImage.clipTo = function(ctx) {
							// 	_.bind(clipByName, frameObj.instanceImage)(ctx, frameObj.instanceImage, frameObj.instancePolygon, frameObj);
							// };
							// this.objects = []
							// this.createLayout();
							this.rerenderKey = Date.now();
						}
					});

					this.canvas.add(frameObj.instanceImage);
				}
			});

			this.canvas.renderAll();

			this.layout = layoutObj;

			this.getMainColorCanvas();

			if (isFunction(callback)) callback(layoutObj);

		}
	}

	@action
	createLayout(callback) {
		const layoutSelected = layouts.find(l => l.id == this.layoutSelectedId) || layouts[0];

		if (layoutSelected) {
			const layoutObj = {
				id: uuid(),
				frames: []
			};

			layoutSelected.frames.forEach((frame, idx) => {
				// if (idx == 0) {
				const id = uuid();
				const frameObj = {
					id,
					type: frame.type,
					width: 0,
					height: 0,
					x: 0,
					y: 0,
					xMax: 0,
					yMax: 0,
					xMin: 0,
					yMin: 0,
					points: [],
					direction: frame.direction,
					polygonType: frame.polygonType,
					cornerRadius: frame.cornerRadius,
					cornerCheckAfter: frame.cornerCheckAfter,
					cornerSquare: frame.cornerSquare,
					target: this.images[idx],
					instancePolygon: null,
					instanceImage: null
				};
				let xMin, xMax, yMin, yMax;

				frame.points.forEach((point, idx) => {
					frameObj.points.push({
						x: Math.round(this.width * point.x / 100),
						y: Math.round(this.height * point.y / 100)
					});

					frameObj.xMin = Math.round(this.width * frame.xMin / 100);
					frameObj.xMax = Math.round(this.width * frame.xMax / 100);
					frameObj.yMin = Math.round(this.height * frame.yMin / 100);
					frameObj.yMax = Math.round(this.height * frame.yMax / 100);

					if (frameObj.points[idx].x < xMin || isUndefined(xMin)) {
						xMin = frameObj.points[idx].x;
					}

					if (frameObj.points[idx].x > xMax || isUndefined(xMax)) {
						xMax = frameObj.points[idx].x;
					}

					if (frameObj.points[idx].y < yMin || isUndefined(yMin)) {
						yMin = frameObj.points[idx].y;
					}

					if (frameObj.points[idx].y > yMax || isUndefined(yMax)) {
						yMax = frameObj.points[idx].y;
					}
				});

				frameObj.width = xMax - xMin;
				frameObj.height = yMax - yMin;
				frameObj.x = xMin;
				frameObj.y = yMin;

				frameObj.instancePolygon = new fabric.Polygon(
					frameObj.points,
					{
						hasControls: false,
						hasRotatingPoint: false,
						lockMovementX: true,
						lockMovementY: true,
						selectable: false,
						objectCaching: false,
						clipFor: id,
						fill: 'transparent',
						strokeWidth: this.spacing,
						stroke: 'transparent'
					}
				);

				layoutObj.frames.push(frameObj);
				this.canvas.add(frameObj.instancePolygon);

				if (frameObj.type == 'image' && frameObj.target) {
					let drawWidth = 0;
					let drawHeight = 0;
					let drawX = 0;
					let drawY = 0;
					const aspectW = frameObj.width / frameObj.target.naturalWidth;
					const aspectH = frameObj.height / frameObj.target.naturalHeight;

					if (aspectW > aspectH) {
						drawWidth = frameObj.target.naturalWidth * aspectW;
						drawHeight = frameObj.target.naturalHeight * aspectW;
					} else {
						drawWidth = frameObj.target.naturalWidth * aspectH;
						drawHeight = frameObj.target.naturalHeight * aspectH;
					}

					drawX = (frameObj.width / 2) - (drawWidth / 2) + frameObj.x;

					drawY = (frameObj.height / 2) - (drawHeight / 2) + frameObj.y;

					// frameObj.instanceImage = new fabric.Image(frameObj.target, {
						// width: drawWidth,
						// height: drawHeight,
						// left: drawX,
						// top: drawY,
						// hasControls: false,
						// clipName: id,
						// borderOpacityWhenMoving: 0,
						// hasBorders: false,
						// perPixelTargetFind: true,
						// clipTo(ctx) {
						// 	return clipByName.bind(frameObj.instanceImage)(ctx, frameObj.instanceImage, frameObj.instancePolygon, frameObj, idx);
						// }
					// });

					frameObj.instanceImage = new fabric.Image(frameObj.target, {
						width: drawWidth,
						height: drawHeight,
						left: drawX,
						top: drawY,
						hasControls: false,
						clipName: id,
						borderOpacityWhenMoving: 0,
						hasBorders: false,
						perPixelTargetFind: true,
						polygon: frameObj.instancePolygon,
						obj: frameObj,
						roundness: this.roundness,
						spacing: this.spacing
					});

					frameObj.instanceImage.clipTo = (ctx) => {

						let image = frameObj.instanceImage;
						let frame = frameObj;

						const degToRad = (degrees) => degrees * (Math.PI / 180);

						const calculate = (x, y, cR, radius = 0, cNum = 0, cCa = false, mM, dr, pt) => {
							let xR, yR, iK, aB, bC, kC;

							if (cR == 90) {
								if (cNum == 1) {
									xR = x + radius;
									yR = y;
								} else if (cNum == 2) {
									if (pt && pt == 'triangle' && dr == 'right' && y > 0) {
										xR = x - radius;
										yR = y;
									} else if (pt && pt == 'triangle' && dr == 'right' && y < 0) {
										xR = x;
										yR = y + radius;
									} else {
										xR = x;
										yR = y + radius;
									}
								} else if (cNum == 3) {
									if (pt && pt == 'triangle' && dr == 'left') {
										xR = x;
										yR = y - radius;
									} else {
										xR = x - radius;
										yR = y;
									}
								} else if (cNum == 4) {
									xR = x;
									yR = y - radius;
								}
							} else if (cR > 90) {
								if (cCa) {
									if (dr == 'top' || dr == 'bottom') {
										aB = Math.abs(mM.yMax - mM.yMin); bC = mM.xMax; kC = bC - radius;
										iK = aB * kC / bC;

										if (dr == 'top') {
											xR = x + radius;
										} else if (dr == 'bottom') {
											xR = x - radius;
										}
									} else if (dr == 'left' || dr == 'right') {
										aB = Math.abs(mM.xMax - mM.xMin); bC = mM.yMax; kC = bC - radius;
										iK = aB * kC / bC;

										if (dr == 'left') {
											xR = mM.xM - iK;
										} else if (dr == 'right') {
											xR = mM.xM + iK;
										}
									}
								} else {
									if (dr == 'top' || dr == 'bottom') {
										aB = Math.abs(mM.yMax - mM.yMin); bC = mM.xMax; kC = bC - radius;
										iK = aB * kC / bC;

										if (dr == 'top') {
											xR = x - radius;
										} else if (dr == 'bottom') {
											xR = x + radius;
										}
									} else if (dr == 'left' || dr == 'right') {
										aB = Math.abs(mM.xMax - mM.xMin); bC = mM.yMax; kC = bC - radius;
										iK = aB * kC / bC;

										if (dr == 'left') {
											xR = mM.xM - iK;
										} else if (dr == 'right') {
											xR = mM.xM + iK;
										}
									}
								}

								if (dr == 'top' || dr == 'bottom') {
									if (dr == 'top') {
										yR = mM.yM - iK;
									} else if (dr == 'bottom') {
										yR = mM.yM + iK;
									}
								} else if (dr == 'left' || dr == 'right') {
									if (dr == 'left') {
										if (cCa) {
											yR = y - radius;
										} else {
											yR = y + radius;
										}
									} else if (dr == 'right') {
										if (cCa) {
											yR = y + radius;
										} else {
											yR = y - radius;
										}
									}
								}
							} else if (cR < 90 && cR != 45) {
								if (dr == 'top' || dr == 'bottom') {
									aB = Math.abs(mM.yMax - mM.yMin); bC = mM.xMax; kC = radius;
									iK = aB * kC / bC;

									if (dr == 'top') {
										if (cCa) {
											xR = x + radius;
										} else {
											xR = x - radius;
										}
										yR = mM.yM - iK;
									} else if (dr == 'bottom') {
										if (cCa) {
											xR = x - radius;
										} else {
											xR = x + radius;
										}
										yR = mM.yM + iK;
									}
								} else if (dr == 'left' || dr == 'right') {
									aB = Math.abs(mM.xMax - mM.xMin); bC = mM.yMax; kC = radius;
									iK = aB * kC / bC;

									if (dr == 'left') {
										xR = mM.xM - iK;
										if (cCa) {
											yR = y - radius;
										} else {
											yR = y + radius;
										}
									} else if (dr == 'right') {
										xR = mM.xM + iK;
										if (cCa) {
											yR = y + radius;
										} else {
											yR = y - radius;
										}
									}
								}
							} else if (cR == 45) {
								aB = mM.yMax; bC = mM.xMax; kC = radius;
								iK = aB * kC / bC;

								if (cCa) {
									if (dr == 'left') {
										if (cNum == 3) {
											xR = x + radius;
										} else if (cNum == 2) {
											xR = x - radius;
										}
										yR = mM.yM - iK;
									} else if (dr == 'right') {
										if (cNum == 1 && x > 0) {
											xR = x - radius;
										} else if (cNum == 1 && x < 0) {
											xR = x + radius;
										}
										yR = y + iK;
									}
								} else {
									if (dr == 'left') {
										if (cNum == 1) {
											xR = x + radius;
										} else {
											xR = mM.xM - radius;
										}
										yR = y + iK;
									} else if (dr == 'right') {
										if (cNum == 3 && x > 0) {
											xR = x - radius;
										} else if (cNum == 3 && x < 0) {
											xR = x + radius;
										}
										yR = y - iK;
									}
								}
							}

							return { xR, yR }
						}

						const roundPolygon = (ctx, c1, c2, c3, c4, mM = {}, dr, pt, radius = 0, fill, stroke = true) => {
							if (typeof stroke == 'undefined') {
								stroke = true;
							}

							if (typeof radius === 'undefined') {
								radius = 0;
							}

							if (typeof radius === 'number') {
								radius = {
									tl: radius,
									tr: radius,
									br: radius,
									bl: radius
								};
							} else {
								const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };

								for (const side in defaultRadius) {
									radius[side] = radius[side] || defaultRadius[side];
								}
							}

							if (dr == 'top' || dr == 'bottom') {
								if (dr == 'top') {
									if (c4.cR > 90) {
										mM.yM = c3.y;
									} else {
										mM.yM = c4.y;
									}
								}
								if (dr == 'bottom') {
									if (c2.cR > 90) {
										mM.yM = c1.y;
									} else {
										mM.yM = c2.y;
									}
								}
							}

							if (dr == 'left' || dr == 'right') {
								if (dr == 'left') {
									if (c3.cR < 90 && c3.cR != 45) {
										mM.xM = c3.x;
									} else if (c3.cR > 90) {
										mM.xM = c2.x;
									}
									if (c3.cR == 90 || c3.cR == 45) {
										mM.yM = c3.y;
										mM.xM = c2.x;
									}
								}
								if (dr == 'right') {
									if (c1.cR < 90 && c1.cR != 45) {
										mM.xM = c1.x;
									} else if (c1.cR > 90) {
										mM.xM = c4.x;
									}
								}
							}

							let c1New = calculate(c1.x, c1.y, c1.cR, radius.tl, 1, c1.cCa, mM, dr, pt);
							let c2New = calculate(c2.x, c2.y, c2.cR, radius.tr, 2, c2.cCa, mM, dr, pt);
							let c3New = calculate(c3.x, c3.y, c3.cR, radius.br, 3, c3.cCa, mM, dr, pt);
							let c4New;
							if (c4 != null) {
								c4New = calculate(c4.x, c4.y, c4.cR, radius.bl, 4, c4.cCa, mM, dr, pt);
							}

							// start c1
							ctx.moveTo(c1.x, c1.y);

							// start c2
							if (c2.cCa) {
								ctx.lineTo(c2New.xR, c2New.yR);
								if (c4 != null) {
									ctx.quadraticCurveTo(c2.x, c2.y, c2.x, c2.y + radius.tr);
								} else {
									ctx.quadraticCurveTo(c2.x, c2.y, c2.x - radius.tr, c2.y);
								}
							} else {
								if (c1.x > 0) {
									if (c4 != null) {
										// ctx.lineTo(c2.x, c2.y - radius.tr);
										ctx.lineTo(c2.x - radius.tr, c2.y);
									} else {
										ctx.lineTo(c2.x, c2.y - radius.tr);
									}
								} else {
									ctx.lineTo(c2.x - radius.tr, c2.y);
								}
								ctx.quadraticCurveTo(c2.x, c2.y, c2New.xR, c2New.yR);
							}

							// start c3
							if (c3.cCa) {
								ctx.lineTo(c3New.xR, c3New.yR);
								if (c4 != null) {
									ctx.quadraticCurveTo(c3.x, c3.y, c3.x - radius.br, c3.y);
								} else {
									ctx.quadraticCurveTo(c3.x, c3.y, c3.x, c3.y - radius.br);
								}
							} else {
								if (c4 != null) {
									if (c1.x > 0 || c3.x < 0) {
										// ctx.lineTo(c3.x + radius.br, c3.y);
										ctx.lineTo(c3.x, c3.y - radius.br);
									} else {
										ctx.lineTo(c3.x, c3.y - radius.br);
									}
								} else {
									if (dr == 'left' && c3.cR == 90) {
										ctx.lineTo(c3.x + radius.br, c3.y);
									} else {
										if (dr == 'right' && c1.x > 0) {
											ctx.lineTo(c3.x + radius.br, c3.y);
										} else {
											ctx.lineTo(c3.x, c3.y - radius.br);
										}
									}
								}
								ctx.quadraticCurveTo(c3.x, c3.y, c3New.xR, c3New.yR);
							}

							// start c4
							if (c4 != null) {
								if (c4.cCa) {
									ctx.lineTo(c4New.xR, c4New.yR);
									ctx.quadraticCurveTo(c4.x, c4.y, c4.x, c4.y - radius.bl);
								} else {
									ctx.lineTo(c4.x + radius.bl, c4.y);
									ctx.quadraticCurveTo(c4.x, c4.y, c4New.xR, c4New.yR);
								}
							}

							// back c1
							if (c1.cCa) {
								ctx.lineTo(c1New.xR, c1New.yR);
								if (c4 != null) {
									if (c1.x > 0) {
										// ctx.quadraticCurveTo(c1.x, c1.y, c1.x, c1.y + radius.tl);
										ctx.quadraticCurveTo(c1.x, c1.y, c1.x + radius.tl, c1.y);
									} else {
										ctx.quadraticCurveTo(c1.x, c1.y, c1.x + radius.tl, c1.y);
									}
								} else {
									if (c1.x > 0) {
										// ctx.quadraticCurveTo(c1.x, c1.y, c1.x, c1.y + radius.tl);
										ctx.quadraticCurveTo(c1.x, c1.y, c1.x, c1.y + radius.tl);
									} else {
										ctx.quadraticCurveTo(c1.x, c1.y, c1.x + radius.tl, c1.y);
									}
								}
							} else {
								ctx.lineTo(c1.x, c1.y + radius.tl);
								ctx.quadraticCurveTo(c1.x, c1.y, c1New.xR, c1New.yR);
							}

							if (fill) {
								ctx.fill();
							}

							if (stroke) {
								ctx.stroke();
							}
						};

						// const clipByName = function (ctx, image, slot, frame) {

							const scaleXTo1 = (1 / image.scaleX);
							const scaleYTo1 = (1 / image.scaleY);

							ctx.save();
							ctx.rotate(degToRad(image.angle * -1));
							ctx.scale(scaleXTo1, scaleYTo1);

							const boundingRect = image.getBoundingRect();

							ctx.beginPath();

							if (this.roundness) {

								// if (idx == 1) {

								if (frame.points[3]) {
									roundPolygon(ctx,
										{
											x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
											y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
											cR: frame.cornerRadius.r1,
											cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
										},
										{
											x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
											y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
											cR: frame.cornerRadius.r2,
											cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
										},
										{
											x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
											y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
											cR: frame.cornerRadius.r3,
											cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
										},
										{
											x: frame.points[3].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
											y: frame.points[3].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
											cR: frame.cornerRadius.r4,
											cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 4) ? true : false
										},
										{
											xMin: frame.xMin,
											xMax: frame.xMax,
											yMin: frame.yMin,
											yMax: frame.yMax
										},
										frame.direction,
										frame.polygonType,
										this.roundness,
										false,
										false
									);
								} else {
									if (frame.cornerSquare == 1) {
										roundPolygon(ctx,
											{
												x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
												y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
												cR: frame.cornerRadius.r1,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
											},
											{
												x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing - this.spacing,
												y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
												cR: frame.cornerRadius.r2,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
											},
											{
												x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
												y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing - this.spacing,
												cR: frame.cornerRadius.r3,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
											},
											null,
											{
												xMin: frame.xMin,
												xMax: frame.xMax,
												yMin: frame.yMin,
												yMax: frame.yMax
											},
											frame.direction,
											frame.polygonType,
											this.roundness,
											false,
											false
										);
									}
									if (frame.cornerSquare == 2) {
										roundPolygon(ctx,
											{
												x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
												y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
												cR: frame.cornerRadius.r1,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
											},
											{
												x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
												y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
												cR: frame.cornerRadius.r2,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
											},
											{
												x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
												y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing - this.spacing,
												cR: frame.cornerRadius.r3,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
											},
											null,
											{
												xMin: frame.xMin,
												xMax: frame.xMax,
												yMin: frame.yMin,
												yMax: frame.yMax
											},
											frame.direction,
											frame.polygonType,
											this.roundness,
											false,
											false
										);
									}
									if (frame.cornerSquare == 3) {
										roundPolygon(ctx,
											{
												x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
												y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing,
												cR: frame.cornerRadius.r1,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
											},
											{
												x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
												y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
												cR: frame.cornerRadius.r2,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
											},
											{
												x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
												y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
												cR: frame.cornerRadius.r3,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
											},
											null,
											{
												xMin: frame.xMin,
												xMax: frame.xMax,
												yMin: frame.yMin,
												yMax: frame.yMax
											},
											frame.direction,
											frame.polygonType,
											this.roundness,
											false,
											false
										);
									}
									if (frame.cornerSquare == 4) {
										roundPolygon(ctx,
											{
												x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
												y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing,
												cR: frame.cornerRadius.r1,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
											},
											{
												x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing - this.spacing,
												y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
												cR: frame.cornerRadius.r2,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
											},
											{
												x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
												y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
												cR: frame.cornerRadius.r3,
												cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
											},
											null,
											{
												xMin: frame.xMin,
												xMax: frame.xMax,
												yMin: frame.yMin,
												yMax: frame.yMax
											},
											frame.direction,
											frame.polygonType,
											this.roundness,
											false,
											false
										);
									}
								}

								// }

							} else {

								if (frame.points[3]) {

									ctx.moveTo(
										frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
										frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
									);

									ctx.lineTo(
										frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
										frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
									);

									ctx.lineTo(
										frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
										frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
									);

									ctx.lineTo(
										frame.points[3].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
										frame.points[3].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
									);

									ctx.lineTo(
										frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
										frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
									);

								} else {

									if (frame.cornerSquare == 1) {
										ctx.moveTo(
											frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
											frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
										);

										ctx.lineTo(
											frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing - this.spacing,
											frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
										);

										ctx.lineTo(
											frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
											frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing - this.spacing
										);

										ctx.lineTo(
											frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
											frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
										);
									}
									if (frame.cornerSquare == 2) {
										ctx.moveTo(
											frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
											frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
										);

										ctx.lineTo(
											frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
											frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
										);

										ctx.lineTo(
											frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
											frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing - this.spacing
										);

										ctx.lineTo(
											frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
											frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
										);
									}
									if (frame.cornerSquare == 3) {
										ctx.moveTo(
											frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
											frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing
										);

										ctx.lineTo(
											frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
											frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
										);

										ctx.lineTo(
											frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
											frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
										);

										ctx.lineTo(
											frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
											frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing
										);
									}
									if (frame.cornerSquare == 4) {
										ctx.moveTo(
											frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
											frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing
										);

										ctx.lineTo(
											frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing - this.spacing,
											frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
										);

										ctx.lineTo(
											frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
											frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
										);

										ctx.lineTo(
											frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
											frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing
										);
									}

								}

							}

							ctx.closePath();
							ctx.restore();
						// };

						// return clipByName(ctx, image, polygon, frame);

					}

					this.canvas.add(frameObj.instanceImage);

					frameObj.instanceImage.on('moving', (e) => {
						const actObj = e.target;
						const coords = actObj.calcCoords();
						const left = coords.tl.x;
						const top = coords.tl.y;

						//new
						const cv = document.getElementById('canvas');
						const post = cv.getBoundingClientRect();

						let cursorWidth = 100;
						let cursorHeight = 100;
						const x = post.x;
						const y = post.y;

						const scale = Math.round(this.scale * 100);
						const frameXReal = frameObj.x * scale / 100;
						const frameYReal = frameObj.y * scale / 100;
						const frameWidthReal = frameObj.width * scale / 100;
						const frameHeightReal = frameObj.height * scale / 100;

						const rate = this.images[idx].width / this.images[idx].height;

						// rectangle: 9,7,5,13
						// polygon: 9,7,5,14
						// triangle: 9,7,5,12,13

						if (rate > 1) {
							cursorWidth = 100;
							cursorHeight = 100 / rate;
						} else {
							cursorWidth = 100 * rate;
							cursorHeight = 100;
						}

						let img = document.getElementById('cursor-img');
						if (!img) {
							img = document.createElement('img');
							img.src = this.images[idx].src;
							img.setAttribute('id', 'cursor-img');
							img.style.zIndex = 99999999999;
							img.style.position = 'absolute';
							img.style.top = `${e.e.y}px`;
							img.style.left = `${e.e.x}px`;
							img.width = cursorWidth;
							img.height = cursorHeight;
							const body = document.getElementsByTagName('body');
							body[0].appendChild(img);
						}
						else {
							img.style.top = `${e.e.y}px`;
							img.style.left = `${e.e.x}px`;
						}

						if (e.e.x < x + frameXReal) {
							// document.body.style.cursor = `url('${imageToDataUri(frameObj.target, cursorWidth, cursorHeight)}'), auto`;
						}
						else if (e.e.y < y + frameYReal) {
							// document.body.style.cursor = `url('${imageToDataUri(frameObj.target, cursorWidth, cursorHeight)}'), auto`;
						}
						else if (e.e.x > x + frameXReal + frameWidthReal) {
							// document.body.style.cursor = `url('${imageToDataUri(frameObj.target, cursorWidth, cursorHeight)}'), auto`;
						}
						else if (e.e.y > y + frameYReal + frameHeightReal) {
							// document.body.style.cursor = `url('${imageToDataUri(frameObj.target, cursorWidth, cursorHeight)}'), auto`;
						}
						else {
							document.body.style.cursor = 'auto';
							if (img) {
								img.remove();
							}
						}

						frameObj.instanceImage.on('moved', function (e) {
							document.body.style.cursor = 'auto';
							if (img) {
								img.remove();
							}
						})

						if (left > frameObj.x) {
							frameObj.instanceImage.set('left', frameObj.x);
						}

						if (top > frameObj.y) {
							frameObj.instanceImage.set('top', frameObj.y);
						}

						if ((frameObj.width - drawWidth + frameObj.x) >= left) {
							frameObj.instanceImage.set('left', frameObj.width - drawWidth + frameObj.x);
						}

						if ((frameObj.height - drawHeight + frameObj.y) >= top) {
							frameObj.instanceImage.set('top', frameObj.height - drawHeight + frameObj.y);
						}

						return {
							left,
							top
						};
					});

					frameObj.instanceImage.on('moved', (e) => {
						//new
						const cv = document.getElementById('canvas');
						const post = cv.getBoundingClientRect();

						const x = post.x;
						const y = post.y;

						const scale = Math.round(this.scale * 100);
						const frameXReal = frameObj.x * scale / 100;
						const frameYReal = frameObj.y * scale / 100;
						const frameWidthReal = frameObj.width * scale / 100;
						const frameHeightReal = frameObj.height * scale / 100;
						const layoutWidthReal = this.width * scale / 100;
						const layoutHeightReal = this.height * scale / 100;

						if ((e.e.x < x + frameXReal ||
							e.e.y < y + frameYReal ||
							e.e.x > x + frameXReal + frameWidthReal ||
							e.e.y > y + frameYReal + frameHeightReal)
							&&
							e.e.x > x &&
							e.e.y > y &&
							e.e.x < x + layoutWidthReal &&
							e.e.y < y + layoutHeightReal
						) {
							const clone = this.images[0];
							this.images[0] = this.images[1];
							this.images[1] = clone;

							frameObj.target = this.images[idx];

							frameObj.instanceImage.clipTo = (ctx) => {

								let image = frameObj.instanceImage;
								let frame = frameObj;

								const degToRad = (degrees) => degrees * (Math.PI / 180);

								const calculate = (x, y, cR, radius = 0, cNum = 0, cCa = false, mM, dr, pt) => {
									let xR, yR, iK, aB, bC, kC;

									if (cR == 90) {
										if (cNum == 1) {
											xR = x + radius;
											yR = y;
										} else if (cNum == 2) {
											if (pt && pt == 'triangle' && dr == 'right' && y > 0) {
												xR = x - radius;
												yR = y;
											} else if (pt && pt == 'triangle' && dr == 'right' && y < 0) {
												xR = x;
												yR = y + radius;
											} else {
												xR = x;
												yR = y + radius;
											}
										} else if (cNum == 3) {
											if (pt && pt == 'triangle' && dr == 'left') {
												xR = x;
												yR = y - radius;
											} else {
												xR = x - radius;
												yR = y;
											}
										} else if (cNum == 4) {
											xR = x;
											yR = y - radius;
										}
									} else if (cR > 90) {
										if (cCa) {
											if (dr == 'top' || dr == 'bottom') {
												aB = Math.abs(mM.yMax - mM.yMin); bC = mM.xMax; kC = bC - radius;
												iK = aB * kC / bC;

												if (dr == 'top') {
													xR = x + radius;
												} else if (dr == 'bottom') {
													xR = x - radius;
												}
											} else if (dr == 'left' || dr == 'right') {
												aB = Math.abs(mM.xMax - mM.xMin); bC = mM.yMax; kC = bC - radius;
												iK = aB * kC / bC;

												if (dr == 'left') {
													xR = mM.xM - iK;
												} else if (dr == 'right') {
													xR = mM.xM + iK;
												}
											}
										} else {
											if (dr == 'top' || dr == 'bottom') {
												aB = Math.abs(mM.yMax - mM.yMin); bC = mM.xMax; kC = bC - radius;
												iK = aB * kC / bC;

												if (dr == 'top') {
													xR = x - radius;
												} else if (dr == 'bottom') {
													xR = x + radius;
												}
											} else if (dr == 'left' || dr == 'right') {
												aB = Math.abs(mM.xMax - mM.xMin); bC = mM.yMax; kC = bC - radius;
												iK = aB * kC / bC;

												if (dr == 'left') {
													xR = mM.xM - iK;
												} else if (dr == 'right') {
													xR = mM.xM + iK;
												}
											}
										}

										if (dr == 'top' || dr == 'bottom') {
											if (dr == 'top') {
												yR = mM.yM - iK;
											} else if (dr == 'bottom') {
												yR = mM.yM + iK;
											}
										} else if (dr == 'left' || dr == 'right') {
											if (dr == 'left') {
												if (cCa) {
													yR = y - radius;
												} else {
													yR = y + radius;
												}
											} else if (dr == 'right') {
												if (cCa) {
													yR = y + radius;
												} else {
													yR = y - radius;
												}
											}
										}
									} else if (cR < 90 && cR != 45) {
										if (dr == 'top' || dr == 'bottom') {
											aB = Math.abs(mM.yMax - mM.yMin); bC = mM.xMax; kC = radius;
											iK = aB * kC / bC;

											if (dr == 'top') {
												if (cCa) {
													xR = x + radius;
												} else {
													xR = x - radius;
												}
												yR = mM.yM - iK;
											} else if (dr == 'bottom') {
												if (cCa) {
													xR = x - radius;
												} else {
													xR = x + radius;
												}
												yR = mM.yM + iK;
											}
										} else if (dr == 'left' || dr == 'right') {
											aB = Math.abs(mM.xMax - mM.xMin); bC = mM.yMax; kC = radius;
											iK = aB * kC / bC;

											if (dr == 'left') {
												xR = mM.xM - iK;
												if (cCa) {
													yR = y - radius;
												} else {
													yR = y + radius;
												}
											} else if (dr == 'right') {
												xR = mM.xM + iK;
												if (cCa) {
													yR = y + radius;
												} else {
													yR = y - radius;
												}
											}
										}
									} else if (cR == 45) {
										aB = mM.yMax; bC = mM.xMax; kC = radius;
										iK = aB * kC / bC;

										if (cCa) {
											if (dr == 'left') {
												if (cNum == 3) {
													xR = x + radius;
												} else if (cNum == 2) {
													xR = x - radius;
												}
												yR = mM.yM - iK;
											} else if (dr == 'right') {
												if (cNum == 1 && x > 0) {
													xR = x - radius;
												} else if (cNum == 1 && x < 0) {
													xR = x + radius;
												}
												yR = y + iK;
											}
										} else {
											if (dr == 'left') {
												if (cNum == 1) {
													xR = x + radius;
												} else {
													xR = mM.xM - radius;
												}
												yR = y + iK;
											} else if (dr == 'right') {
												if (cNum == 3 && x > 0) {
													xR = x - radius;
												} else if (cNum == 3 && x < 0) {
													xR = x + radius;
												}
												yR = y - iK;
											}
										}
									}

									return { xR, yR }
								}

								const roundPolygon = (ctx, c1, c2, c3, c4, mM = {}, dr, pt, radius = 0, fill, stroke = true) => {
									if (typeof stroke == 'undefined') {
										stroke = true;
									}

									if (typeof radius === 'undefined') {
										radius = 0;
									}

									if (typeof radius === 'number') {
										radius = {
											tl: radius,
											tr: radius,
											br: radius,
											bl: radius
										};
									} else {
										const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };

										for (const side in defaultRadius) {
											radius[side] = radius[side] || defaultRadius[side];
										}
									}

									if (dr == 'top' || dr == 'bottom') {
										if (dr == 'top') {
											if (c4.cR > 90) {
												mM.yM = c3.y;
											} else {
												mM.yM = c4.y;
											}
										}
										if (dr == 'bottom') {
											if (c2.cR > 90) {
												mM.yM = c1.y;
											} else {
												mM.yM = c2.y;
											}
										}
									}

									if (dr == 'left' || dr == 'right') {
										if (dr == 'left') {
											if (c3.cR < 90 && c3.cR != 45) {
												mM.xM = c3.x;
											} else if (c3.cR > 90) {
												mM.xM = c2.x;
											}
											if (c3.cR == 90 || c3.cR == 45) {
												mM.yM = c3.y;
												mM.xM = c2.x;
											}
										}
										if (dr == 'right') {
											if (c1.cR < 90 && c1.cR != 45) {
												mM.xM = c1.x;
											} else if (c1.cR > 90) {
												mM.xM = c4.x;
											}
										}
									}

									let c1New = calculate(c1.x, c1.y, c1.cR, radius.tl, 1, c1.cCa, mM, dr, pt);
									let c2New = calculate(c2.x, c2.y, c2.cR, radius.tr, 2, c2.cCa, mM, dr, pt);
									let c3New = calculate(c3.x, c3.y, c3.cR, radius.br, 3, c3.cCa, mM, dr, pt);
									let c4New;
									if (c4 != null) {
										c4New = calculate(c4.x, c4.y, c4.cR, radius.bl, 4, c4.cCa, mM, dr, pt);
									}

									// start c1
									ctx.moveTo(c1.x, c1.y);

									// start c2
									if (c2.cCa) {
										ctx.lineTo(c2New.xR, c2New.yR);
										if (c4 != null) {
											ctx.quadraticCurveTo(c2.x, c2.y, c2.x, c2.y + radius.tr);
										} else {
											ctx.quadraticCurveTo(c2.x, c2.y, c2.x - radius.tr, c2.y);
										}
									} else {
										if (c1.x > 0) {
											if (c4 != null) {
												// ctx.lineTo(c2.x, c2.y - radius.tr);
												ctx.lineTo(c2.x - radius.tr, c2.y);
											} else {
												ctx.lineTo(c2.x, c2.y - radius.tr);
											}
										} else {
											ctx.lineTo(c2.x - radius.tr, c2.y);
										}
										ctx.quadraticCurveTo(c2.x, c2.y, c2New.xR, c2New.yR);
									}

									// start c3
									if (c3.cCa) {
										ctx.lineTo(c3New.xR, c3New.yR);
										if (c4 != null) {
											ctx.quadraticCurveTo(c3.x, c3.y, c3.x - radius.br, c3.y);
										} else {
											ctx.quadraticCurveTo(c3.x, c3.y, c3.x, c3.y - radius.br);
										}
									} else {
										if (c4 != null) {
											if (c1.x > 0 || c3.x < 0) {
												// ctx.lineTo(c3.x + radius.br, c3.y);
												ctx.lineTo(c3.x, c3.y - radius.br);
											} else {
												ctx.lineTo(c3.x, c3.y - radius.br);
											}
										} else {
											if (dr == 'left' && c3.cR == 90) {
												ctx.lineTo(c3.x + radius.br, c3.y);
											} else {
												if (dr == 'right' && c1.x > 0) {
													ctx.lineTo(c3.x + radius.br, c3.y);
												} else {
													ctx.lineTo(c3.x, c3.y - radius.br);
												}
											}
										}
										ctx.quadraticCurveTo(c3.x, c3.y, c3New.xR, c3New.yR);
									}

									// start c4
									if (c4 != null) {
										if (c4.cCa) {
											ctx.lineTo(c4New.xR, c4New.yR);
											ctx.quadraticCurveTo(c4.x, c4.y, c4.x, c4.y - radius.bl);
										} else {
											ctx.lineTo(c4.x + radius.bl, c4.y);
											ctx.quadraticCurveTo(c4.x, c4.y, c4New.xR, c4New.yR);
										}
									}

									// back c1
									if (c1.cCa) {
										ctx.lineTo(c1New.xR, c1New.yR);
										if (c4 != null) {
											if (c1.x > 0) {
												// ctx.quadraticCurveTo(c1.x, c1.y, c1.x, c1.y + radius.tl);
												ctx.quadraticCurveTo(c1.x, c1.y, c1.x + radius.tl, c1.y);
											} else {
												ctx.quadraticCurveTo(c1.x, c1.y, c1.x + radius.tl, c1.y);
											}
										} else {
											if (c1.x > 0) {
												// ctx.quadraticCurveTo(c1.x, c1.y, c1.x, c1.y + radius.tl);
												ctx.quadraticCurveTo(c1.x, c1.y, c1.x, c1.y + radius.tl);
											} else {
												ctx.quadraticCurveTo(c1.x, c1.y, c1.x + radius.tl, c1.y);
											}
										}
									} else {
										ctx.lineTo(c1.x, c1.y + radius.tl);
										ctx.quadraticCurveTo(c1.x, c1.y, c1New.xR, c1New.yR);
									}

									if (fill) {
										ctx.fill();
									}

									if (stroke) {
										ctx.stroke();
									}
								};

								// const clipByName = function (ctx, image, slot, frame) {

									const scaleXTo1 = (1 / image.scaleX);
									const scaleYTo1 = (1 / image.scaleY);

									ctx.save();
									ctx.rotate(degToRad(image.angle * -1));
									ctx.scale(scaleXTo1, scaleYTo1);

									const boundingRect = image.getBoundingRect();

									ctx.beginPath();

									if (this.roundness) {

										// if (idx == 1) {

										if (frame.points[3]) {
											roundPolygon(ctx,
												{
													x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
													y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
													cR: frame.cornerRadius.r1,
													cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
												},
												{
													x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
													y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
													cR: frame.cornerRadius.r2,
													cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
												},
												{
													x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
													y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
													cR: frame.cornerRadius.r3,
													cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
												},
												{
													x: frame.points[3].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
													y: frame.points[3].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
													cR: frame.cornerRadius.r4,
													cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 4) ? true : false
												},
												{
													xMin: frame.xMin,
													xMax: frame.xMax,
													yMin: frame.yMin,
													yMax: frame.yMax
												},
												frame.direction,
												frame.polygonType,
												this.roundness,
												false,
												false
											);
										} else {
											if (frame.cornerSquare == 1) {
												roundPolygon(ctx,
													{
														x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
														y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
														cR: frame.cornerRadius.r1,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
													},
													{
														x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing - this.spacing,
														y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
														cR: frame.cornerRadius.r2,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
													},
													{
														x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
														y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing - this.spacing,
														cR: frame.cornerRadius.r3,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
													},
													null,
													{
														xMin: frame.xMin,
														xMax: frame.xMax,
														yMin: frame.yMin,
														yMax: frame.yMax
													},
													frame.direction,
													frame.polygonType,
													this.roundness,
													false,
													false
												);
											}
											if (frame.cornerSquare == 2) {
												roundPolygon(ctx,
													{
														x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
														y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
														cR: frame.cornerRadius.r1,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
													},
													{
														x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
														y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing,
														cR: frame.cornerRadius.r2,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
													},
													{
														x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
														y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing - this.spacing,
														cR: frame.cornerRadius.r3,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
													},
													null,
													{
														xMin: frame.xMin,
														xMax: frame.xMax,
														yMin: frame.yMin,
														yMax: frame.yMax
													},
													frame.direction,
													frame.polygonType,
													this.roundness,
													false,
													false
												);
											}
											if (frame.cornerSquare == 3) {
												roundPolygon(ctx,
													{
														x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
														y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing,
														cR: frame.cornerRadius.r1,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
													},
													{
														x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
														y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
														cR: frame.cornerRadius.r2,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
													},
													{
														x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
														y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
														cR: frame.cornerRadius.r3,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
													},
													null,
													{
														xMin: frame.xMin,
														xMax: frame.xMax,
														yMin: frame.yMin,
														yMax: frame.yMax
													},
													frame.direction,
													frame.polygonType,
													this.roundness,
													false,
													false
												);
											}
											if (frame.cornerSquare == 4) {
												roundPolygon(ctx,
													{
														x: frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
														y: frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing,
														cR: frame.cornerRadius.r1,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 1) ? true : false
													},
													{
														x: frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing - this.spacing,
														y: frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
														cR: frame.cornerRadius.r2,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 2) ? true : false
													},
													{
														x: frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
														y: frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing,
														cR: frame.cornerRadius.r3,
														cCa: (frame.cornerCheckAfter && frame.cornerCheckAfter == 3) ? true : false
													},
													null,
													{
														xMin: frame.xMin,
														xMax: frame.xMax,
														yMin: frame.yMin,
														yMax: frame.yMax
													},
													frame.direction,
													frame.polygonType,
													this.roundness,
													false,
													false
												);
											}
										}

										// }

									} else {

										if (frame.points[3]) {

											ctx.moveTo(
												frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
												frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
											);

											ctx.lineTo(
												frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
												frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
											);

											ctx.lineTo(
												frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
												frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
											);

											ctx.lineTo(
												frame.points[3].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
												frame.points[3].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
											);

											ctx.lineTo(
												frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
												frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
											);

										} else {

											if (frame.cornerSquare == 1) {
												ctx.moveTo(
													frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
													frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
												);

												ctx.lineTo(
													frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing - this.spacing,
													frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
												);

												ctx.lineTo(
													frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
													frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing - this.spacing
												);

												ctx.lineTo(
													frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
													frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
												);
											}
											if (frame.cornerSquare == 2) {
												ctx.moveTo(
													frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
													frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
												);

												ctx.lineTo(
													frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
													frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
												);

												ctx.lineTo(
													frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
													frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing - this.spacing
												);

												ctx.lineTo(
													frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
													frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing
												);
											}
											if (frame.cornerSquare == 3) {
												ctx.moveTo(
													frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
													frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing
												);

												ctx.lineTo(
													frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
													frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
												);

												ctx.lineTo(
													frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing + this.spacing,
													frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
												);

												ctx.lineTo(
													frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing,
													frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing
												);
											}
											if (frame.cornerSquare == 4) {
												ctx.moveTo(
													frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
													frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing
												);

												ctx.lineTo(
													frame.points[1].x - image.left - Math.floor(boundingRect.width / 2) - this.spacing - this.spacing,
													frame.points[1].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
												);

												ctx.lineTo(
													frame.points[2].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
													frame.points[2].y - image.top - Math.floor(boundingRect.height / 2) - this.spacing
												);

												ctx.lineTo(
													frame.points[0].x - image.left - Math.floor(boundingRect.width / 2) + this.spacing,
													frame.points[0].y - image.top - Math.floor(boundingRect.height / 2) + this.spacing + this.spacing
												);
											}

										}

									}

									ctx.closePath();
									ctx.restore();
								// };

								// return clipByName(ctx, image, polygon, frame);

							}

							// frameObj.instanceImage.clipTo = function (ctx) {
							// 	_.bind(clipByName, frameObj.instanceImage)(ctx, frameObj.instanceImage, frameObj.instancePolygon, frameObj);
							// };
							this.objects = []
							this.createLayout();
							// this.rerenderKey = Date.now();
						}
					});

				}
				// }
			});

			this.canvas.renderAll();

			this.layout = layoutObj;

			if (isFunction(callback)) callback(layoutObj);
		}
	}

	@action
	changeLayout(callback) {
		const layoutSelected = layouts.find(l => l.id == this.layoutSelectedId) || layouts[0];

		if (this.layout && layoutSelected && this.canvas) {
			this.canvas.setHeight(this.height);
			this.canvas.setWidth(this.width);

			this.layout.frames.forEach((frame, idx) => {
				let xMin, xMax, yMin, yMax;

				layoutSelected.frames[idx].points.forEach((point, idx) => {
					frame.instancePolygon.points[idx].x = frame.points[idx].x = Math.round(this.width * point.x / 100);
					frame.instancePolygon.points[idx].y = frame.points[idx].y = Math.round(this.height * point.y / 100);
					frame.instancePolygon.set({
						fill: 'red'
					});

					if (frame.points[idx].x < xMin || isUndefined(xMin)) {
						xMin = frame.points[idx].x;
					}

					if (frame.points[idx].x > xMax || isUndefined(xMax)) {
						xMax = frame.points[idx].x;
					}

					if (frame.points[idx].y < yMin || isUndefined(yMin)) {
						yMin = frame.points[idx].y;
					}

					if (frame.points[idx].y > yMax || isUndefined(yMax)) {
						yMax = frame.points[idx].y;
					}

				});

				frame.width = xMax - xMin;
				frame.height = yMax - yMin;
				frame.x = xMin;
				frame.y = yMin;

				if (frame.type == 'image' && frame.target) {
					let drawWidth = 0;
					let drawHeight = 0;
					let drawX = 0;
					let drawY = 0;
					const aspectW = frame.width / frame.target.naturalWidth;
					const aspectH = frame.height / frame.target.naturalHeight;

					if (aspectW > aspectH) {
						drawWidth = frame.target.naturalWidth * aspectW;
						drawHeight = frame.target.naturalHeight * aspectW;
					} else {
						drawWidth = frame.target.naturalWidth * aspectH;
						drawHeight = frame.target.naturalHeight * aspectH;
					}

					drawX = (frame.width / 2) - (drawWidth / 2) + frame.x;

					drawY = (frame.height / 2) - (drawHeight / 2) + frame.y;

					frame.instanceImage.scaleToHeight(drawHeight);
					frame.instanceImage.scaleToWidth(drawWidth);

					frame.instanceImage.set({
						width: drawWidth,
						height: drawHeight,
						left: drawX,
						top: drawY
					});
				}
			});

			// this.canvas.renderAll();
		}
	}

	@action
	getMainColorCanvas() {
		let canvasBase64 = this.canvas.toDataURL();

		loadImage(canvasBase64, (data) => {
			let rgb = getAverageRGB(data.target);
			let colorRGB = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
			let colorHex = "#" + ("000000" + rgbToHex(rgb.r, rgb.g, rgb.b)).slice(-6);

			this.mainColor = colorHex;

			function getAverageRGB(imgEl) {
				let blockSize = 5,
					defaultRGB = { r: 0, g: 0, b: 0 },
					canvas = document.createElement('canvas'),
					context = canvas.getContext && canvas.getContext('2d'),
					data, width, height,
					i = -4,
					length,
					rgb = { r: 0, g: 0, b: 0 },
					count = 0;

				if (!context) {
					return defaultRGB;
				}

				height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
				width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

				context.drawImage(imgEl, 0, 0);

				try {
					data = context.getImageData(0, 0, width, height);
				} catch (e) {
					alert('x');
					return defaultRGB;
				}

				length = data.data.length;

				while ((i += blockSize * 4) < length) {
					++count;
					rgb.r += data.data[i];
					rgb.g += data.data[i + 1];
					rgb.b += data.data[i + 2];
				}

				rgb.r = ~~(rgb.r / count);
				rgb.g = ~~(rgb.g / count);
				rgb.b = ~~(rgb.b / count);

				return rgb;
			}

			function rgbToHex(r, g, b) {
				if (r > 255 || g > 255 || b > 255)
					throw "Invalid color component";
				return ((r << 16) | (g << 8) | b).toString(16);
			}
		})
	}

	// Text
	@action
	createText(content = 'Nhập nội dung', options) {
		if (this.canvas) {

			const id = uuid();
			const ratio = this.width / 500;
			const opts = {
				id,
				type: 'text',
				width: 200 * ratio,
				top: 5,
				left: 5,
				fill: '#fff',
				fontFamily: 'Arial',
				fontSize: (30 * ratio).toFixed(0),
				textAlign: 'center',
				perPixelTargetFind: false,
				borderScaleFactor: 2 / this.scale,
				strokeWidth: 0,
				stroke: '#000',
				shadow: {
					color: '#000',
					blur: 0,
					offsetX: 0,
					offsetY: 0
				},
				opacity: 1,
				...options
			};
			const text = new fabric.Textbox(content, opts);

			const idR = uuid();
			const rectOpts = {
				id: idR,
				type: 'rect',
				width: 300 * ratio,
				height: 300 * ratio,
				fill: this.mainColor,
				strokeWidth: 0,
				stroke: '#000',
				opacity: 0.5,
				gradient: {
					type: 'linear',
					r1: 0,
					r2: 0,
					x1: 0,
					y1: (300 * ratio) / 2,
					x2: 300 * ratio,
					y2: (300 * ratio) / 2,
					colorStops: {
						0: "#EB5757",
						1: "#FDD24B"
					}
				},
				content: 'rect',
				borderScaleFactor: 2 / this.scale
			};
			const rectangle = new fabric.Rect(rectOpts);

			this.canvas
				.add(rectangle)
				.add(text)
				.centerObject(rectangle)
				.centerObject(text)
				.renderAll();

			rectangle.setCoords();
			text.setCoords();

			this.objects.push(
				{
					id: idR,
					type: 'rect',
					instance: rectangle,
					content: 'rect',
					options: rectOpts
				},
				{
					id,
					type: 'text',
					instance: text,
					content,
					options: opts
				}
			);

		}
	}

	@action
	changeText(id, options = {}) {
		const text = this.objects.find(o => o.id == id);

		if (text && this.canvas) {
			Object.keys(options).forEach(key => {
				const value = options[key];

				text.options[key] = value;
				text.instance.set({
					dirty: true,
					[key]: value
				});
				text.instance._removeCacheCanvas();
			});

			this.canvas.renderAll();
		}
	}

	@action
	changeTextShadow(id, options = {}) {
		const text = this.objects.find(o => o.id == id);

		if (text && this.canvas) {
			text.options.shadow = Object.assign(text.options.shadow, options);
			text.instance.setShadow(text.options.shadow);
			this.canvas.renderAll();
		}
	}

	@action
	changeBg(id, options = {}) {
		const bg = this.objects.find(o => o.id == id);

		if (bg && this.canvas) {
			bg.options = Object.assign(bg.options, options);
			bg.instance.set({
				dirty: true,
				...options
			});
			this.canvas.renderAll();
		}
	}

	@action
	changeBgGradient(id, options = {}) {
		const bg = this.objects.find(o => o.id == id);

		if (bg && this.canvas) {
			bg.options.gradient = Object.assign(bg.options.gradient, options);
			bg.instance.setGradient('fill', bg.options.gradient);
			this.canvas.renderAll();
		}
	}

	// Svg
	@action
	createSvg(svgContent, options) {
		const id = uuid();
		let opts = {
			id,
			type: 'svg',
			borderScaleFactor: 2 / this.scale,
			...options
		};

		fabric.loadSVGFromString(svgContent, (objects, options) => {
			opts = {
				...options,
				...opts
			};

			const svg = fabric.util.groupSVGElements(objects, opts);

			this.canvas.add(svg).centerObject(svg).renderAll();
			svg.setCoords();

			this.objects.push({
				id,
				type: 'svg',
				options: opts,
				instance: svg
			});
		});
	}

	@action
	changeSvg(id, options) {
		const text = this.objects.find(o => o.id == id);

		if (text && this.canvas) {
			text.options = Object.assign(text.options, options);
			text.instance.set(options);
			this.canvas.renderAll();
		}
	}

	// show adjust for object
	@action
	calculatePostionObjectActive(id, e) {
		if (this.refAdjustBox && this.refEditorArea) {
			let rectEA = this.refEditorArea.getBoundingClientRect();
			let rectAB = this.refAdjustBox.getBoundingClientRect();
			let top = e.target.top * this.scale + rectEA.top;
			let left = e.target.left * this.scale + rectEA.left;
			let wHeight = window.innerHeight; // Height window
			let wWidth = window.innerWidth; // Width window
			let abHeight = rectAB.height; // Height adjust box
			let abWidth = rectAB.width; // Width adjust box

			left += e.target.width * e.target.scaleX * this.scale + 10;

			if (top + abHeight > wHeight) {
				top = wHeight - abHeight;
			} else if (top < 0) {
				top = 0;
			}

			if (left + abWidth > wWidth) {
				left = wWidth - abWidth;
			} else if (left < 0) {
				left = 0
			}

			this.objectSelectedPosition = {
				id,
				top,
				left
			};
		}
	}
}

export default ImageLayoutStore;
