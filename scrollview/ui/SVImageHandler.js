// Disabling eslint rules that would increase differences between Java/JavaScript versions.
/* eslint-disable no-param-reassign */
const browserMode = typeof process === 'undefined';

export class SVImageHandler {

  /**
   * @param {string} imgStr
   */
  static imageStrToBlob(imgStr) {
    const imgData = new Uint8Array(atob(imgStr)
      .split('')
      .map((c) => c.charCodeAt(0)));

    const imgBlob = new Blob([imgData], { type: 'application/octet-stream' });

    return imgBlob;
  }

  /**
  * @param {string} imgStr
  */
  static imageStrToBuffer(imgStr) {

    const imageBuffer = Buffer.from(imgStr, 'base64');

    return imageBuffer;
  }


  /**
   * Handles various image formats, always returns a ImageBitmap.
   *
   * @param {string} img
   */
  static async readImage(img) {
    if (img === undefined) throw new Error('Input is undefined');
    if (img === null) throw new Error('Input is null');

    if (browserMode) {
      const imgBlob = this.imageStrToBlob(img);
      const imgBit = await createImageBitmap(imgBlob);
      return imgBit;
    }

    const { loadImage } = await import('canvas');
    const imgBuffer = this.imageStrToBuffer(img);
    const imgBit = await loadImage(imgBuffer);
    return imgBit;

  }
}
