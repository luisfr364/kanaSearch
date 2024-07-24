function createImageWithContainr(dataUrl) {
  //Create a div containing the elements to display the image
  const div = document.createElement("div");
  div.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999;`;
  const img = new Image();
  img.src = dataUrl;
  img.style.cssText = "display: block; max-width: 100%;";
  div.appendChild(img);

  const elements = { img, div };

  return elements;
}

export default createImageWithContainr;
