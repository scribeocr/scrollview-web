import { ScrollViewBrowser } from "./src/ScrollViewBrowser.js";
import { colorsMapping } from "./src/constants.js";

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
    canvas.style.display = 'block';

    // Transfer the content from offscreenCanvas to canvas
    const context = canvas.getContext('2d');
    context.drawImage(offscreenCanvas, 0, 0);

    // Append the canvas to the document
    document.body.appendChild(canvas);

    const colorsStr = 'Colors Used: ' + Object.keys(this.penColors).sort().map(x => colorsMapping[x]).join(', ');

    const p = document.createElement('p');
    p.textContent = colorsStr;
    document.body.appendChild(p);

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
