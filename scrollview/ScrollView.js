import { SVWindow } from './ui/SVWindow.js';
import { SVImageHandler } from "./ui/SVImageHandler.js";

/**
 * There should never be more than 1 `ScrollView` object, as the use of `static` properties creates issues.
 * This is inherited from how the Java ScrollView code is written.
 * This can likely be fixed if having multiple `ScrollView` objects is determined to be necessary,
 * as this only impacts the polyLine drawing code.
 */
export class ScrollView {

  constructor(createCanvas, writeCanvas) {
    this.createCanvas = createCanvas;
    this.writeCanvas = writeCanvas;
  }


  /** @type {Object.<string, SVWindow>} */
  windows = {};

  // Some window names are re-used.  For example, "With Images" may appear multiple times.
  // When multiple windows are created with the same name, a number is appended to make the file names unique.
  nameCount = {};

  async writeAll(key) {
    if (!this.windows) {
      console.log("No windows currently exist.")
      return;
    }

    // const outputObj = {};

    for (const [key, value] of Object.entries(this.windows)) {
      if (!this.windows[key].writeCanvas) {
        throw new Error("writeCanvas method must be defined prior to running processInput.");
      }

      const name = this.windows[key].name;

      if (this.nameCount[name] === undefined) this.nameCount[name] = 0;

      this.nameCount[name]++;

      const nameFull = `${name}_${String(this.nameCount[name])}`;

      await this.windows[key].writeCanvas({ "canvas": this.windows[key].canvas, "name": nameFull });

      // await this.windows[key].writeCanvas(this.windows[key].canvas, pathFull);

      // outputObj[nameFull] = output;
    }

    // return outputObj;
  }

  /**
     * Parse a comma-separated list of arguments into arrays of different types.
     * @param {string} argList - The argument list as a string.
     * @param {number[]} intList - Array to store integers.
     * @param {number[]} floatList - Array to store floats.
     * @param {string[]} stringList - Array to store strings.
     * @param {boolean[]} boolList - Array to store booleans.
     */
  static parseArguments(argList, intList, floatList, stringList, boolList) {
    let str = null;
    const intPattern = /^[0-9-][0-9]*$/;
    const floatPattern = /^[0-9-][0-9]*\\.[0-9]*$/;

    argList.split(',').forEach((argStr) => {
      if (str !== null) {
        str += `,${argStr}`;
      } else if (argStr.length === 0) {
        return;
      } else {
        const quote = argStr.charAt(0);
        if (quote === '\'' || quote === '"') {
          str = argStr;
        }
      }
      if (str !== null) {
        const quote = str.charAt(0);
        const len = str.length;
        if (len > 1 && str.charAt(len - 1) === quote) {
          let slash = len - 1;
          while (slash > 0 && str.charAt(slash - 1) === '\\') --slash;
          if ((len - 1 - slash) % 2 === 0) {
            stringList.push(str.substring(1, len - 1).replace(/\\(.)/g, '$1'));
            str = null;
          }
        }
      } else if (floatPattern.test(argStr)) {
        floatList.push(parseFloat(argStr));
      } else if (argStr === 'true') {
        boolList.push(true);
      } else if (argStr === 'false') {
        boolList.push(false);
      } else if (intPattern.test(argStr)) {
        intList.push(parseInt(argStr, 10));
      }
    });

    if (str !== null) {
      throw new Error('Unterminated string');
    }
  }

  /**
   * Split function that replicates Java `split` method behavior,
   * with all text after `limit` being included in the final element.
   *
   * @param {string} string
   * @param {*} pattern
   * @param {*} limit
   */
  static splitJava(string, pattern, limit) {
    let idStrs = string.split(pattern); // Split without a limit

    if (idStrs.length > limit) {
      // If there are more elements than the limit, concatenate the rest back into the last element
      idStrs = idStrs.slice(0, limit - 1).concat(idStrs.slice(limit - 1).join(' '));
    }
    return idStrs;
  }

  // Using static properties in the `ScrollView` class to hold data used by `SVWindow` is the wrong way to implement,
  // however keeping this for now because this is how the Java code for ScrollView works.
  /** @type {Array<number>} */
  static polylineXCoords = [];

  /** @type {Array<number>} */
  static polylineYCoords = [];

  static polylineSize = 0;

  static polylineScanned = 0;

  imageWaiting = false;

  imageXPos = 0;

  imageYPos = 0;

  imageWindowID = 0;


  /**
   *
   * @param {string} inputLine
   */
  async IOLoop(inputLine) {
    if (!inputLine) return;

    if (ScrollView.polylineSize > ScrollView.polylineScanned) {
      // We are processing a polyline.
      // Read pairs of coordinates separated by commas.
      let first = true;
      for (const coordStr of inputLine.replace(/[,\s]+$/, '').split(',')) {
        const coord = Number.parseInt(coordStr);
        if (first) {
          ScrollView.polylineXCoords[ScrollView.polylineScanned] = coord;
        } else {
          ScrollView.polylineYCoords[ScrollView.polylineScanned++] = coord;
        }
        first = !first;
      }
      console.assert(first);
    } else if (this.imageWaiting) {
      const image = await SVImageHandler.readImage(inputLine);
      this.windows[this.imageWindowID].drawImageInternal(image, this.imageXPos, this.imageYPos);
      this.imageWaiting = false;
    } else {
      // Process this normally.
      await this.processInput(inputLine);
    }
  }

