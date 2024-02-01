let queue = [];
let isProcessing = false;

export async function processQueue() {
    if (isProcessing) return;
    isProcessing = true;

    while (queue.length > 0) {
        const { args, resolve } = queue.shift();
        try {
            const result = await this.IOLoop(...args);
            resolve(result);
        } catch (error) {
            resolve(Promise.reject(error));
        }
    }

    isProcessing = false;
}

export async function IOLoopWrapper(...args) {
    return new Promise((resolve, reject) => {
        queue.push({ args, resolve, reject });
        this.processQueue();
    });
}

export async function processVisStr(inputStr) {
    const inputArr = inputStr.split(/\n/).filter((x) => x);
    for (let i = 0; i < inputArr.length; i++) {
        await this.IOLoopWrapper(inputArr[i]);
    }
};
