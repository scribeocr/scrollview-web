import fs from "fs";
import { ScrollViewNode } from './src/ScrollViewNode.js';

const filePath = process.argv[2];
const outputBase = process.argv[3];

if (!filePath) {
  console.error("Please provide a file path as an argument.");
  process.exit(1);
}

const sv = new ScrollViewNode(outputBase);

const inputData = fs.readFileSync(filePath, { encoding: "utf-8" });

await sv.processVisStr(inputData);

await sv.writeAll();