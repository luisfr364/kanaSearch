// import Tesseract from "tesseract.js";

// self.onmessage = async function (event) {
//   const imageUrl = event.data;
//   const worker = await Tesseract.createWorker(["jpn_vert"], 1, {
//     langPath: chrome.runtime.getURL("jpn_vert.traineddata.gz"),
//     tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK_VERT_TEXT,
//     corePath: chrome.runtime.getURL("tesseract-core-simd.wasm.js"),
//     workerPath: chrome.runtime.getURL("worker.min.js"),
//   });

//   const {
//     data: { text, confidence },
//   } = await worker.recognize(imageUrl);
//   console.log(confidence);
//   await worker.terminate();

//   self.postMessage(text.trim());
// };
