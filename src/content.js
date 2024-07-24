import Cropper from "./libs/cropperjs-1.6.2/dist/cropper.esm.js";
import "./libs/cropperjs-1.6.2/dist/cropper.css";
import createImageWithContainr from "./utils/imageUtils.js";
import recognizeText from "./utils/tesseractWorker.js";
import createSidePanel from "./sidePanel.js";

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.type === "capture-screen") {
    await sendResponse(message.dataUrl);
    const { img, div } = createImageWithContainr(message.dataUrl);

    //Append them to the body
    document.body.appendChild(div);

    const cropBoxData = {
      width: 50,
      height: 50,
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
      const croppedImgUrl = cropper
        .getCroppedCanvas({
          width: cropper.getData.width,
          height: cropper.getData().height,
          imageSmoothingEnabled: true,
        })
        .toDataURL("image/png");
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
    document.body.innerHTML += createSidePanel(message.url);

    document.body.addEventListener("click", function (e) {
      if (e.target !== document.getElementById("my-side-panel")) {
        removeSidePanel();
        document.body.removeEventListener("click", removeSidePanel);
      }
    });

    sendResponse("Side panel opened");
    return true;
  }
});

function removeSidePanel() {
  const sidePanel = document.getElementById("my-side-panel");
  if (sidePanel) {
    document.body.removeChild(sidePanel);
  }
}
