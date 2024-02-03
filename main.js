import { ScrollViewBrowser } from "./src/ScrollViewBrowser.js";
import { colorsMapping, getBoxColorFunc } from "./src/constants.js";

const sv = new ScrollViewBrowser(addCanvasesToDocument);

const readFromBlobOrFile = (blob) => (
    new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = ({ target: { error: { code } } }) => {
            reject(Error(`File could not be read! Code=${code}`));
        };
        fileReader.readAsArrayBuffer(blob);
    })
);

function createUnorderedListFromObject(obj) {
    // Create an unordered list element
    const ul = document.createElement('ul');

    // Iterate over each property in the object
    for (const [key, value] of Object.entries(obj)) {
        // Create a list item for each key-value pair
        const li = document.createElement('li');
        li.textContent = `${key}: ${value}`;

        // Append the list item to the unordered list
        ul.appendChild(li);
    }

    return ul;

}
const brtDesc = {
    "BRT_NOISE": "Neither text nor image.",
    "BRT_HLINE": "Horizontal separator line.",
    "BRT_VLINE": "Vertical separator line.",
    "BRT_RECTIMAGE": "Rectangular image.",
    "BRT_POLYIMAGE": "Non-rectangular image.",
    "BRT_UNKNOWN": "Not determined yet.",
    "BRT_VERT_TEXT": "Vertical alignment, not necessarily vertically oriented.",
    "BRT_TEXT": "Convincing text.",
};

const bftDesc = {
    "BTFT_NONE": "No text flow set yet.",
    "BTFT_NONTEXT": "Flow too poor to be likely text.",
    "BTFT_NEIGHBOURS": "Neighbours support flow in this direction.",
    "BTFT_CHAIN": "Weak chain of text in this direction.",
    "BTFT_STRONG_CHAIN": "Strong chain of text in this direction.",
    "BTFT_TEXT_ON_IMAGE": "Strong chain of text on an image.",
    "BTFT_LEADER": "Leader dots/dashes etc.",
};


const brtUl = createUnorderedListFromObject(brtDesc);

const bftUl = createUnorderedListFromObject(bftDesc);

document.body.appendChild(brtUl);

document.body.appendChild(bftUl);

function drawColorSamplesWithLabels(colorMap) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 500;

    const rectHeight = 20; // Height of the color sample rectangle
    const rectWidth = 50; // Width of the color sample rectangle
    const padding = 10; // Padding between color samples
    const textPadding = 130; // Space for the text to the right of the rectangle
    const columnWidth = rectWidth + textPadding;
    const canvasPadding = 10; // Padding on the canvas edges
    const maxColumns = Math.floor((canvas.width - canvasPadding * 2) / columnWidth); // Calculate max columns per row

    let startX = canvasPadding;
    let startY = canvasPadding;
    let rowHeight = rectHeight + padding; // Calculate row height

    // Calculate required canvas height
    const totalColors = Object.keys(colorMap).length;
    const rowsNeeded = Math.ceil(totalColors / maxColumns);
    const requiredCanvasHeight = rowsNeeded * rowHeight + canvasPadding;

    // Adjust canvas height to fit all colors
    canvas.height = requiredCanvasHeight;

    Object.entries(colorMap).forEach(([rgba, name], index) => {
        // Draw color rectangle
        ctx.fillStyle = rgba;
        ctx.fillRect(startX, startY, rectWidth, rectHeight);

        // Draw label
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(name, startX + rectWidth + 10, startY + rectHeight / 2 + 5);

        // Update positions for next color
        if ((index + 1) % maxColumns === 0) { // Move to next row after maxColumns
            startX = canvasPadding;
            startY += rowHeight;
        } else { // Move to next column
            startX += columnWidth;
        }
    });

    document.body.appendChild(canvas);
}


drawColorSamplesWithLabels(colorsMapping);


