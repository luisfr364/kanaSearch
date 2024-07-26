window.onload = function () {
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
};
