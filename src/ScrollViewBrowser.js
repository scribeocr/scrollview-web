import { ScrollView } from '../scrollview/ScrollView.js';
import { IOLoopWrapper, processQueue, processVisStr } from "./common.js";

const createCanvasBrowser = () => {

    const canvas = new OffscreenCanvas(200, 200);

    return canvas;
}

// const writeCanvasBrowser = async (canvas, filePath) => {
//     // const blob1 = await canvas.convertToBlob();

//     // return blob1;
//     return canvas;
// }

export class ScrollViewBrowser extends ScrollView {
    constructor(lightTheme) {
        super(createCanvasBrowser, lightTheme);
        this.processQueue = (x) => processQueue.bind(this)(x);
        this.IOLoopWrapper = (x) => IOLoopWrapper.bind(this)(x);
        this.processVisStr = (x) => processVisStr.bind(this)(x);
    }
}
