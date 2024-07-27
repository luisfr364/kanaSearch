import { createWorker, PSM } from "tesseract.js";

async function recognizeText(imageUrl, workerPath, langPath, corePath) {
  const worker = await createWorker(["jpn"], 1, {
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    workerPath,
    langPath,
    corePath,
  });

  const {
    data: { text, confidence },
  } = await worker.recognize(imageUrl);
  console.log(confidence);
  await worker.terminate();

  return text.trim();
}

export default recognizeText;
