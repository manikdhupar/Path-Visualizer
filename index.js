let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let w = document.querySelector(".main-canvas").offsetWidth;
let h = 500;
let blockWidth, blockHeight;
let drawFlag = false;
let moveStartNode = false;
let moveEndNode = false;
let startNode = document.getElementById("start-node");
let endNode = document.getElementById("end-node");
let startNodeCordinates = { x: 150, y: 200 };
let endNodeCordinates = { x: 900, y: 200 };

let prevStartNodeFlag = false;
let prevEndNodeFlag = false;

canvas.width = w - (w % 25);
canvas.height = h - (h % 25);

let numberOfRows = canvas.width / 25;
let numberOfCol = canvas.height / 25;
let lastRow = { x: -1, y: -1 };

// initializing visited 2d array

let visited = [];
for (let i = 0; i < numberOfRows; i++) {
  let innerVisited = [];
  for (let j = 0; j < numberOfCol; j++) {
    innerVisited.push(false);
  }
  visited.push(innerVisited);
}

let si = 1;
let ei;
let pathArr;

document.querySelector(".main-cta").addEventListener("click", () => {
  let start = { x: startNodeCordinates.x / 25, y: startNodeCordinates.y / 25 };
  let end = { x: endNodeCordinates.x / 25, y: endNodeCordinates.y / 25 };
  pathArr = getPathDfs(start, end);
  ei = pathArr.length - 1;
  pathArr.reverse();
  update();
});

canvas.addEventListener("mousedown", (e) => {
  let { x, y } = getGridCordinates(e);
  x /= 25;
  y /= 25;
  if (startNodeCordinates.x === x * 25 && startNodeCordinates.y === y * 25) {
    moveStartNode = true;
  } else if (endNodeCordinates.x === x * 25 && endNodeCordinates.y === y * 25) {
    moveEndNode = true;
  } else {
    drawFlag = true;
    drawWall(e);
  }
});

canvas.addEventListener("mousemove", (e) => {
  let { x, y } = getGridCordinates(e);
  x /= 25;
  y /= 25;
  if (moveStartNode) {
    if (endNodeCordinates.x === x * 25 && endNodeCordinates.y === y * 25)
      return;
    if (startNodeCordinates.x === x * 25 && startNodeCordinates.y === y * 25)
      return;
    clearNode(startNodeCordinates);
    if (prevStartNodeFlag) {
      drawWall(e, startNodeCordinates);
      prevStartNodeFlag = false;
    }
    if (visited[x][y]) {
      //clear wall for current node
      drawWall(e, { x: x * 25, y: y * 25 });
      prevStartNodeCordinates = { x: x * 25, y: y * 25 };
      prevStartNodeFlag = true;
    }
    startNodeCordinates = { x: x * 25, y: y * 25 };
    drawStartNode();
  } else if (moveEndNode) {
    if (startNodeCordinates.x === x * 25 && startNodeCordinates.y === y * 25)
      return;
    if (endNodeCordinates.x === x * 25 && endNodeCordinates.y === y * 25)
      return;
    clearNode(endNodeCordinates);
    if (prevEndNodeFlag) {
      drawWall(e, endNodeCordinates);
      prevEndNodeFlag = false;
    }
    if (visited[x][y]) {
      //clear wall for current node
      drawWall(e, { x: x * 25, y: y * 25 });
      prevEndNodeCordinates = { x: x * 25, y: y * 25 };
      prevEndNodeFlag = true;
    }
    endNodeCordinates = { x: x * 25, y: y * 25 };
    drawEndNode();
  } else if (drawFlag) {
    if (endNodeCordinates.x === x * 25 && endNodeCordinates.y === y * 25)
      return;
    if (startNodeCordinates.x === x * 25 && startNodeCordinates.y === y * 25)
      return;
    drawWall(e);
  } else {
    return;
  }
});

canvas.addEventListener("mouseup", () => {
  (drawFlag = false), (moveStartNode = false), (moveEndNode = false);
  console.log("up");
});

canvas.addEventListener("mouseout", () => {
  (drawFlag = false), (moveStartNode = false), (moveEndNode = false);
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

function getGridCordinates(e) {
  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;
  x = x - (x % 25);
  y = y - (y % 25);
  return { x: x, y: y };
}

function drawWall(e, prevNodeCordinates) {
  if (prevNodeCordinates) {
    var { x, y } = prevNodeCordinates;
  } else {
    var { x, y } = getGridCordinates(e);
  }
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

function drawStartNode() {
  ctx.drawImage(
    startNode,
    startNodeCordinates.x,
    startNodeCordinates.y,
    25,
    25
  );
}

function drawEndNode() {
  ctx.drawImage(endNode, endNodeCordinates.x, endNodeCordinates.y - 1, 25, 25);
}

function clearNode(cordinates) {
  ctx.clearRect(cordinates.x + 1, cordinates.y + 1, 23, 23);
}

drawStartNode();
drawEndNode();

drawGrid(ctx, w, h);

function getPathDfs(start, end) {
  let grid = [];
  for (let i = 0; i < numberOfRows; i++) {
    let innerArr = [];
    for (let j = 0; j < numberOfCol; j++) {
      innerArr.push(false);
    }
    grid.push(innerArr);
  }

  let path = [];

  function dfs(start, end) {
    if (start.x == end.x && start.y == end.y) {
      path.push(start);
      return true;
    }
    if (grid[start.x][start.y] || visited[start.x][start.y]) {
      return false;
    }
    if (start.y > 0) {
      let newStart = { x: start.x, y: start.y - 1 };
      grid[start.x][start.y] = true;
      let ans = dfs(newStart, end);
      if (ans) {
        path.push(start);
        return true;
      }
    }

    if (start.x < numberOfRows - 1) {
      let newStart = { x: start.x + 1, y: start.y };
      grid[start.x][start.y] = true;
      let ans = dfs(newStart, end);
      if (ans) {
        path.push(start);
        return true;
      }
    }

    if (start.y < numberOfCol - 1) {
      let newStart = { x: start.x, y: start.y + 1 };
      grid[start.x][start.y] = true;
      let ans = dfs(newStart, end);
      if (ans) {
        path.push(start);
        return true;
      }
    }

    if (start.x > 0) {
      let newStart = { x: start.x - 1, y: start.y };
      grid[start.x][start.y] = true;
      let ans = dfs(newStart, end);
      if (ans) {
        path.push(start);
        return true;
      }
    }

    return false;
  }

  dfs(start, end);
  return path;
}

function drawPath(x, y) {
  ctx.fillStyle = "blue";
  console.log(x, y, 25, 25);
  ctx.fillRect(x, y, 25, 25);
  // calculate incremental points along the path
}

function update() {
  if (si > ei - 1) return;
  let dx = pathArr[si].x - pathArr[si - 1].x;
  let dy = pathArr[si].y - pathArr[si - 1].y;
  let newX, newY;
  if (dx == 0 && dy == -1) {
    newX = pathArr[si - 1].x;
    newY = pathArr[si - 1].y - 1;
  } else if (dx == 1 && dy == 0) {
    newX = pathArr[si - 1].x + 1;
    newY = pathArr[si - 1].y;
  } else if (dx == 0 && dy == 1) {
    newX = pathArr[si - 1].x;
    newY = pathArr[si - 1].y + 1;
  } else {
    newX = pathArr[si - 1].x - 1;
    newY = pathArr[si - 1].y;
  }
  console.log(dx, dy);
  drawPath(newX * 25, newY * 25);
  si++;
  requestAnimationFrame(update);
}
