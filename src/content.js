import Cropper from "./libs/cropperjs-1.6.2/dist/cropper.esm.js";
import "./libs/cropperjs-1.6.2/dist/cropper.css";
import {
  createImageWithContainer,
  createSidePanel,
} from "./utils/elementsUtils.js";

import { createWorker, PSM } from "tesseract.js";

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.type === "capture-screen") {
    const { img, div } = createImageWithContainer(message.dataUrl);

    //Append them to the body
    document.body.appendChild(div);

    const cropBoxData = {
      width: 100,
      height: 100,
    };

    //Initiate the CropperJS
    const cropper = new Cropper(img, {
      autoCrop: false,

      ready() {
        cropper.setCropBoxData(cropBoxData);
        cropper.scale(1.3, 1.3);
      },
    });

    let recognizedText = "";

    img.addEventListener("cropend", async function () {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: cropper.getData().width,
        height: cropper.getData().height,
        imageSmoothungEnabled: true,
      });

      const croppedImgUrl = croppedCanvas.toDataURL("image/png");
      document.body.removeChild(div);

      recognizedText = await recognizeText(croppedImgUrl);

      if (recognizedText) {
        chrome.runtime.sendMessage({
          type: "recognized-text",
          text: recognizedText,
        });
      }
    });
  }
  sendResponse("Screen captured");

  return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "side-panel-open") {
    //Get the dictionary URL from the local storage or use the default one
    chrome.storage.local.get("dictionaryUrl", function (data) {
      if (data.dictionaryUrl) {
        const newUrl = data.dictionaryUrl.replace("%TEXT%", message.text);
        document.body.appendChild(createSidePanel(newUrl));
      } else {
        document.body.appendChild(
          createSidePanel(`https://jisho.org/search/${message.text}`)
        );
      }
    });

    if (document.getElementById("my-side-panel")) {
      document.getElementById("my-side-panel").remove();
    }

    document.body.addEventListener("click", function (e) {
      if (e.target !== document.getElementById("my-side-panel")) {
        removeSidePanel();
        document.body.removeEventListener("click", removeSidePanel);
      }
    });
  }
});

async function recognizeText(imageUrl) {
  const worker = await createWorker(["jpn_vert"], 1, {
    langPath: chrome.runtime
      .getURL("jpn_vert.traineddata.gz")
      .replace("jpn_vert.traineddata.gz", ""),
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK_VERT_TEXT,
    corePath: chrome.runtime.getURL("tesseract-core-simd.wasm.js"),
    workerPath: chrome.runtime.getURL("worker.min.js"),
  });

  const {
    data: { text, confidence },
  } = await worker.recognize(imageUrl);
  console.log(confidence);
  await worker.terminate();

  return text.trim();
}

function removeSidePanel() {
  const sidePanel = document.getElementById("my-side-panel");
  if (sidePanel) {
    document.body.removeChild(sidePanel);
  }
}
