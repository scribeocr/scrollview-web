import fs from "fs";
import path from "path";
import { ScrollViewNode, writeCanvasNodeAll } from './src/ScrollViewNode.js';

const filePath = process.argv[2];
const outputDir = process.argv[3];
const fileBase = `${outputDir}/${path.basename(filePath)}`;

if (!filePath) {
  console.error("Please provide a file path as an argument.");
  process.exit(1);
}

const sv = new ScrollViewNode();

const inputData = fs.readFileSync(filePath, { encoding: "utf-8" });

await sv.processVisStr(inputData);

const visObj = sv.getAll(false);

writeCanvasNodeAll(visObj, fileBase);