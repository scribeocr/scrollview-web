import fs from "fs";
import path from "path";
import { ScrollViewNode } from './src/ScrollViewNode.js';
import { tableMapping } from "./src/constants.js";

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


function writeCanvasNode(key, value) {

  const canvas = value.canvas;

  const buffer1 = canvas.toBuffer('image/png');

  if (!tableMapping[key]) console.log(`Table ${key} missing from order lookup, defaulting to 0.`);

  const order = tableMapping[key] || 0;
  const orderStr = String(order).padStart(2, '0');

  const pathFull = `${fileBase}_${orderStr}_${key}.png`;

  fs.writeFileSync(pathFull, buffer1);
}

for (const [key, value] of Object.entries(visObj)) {
  writeCanvasNode(key, value);
}