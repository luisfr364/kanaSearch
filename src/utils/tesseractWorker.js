import { createWorker, PSM } from "tesseract.js";

async function recognizeText(imageUrl, corePath, workerPath) {
  const worker = await createWorker(["jpn_vert"], 1, {
    langPath: chrome.runtime.getURL(""),
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK_VERT_TEXT,
    corePath: corePath,
    workerPath: workerPath,
  });

  const {
    data: { text, confidence },
  } = await worker.recognize(imageUrl);
  console.log(confidence);
  await worker.terminate();

  return text.trim();
}

export default recognizeText;
