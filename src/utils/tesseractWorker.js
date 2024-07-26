import { createWorker, PSM } from "tesseract.js";

async function recognizeText(imageUrl) {
  const worker = await createWorker(["jpn"], 1, {
    langPath: "https://tessdata.projectnaptha.com/4.0.0_best",
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK_VERT_TEXT,
  });

  const {
    data: { text, confidence },
  } = await worker.recognize(imageUrl);
  console.log(confidence);
  await worker.terminate();

  return text.trim();
}

export default recognizeText;
