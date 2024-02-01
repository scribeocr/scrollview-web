import { ScrollView } from '../scrollview/ScrollView.js';
import fs from "fs";
import { isMainThread } from "worker_threads";
import { createCanvas } from "canvas";
import { IOLoopWrapper, processQueue, processVisStr } from "./common.js";
import { tableMapping } from "../src/constants.js";

function createCanvasNode() {
    // The Node.js canvas package does not currently support worke threads
    // https://github.com/Automattic/node-canvas/issues/1394
    if (!isMainThread) throw new Error('node-canvas is not currently supported on worker threads.');

    const canvas = createCanvas(200, 200);

    return canvas;
}

let fileBase_;
function writeCanvasNode(args) {

    const canvas = args.canvas;
    const nameFull = args.name;

    const buffer1 = canvas.toBuffer('image/png');

    if (!tableMapping[nameFull]) console.log(`Table ${nameFull} missing from order lookup, defaulting to 0.`);

    const order = tableMapping[nameFull] || 0;
    const orderStr = String(order).padStart(2, '0');

    const pathFull = `${fileBase_}_${orderStr}_${nameFull}.png`;

    fs.writeFileSync(pathFull, buffer1);
}

export class ScrollViewNode extends ScrollView {
    constructor(fileBase) {
        super(createCanvasNode, writeCanvasNode);
        fileBase_ = fileBase;
        this.processQueue = (x) => processQueue.bind(this)(x);
        this.IOLoopWrapper = (x) => IOLoopWrapper.bind(this)(x);
        this.processVisStr = (x) => processVisStr.bind(this)(x);
    }
}
