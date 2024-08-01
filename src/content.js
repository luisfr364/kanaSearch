import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {
  createImageWithContainer,
  createSidePanel,
} from "./utils/elementsUtils.js";
import recognize from "./utils/tesseractWorker.js";

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.type === "captured-screen") {
    const { img, container } = createImageWithContainer(message.dataUrl);

    //Initiate the CropperJS
    const cropper = new Cropper(img, {
      autoCrop: false,
    });

    img.addEventListener("cropend", async function () {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: cropper.getData().width * 1.3,
        height: cropper.getData().height * 1.3,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      const imageUrl = croppedCanvas.toDataURL("image/png");

      container.remove();
      const recognizedText = await textRecognition(imageUrl);

      if (recognizedText) {
        chrome.runtime.sendMessage({
          type: "recognized-text",
          text: recognizedText,
        });
      }
    });
  }

  return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "side-panel-open") {
    //Get the user defined dictionary URL from chrome storage or use the default one
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

    if (document.getElementById("kanaSearch-side-panel")) {
      document.getElementById("kanaSearch-side-panel").remove();
    }

    document.body.addEventListener("click", function (e) {
      if (e.target !== document.getElementById("kanaSearch-side-panel")) {
        removeSidePanel();
        document.body.removeEventListener("click", removeSidePanel);
      }
    });
  }
});

//Wrapper function for text recognition with imports
//due to technical problem with the imports in the original wrapper function
async function textRecognition(canvasUrl) {
  const workerPath = chrome.runtime.getURL("/data/worker.min.js");
  const langPath = chrome.runtime.getURL("/data");
  const corePath = chrome.runtime.getURL(
    "/data/tesseract-core-simd-lstm.wasm.js"
  );

  const text = recognize(canvasUrl, workerPath, langPath, corePath);

  return text;
}

function removeSidePanel() {
  const sidePanel = document.getElementById("kanaSearch-side-panel");
  if (sidePanel) {
    document.body.removeChild(sidePanel);
  }
}
