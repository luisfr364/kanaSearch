import { createWorker } from "tesseract.js";

async function recognizeText(imageUrl) {
  const worker = await createWorker(["jpn"], 1, {
    workerPath:
      "https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js",
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
    corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.1.0",
  });

  const {
    data: { text },
  } = await worker.recognize(imageUrl);
  await worker.terminate();

  return `${text}`.trim();
}

export default recognizeText;
