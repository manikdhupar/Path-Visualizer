let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let w = document.querySelector(".main-canvas").offsetWidth;
let h = 500;
let blockWidth, blockHeight;
let drawFlag = false;

canvas.width = w - (w % 25);
canvas.height = h - (h % 25);

let numberOfRows = canvas.width / 25;
let lastRow = { x: -1, y: -1 };

// initializing visited 2d array

let visited = [];
for (let i = 0; i < numberOfRows; i++) {
  let innerVisited = [];
  for (let j = 0; j < numberOfRows; j++) {
    innerVisited.push(false);
  }
  visited.push(innerVisited);
}

canvas.addEventListener("mousedown", e => {
  drawFlag = true;
  // let x = e.clientX - canvas.offsetLeft;
  // let y = e.clientY - canvas.offsetTop;
  // x = x - (x % 25);
  // y = y - (y % 25);
  // x /= 25;
  // y /= 25;
  // lastRow.x = x;
  // lastRow.y = y;
  drawWall(e);
  console.log("down");
});

canvas.addEventListener("mouseup", () => {
  drawFlag = false;
  console.log("up");
});

canvas.addEventListener("mousemove", e => {
  if (drawFlag) drawWall(e);
  console.log("move");
});

canvas.addEventListener("mouseout", () => {
  drawFlag = false;
  console.log("out");
});

function drawGrid(ctx, w, h) {
  for (x = 0; x <= w; x += 25) {
    ctx.strokeStyle = "rgb(175, 216, 248)";
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (y = 0; y <= h; y += 25) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();
}

function drawWall(e) {
  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;
  x = x - (x % 25);
  y = y - (y % 25);
  if (visited[x / 25][y / 25]) {
    ctx.clearRect(x + 1, y + 1, 23, 23);
    visited[x / 25][y / 25] = false;
    return;
  }
  visited[x / 25][y / 25] = true;
  ctx.beginPath();
  ctx.rect(x + 1, y + 1, 23, 23);
  ctx.fillStyle = "red";
  ctx.fill();
}

drawGrid(ctx, w, h);