function addCanvasesToDocument(args) {

    const key = args.name;
    const offscreenCanvas = args.canvas;

    // Create a label for the canvas
    const label = document.createElement('h4');
    label.textContent = key;
    document.body.appendChild(label);

    // Convert OffscreenCanvas to regular canvas and add it to the document
    const canvas = document.createElement('canvas');

    // Ensure the canvas has the same dimensions as the offscreenCanvas
    canvas.width = offscreenCanvas.width;
    canvas.height = offscreenCanvas.height;

    // Transfer the content from offscreenCanvas to canvas
    const context = canvas.getContext('2d');
    context.drawImage(offscreenCanvas, 0, 0);

    const legendCanvas = drawColorLegend(key, this.penColors);

    const div = document.createElement('div');
    div.appendChild(canvas);
    if (legendCanvas) div.appendChild(legendCanvas);

    // Append the canvas to the document
    document.body.appendChild(div);

}

function drawColorLegend(name, colors) {

    const boxColorFunc = getBoxColorFunc(name);

    if (!boxColorFunc) return;
    if (!colors) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let startY = 10; // Starting Y position for the first color
    const boxHeight = 20; // Height of the color box
    const boxWidth = 40; // Width of the color box
    const padding = 10; // Padding between boxes
    const textPadding = 10; // Padding between box and text
    const lineHeight = boxHeight + padding; // Calculate line height for each entry

    canvas.width = 500;
    canvas.height = lineHeight * Object.keys(colors).length + padding;

    // Set the background of the canvas to black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    Object.keys(colors).map((color) => {

        const colorObj = boxColorFunc(color);

        let colorLabelArr = [];
        for (const [key, value] of Object.entries(colorObj)) {
            colorLabelArr.push(`${key}: ${value}`);
        }

        // Add a stroke around the box
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(padding, startY, boxWidth, boxHeight);

        // Draw the text
        ctx.fillStyle = 'white'; // Text color
        ctx.textBaseline = 'middle'; // Align text vertically in the middle of the box
        let offsetX = 0;
        for (let i = 0; i < colorLabelArr.length; i++) {
            ctx.fillText(colorLabelArr[i], padding + boxWidth + textPadding + offsetX, startY + boxHeight / 2);
            offsetX += 200;
        }

        // Move startY for the next color box
        startY += lineHeight;
    });

    return canvas;

}



const recognize = (evt) => {
    TesseractCore().then((TessModule) => {
        let time1 = Date.now();
        const api = new TessModule.TessBaseAPI();
        const lang = 'eng';

        fetch(`./tess/${lang}.traineddata`)
            .then(resp => resp.arrayBuffer())
            .then(buf => {
                TessModule.FS.writeFile(`${lang}.traineddata`, new Uint8Array(buf));
            })
            .then(async () => {

                const messageDiv = document.getElementById('message');

                api.Init(null, lang);

                const file = evt.target.files[0];
                const fileBuf = new Uint8Array(await readFromBlobOrFile(file));
                TessModule.FS.writeFile("/input", fileBuf);
                api.SetImageFile();

                api.SetVariable('tessedit_pageseg_mode', '3');

                api.SetVariable('textord_tabfind_show_blocks', '1');
                api.SetVariable('textord_tabfind_show_strokewidths', '1');
                api.SetVariable('textord_tabfind_show_initialtabs', '1');
                api.SetVariable('textord_tabfind_show_images', '1');
                api.SetVariable('textord_tabfind_show_reject_blobs', '1');
                api.SetVariable('textord_tabfind_show_finaltabs', '1');
                api.SetVariable('textord_tabfind_show_columns', '1');
                api.SetVariable('textord_tabfind_show_initial_partitions', '1');
                api.SetVariable('textord_show_tables', '1');
                api.SetVariable('textord_tabfind_show_partitions', '1');


                api.SetVariable('textord_debug_tabfind', '1');


                api.SetVariable('vis_file', '/visInstructions.txt');

                messageDiv.innerHTML = api.GetUTF8Text();

                let time2 = Date.now();

                console.log("Used heap size: " + Math.round((performance.memory.usedJSHeapSize) / 1e6) + "MB");
                console.log("Total heap size: " + Math.round((performance.memory.totalJSHeapSize) / 1e6) + "MB");
                console.log("Total runtime: " + (time2 - time1) / 1e3 + "s");

                const visStr = TessModule.FS.readFile('/visInstructions.txt', { encoding: 'utf8', flags: 'a+' });

                await sv.processVisStr(visStr);

                await sv.writeAll();

                api.End();
                TessModule.destroy(api);

            })
    });
}

const elm = document.getElementById('uploader');
elm.addEventListener('change', recognize);
