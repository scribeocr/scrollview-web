import { ScrollView } from '../scrollview/ScrollView.js';
import { isMainThread } from "worker_threads";
import { createCanvas } from "canvas";
import { IOLoopWrapper, processQueue, processVisStr } from "./common.js";
import { tableMapping } from "./constants.js";
import fs from "fs";

function createCanvasNode() {
    // The Node.js canvas package does not currently support worke threads
    // https://github.com/Automattic/node-canvas/issues/1394
    if (!isMainThread) throw new Error('node-canvas is not currently supported on worker threads.');

    const canvas = createCanvas(200, 200);

    return canvas;
}

export class ScrollViewNode extends ScrollView {
    constructor() {
        super(createCanvasNode);
        this.processQueue = (x) => processQueue.bind(this)(x);
        this.IOLoopWrapper = (x) => IOLoopWrapper.bind(this)(x);
        this.processVisStr = (x) => processVisStr.bind(this)(x);
    }
}


/**
 * @typedef {Object} DebugVis
 * @property {*} canvas - Canvas with visualization.
 * @property {*} canvasLegend - Canvas with legend, if requested.
 */

/**
 * 
 * @param {string} key 
 * @param {DebugVis} value 
 * @param {string} fileBase 
 */
export function writeCanvasNode(key, value, fileBase) {

    const canvas = value.canvas;

    const buffer1 = canvas.toBuffer('image/png');

    if (!tableMapping[key]) console.log(`Table ${key} missing from order lookup, defaulting to 0.`);

    const order = tableMapping[key] || 0;
    const orderStr = String(order).padStart(2, '0');

    const pathFull = `${fileBase}_${orderStr}_${key}.png`;

    fs.writeFileSync(pathFull, buffer1);
}

/** @type {ReturnType<typeof import('../../scrollview-web/scrollview/ScrollView.js').ScrollView.prototype.getAll>} */


/**
 * 
 * @param {ReturnType<typeof ScrollView.prototype.getAll>} visObj 
 * @param {string} fileBase 
 */
export function writeCanvasNodeAll(visObj, fileBase) {
    for (const [key, value] of Object.entries(visObj)) {
        writeCanvasNode(key, value, fileBase);
    }
}