  /**
     * Processes a command line input, interpreting and executing it as needed.
     * @param {string} inputLine - The input command line.
     */
  async processInput(inputLine) {
    if (!inputLine) {
      return;
    }

    if (!this.createCanvas) {
      throw new Error("createCanvas method must be defined prior to running processInput.")
    }

    // Check if the command starts with 'w', indicating a window operation
    if (inputLine.charAt(0) === 'w') {
      // Parse the command without the leading 'w'
      const noWLine = inputLine.substring(1);
      const idStrs = this.constructor.splitJava(noWLine, /[ :]/, 2);
      const windowID = parseInt(idStrs[0], 10);

      // Find the parentheses to isolate arguments
      const start = inputLine.indexOf('(');
      const end = inputLine.lastIndexOf(')');

      // Arrays to hold parsed arguments
      const intList = [];
      const floatList = [];
      const stringList = [];
      const boolList = [];

      // Assuming parseArguments is already defined and adapted to JavaScript
      this.constructor.parseArguments(inputLine.substring(start + 1, end), intList, floatList, stringList, boolList);

      const colon = inputLine.indexOf(':');
      if (colon > 1 && colon < start) {
        // Extract the function name
        const func = inputLine.substring(colon + 1, start);

        // Call the appropriate function on the window object
        // Assuming this.windows is an array of objects with methods as defined in Java
        switch (func) {
          case 'drawLine':
            this.windows[windowID].drawLine(intList[0], intList[1], intList[2], intList[3]);
            break;
          case 'createPolyline':
            this.windows[windowID].createPolyline(intList[0]);
            break;
          case 'drawPolyline':
            this.windows[windowID].drawPolyline();
            break;
          case 'drawRectangle':
            this.windows[windowID].drawRectangle(intList[0], intList[1], intList[2], intList[3]);
            break;
          case 'setVisible':
            this.windows[windowID].setVisible(boolList[0]);
            break;
          case 'setAlwaysOnTop':
            this.windows[windowID].setAlwaysOnTop(boolList[0]);
            break;
          case 'addMessage':
            this.windows[windowID].addMessage(stringList[0]);
            break;
          case 'addMessageBox':
            this.windows[windowID].addMessageBox();
            break;
          case 'clear':
            this.windows[windowID].clear();
            break;
          case 'setStrokeWidth':
            this.windows[windowID].setStrokeWidth(floatList[0]);
            break;
          case 'drawEllipse':
            this.windows[windowID].drawEllipse(intList[0], intList[1], intList[2], intList[3]);
            break;
          case 'pen':
            if (intList.length === 4) {
              this.windows[windowID].pen(intList[0], intList[1], intList[2], intList[3]);
            } else {
              this.windows[windowID].pen(intList[0], intList[1], intList[2]);
            }
            break;
          case 'brush':
            if (intList.length === 4) {
              this.windows[windowID].brush(intList[0], intList[1], intList[2], intList[3]);
            } else {
              this.windows[windowID].brush(intList[0], intList[1], intList[2]);
            }
            break;
          case 'textAttributes':
            this.windows[windowID].textAttributes(stringList[0], intList[0], boolList[0], boolList[1], boolList[2]);
            break;
          case 'drawText':
            this.windows[windowID].drawText(intList[0], intList[1], stringList[0]);
            break;
          case 'addMenuBarItem':
            if (boolList.length > 0) {
              this.windows[windowID].addMenuBarItem(stringList[0], stringList[1], intList[0], boolList[0]);
            } else if (intList.length > 0) {
              this.windows[windowID].addMenuBarItem(stringList[0], stringList[1], intList[0]);
            } else {
              this.windows[windowID].addMenuBarItem(stringList[0], stringList[1]);
            }
            break;
          case 'addPopupMenuItem':
            if (stringList.length === 4) {
              this.windows[windowID].addPopupMenuItem(stringList[0], stringList[1], intList[0], stringList[2], stringList[3]);
            } else {
              this.windows[windowID].addPopupMenuItem(stringList[0], stringList[1]);
            }
            break;
          case 'update':
            this.windows[windowID].update();
            break;
          case 'showInputDialog':
            this.windows[windowID].showInputDialog(stringList[0]);
            break;
          case 'showYesNoDialog':
            this.windows[windowID].showYesNoDialog(stringList[0]);
            break;
          case 'zoomRectangle':
            this.windows[windowID].zoomRectangle(intList[0], intList[1], intList[2], intList[3]);
            break;
          case 'readImage':
            this.imageWaiting = true;
            this.imageWindowID = windowID;
            this.imageXPos = intList[0];
            this.imageYPos = intList[1];
            break;
          case 'drawImage':
            this.windows[windowID].drawImage();
            // Assuming PImage is adapted to JavaScript
            // const image = new PImage(stringList[0]);
            // this.windows[windowID].drawImage(image, intList[0], intList[1]);
            break;
          case 'destroy':
            this.windows[windowID].destroy();
            break;
          default:
            // Handle unrecognized function call
            break;
        }
      } else if (idStrs[1].startsWith('= luajava.newInstance')) {
        // No colon. Check for create window.
        this.windows[windowID] = new SVWindow(stringList[1],
          intList[0], intList[1],
          intList[2], intList[3],
          intList[4], intList[5],
          intList[6], this.createCanvas, this.writeCanvas);
      }
    }
  }
}