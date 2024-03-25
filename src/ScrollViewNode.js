import { tableMapping } from "./constants.js";
import fs from "fs";


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


/**
 * 
 * @param {Awaited<ReturnType<typeof import('../../scrollview-web/scrollview/ScrollView.js').ScrollView.prototype.getAll>>} visObj 
 * @param {string} fileBase 
 */
export function writeCanvasNodeAll(visObj, fileBase) {
    for (const [key, value] of Object.entries(visObj)) {
        writeCanvasNode(key, value, fileBase);
    }
}