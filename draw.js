import { ScrollView } from './src/ScrollView.js';
import fs from "fs";
import path from "path";
import { isMainThread } from "worker_threads";
import { createCanvas } from "canvas";

const filePath = process.argv[2];
const outputBase = process.argv[3];

if (!filePath) {
  console.error("Please provide a file path as an argument.");
  process.exit(1);
}

const sv = new ScrollView();

const createCanvasNode = () => {
  // The Node.js canvas package does not currently support worke threads
  // https://github.com/Automattic/node-canvas/issues/1394
  if (!isMainThread) throw new Error('node-canvas is not currently supported on worker threads.');

  const canvas = createCanvas(200, 200);

  return canvas;
}

const writeCanvasNode = (canvas, filePath) => {
  const buffer1 = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer1);
}

sv.createCanvas = createCanvasNode;

sv.writeCanvas = writeCanvasNode;

const processInputStr = (inputStr) => {
  const inputArr = inputStr.split(/\n/).filter((x) => x);
  for (let i = 0; i < inputArr.length; i++) {
    sv.IOLoop(inputArr[i]);
  }
};

const inputData = fs.readFileSync(filePath, {encoding: "utf-8"});

processInputStr(inputData);

sv.writeAll(outputBase);