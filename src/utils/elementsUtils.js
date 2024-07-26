function createImageWithContainer(dataUrl) {
  const container = document.createElement("div");
  container.style.cssText = `position: fixed; top: 0; left: 0; z-index: 100; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);`;
  const img = document.createElement("img");
  img.style.cssText = `position: block`;
  img.src = dataUrl;
  container.appendChild(img);
  document.body.appendChild(container);

  return { img, container };
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
