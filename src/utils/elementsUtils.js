function createImageWithContainer(dataUrl) {
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

function createSidePanel(url) {
  const div = document.createElement("div");
  div.id = "my-side-panel";
  div.style.cssText = `width: 25%; position: fixed; height: 100%; 
  right: 0; top: 0; z-index: 100; overflow: hidden; border-bottom-left-radius: 12px; border-top-left-radius: 12px; 
  margin: 0; padding: 0; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3); border: 2px solid #ccc;`;
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.cssText = "height: 100%; width: 100%; border: none;";

  div.appendChild(iframe);

  return div;
}

export { createImageWithContainer, createSidePanel };
