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

function experimentalImageWithContainer(dataUrl) {
  const script = document.createElement("script");

  script.innerHTML = `
  
  function draw() {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = "position: fixed; top: 0; left: 0; z-index: 1000;";
    console.log("canvas", canvas);
    document.body.appendChild(canvas);
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
      let isDragging = false;
      const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = "${dataUrl}";

        img.onload = function() {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
  
      let selectionRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
  
      canvas.addEventListener("mousedown", (e) => {
        console.log("mousedown");
        isDragging = true;
        selectionRect.x = e.x;
        selectionRect.y = e.y;
      });
  
      canvas.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        selectionRect.width = e.clientX - selectionRect.x;
        selectionRect.height = e.clientY - selectionRect.y;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSelectionBox();
      });
  
      canvas.addEventListener("mouseup", () => {
        // End dragging
        isDragging = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        chrome.runtime.sendMessage({
          type: "captured-screen",
          selectionRect,
      });
  
      // Function to draw the selection box
      function drawSelectionBox() {
        ctx.fillStyle = "rgba(85, 85, 85, 0.1)";
        ctx.fillRect(
          selectionRect.x,
          selectionRect.y,
          selectionRect.width,
          selectionRect.height
        );
  
      }
  
      // Update and redraw the canvas
      function updateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        drawSelectionBox();
      }
    }
  }
  
  draw();
  `;

  document.body.appendChild(script);
}

export {
  createImageWithContainer,
  createSidePanel,
  experimentalImageWithContainer,
};
