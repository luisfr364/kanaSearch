import Cropper from "./libs/cropperjs-1.6.2/dist/cropper.esm.js";
import "./libs/cropperjs-1.6.2/dist/cropper.css";
import {
  createImageWithContainer,
  createSidePanel,
} from "./utils/elementsUtils.js";
import recognizeText from "./utils/tesseractWorker.js";

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.type === "capture-screen") {
    await sendResponse(message.dataUrl);
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
      },
    });

    let recognizedText = "";

    img.addEventListener("cropend", async function () {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: cropper.getData().width,
        height: cropper.getData().height,
      });

      const ctx = croppedCanvas.getContext("2d");
      const imageData = ctx.getImageData(
        0,
        0,
        croppedCanvas.width,
        croppedCanvas.height
      );

      // Get the pixel data Array
      const data = imageData.data;

      // Convert the image to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const contrast = avg > 128 ? 255 : 0; // Simple thresholding
        data[i] = data[i + 1] = data[i + 2] = contrast; // Set R, G, B to the same value (grayscale)
      }

      ctx.putImageData(imageData, 0, 0);

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
        const newUrl = data.dictionaryUrl.replace(
          "%TEXT%",
          message.recognizedText
        );
        document.body.appendChild(createSidePanel(newUrl));
        console.log(dictionaryUrl);
      } else {
        document.body.appendChild(
          createSidePanel(`https://jisho.org/search/${message.recognizedText}`)
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

function removeSidePanel() {
  const sidePanel = document.getElementById("my-side-panel");
  if (sidePanel) {
    document.body.removeChild(sidePanel);
  }
}
