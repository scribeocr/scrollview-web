import { ScrollView } from '../scrollview/ScrollView.js';
import { isMainThread } from "worker_threads";
import { createCanvas } from "canvas";
import { IOLoopWrapper, processQueue, processVisStr } from "./common.js";

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
