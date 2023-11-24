const FPS = 20;
let simulation = 0;
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.visited = false;
    this.div = document.createElement("div");
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
    this.renderVisited = false;
    this.renderWalls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
  }
}

class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.generateGrid();
    this.head = this.grid[0][0];
  }
  generateGrid() {
    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      grid.push([]);
      for (let j = 0; j < this.cols; j++) {
        grid[i].push(new Cell(i, j));
      }
    }
    return grid;
  }
  renderGrid() {
    const gridContainer = document.querySelector("#root");
    gridContainer.style.gridTemplateColumns = `repeat(${this.rows}, 1fr)`;
    //   gridContainer.innerHTML = "";
    grid.grid.forEach((row) => {
      row.forEach((cell) => {
        const cellDiv = cell.div;
        cellDiv.className = "";
        cellDiv.classList.add("cell");
        if (cell.renderWalls.top) cellDiv.classList.add("top");
        if (cell.renderWalls.right) cellDiv.classList.add("right");
        if (cell.renderWalls.bottom) cellDiv.classList.add("bottom");
        if (cell.renderWalls.left) cellDiv.classList.add("left");
        if (cell.renderVisited) cellDiv.classList.add("visited");
        if (cell === this.head) cellDiv.classList.add("head");
        gridContainer.appendChild(cellDiv);
      });
    });
  }
}

const generateMaze = (grid, currentCell) => {
  currentCell.visited = true;
  let nextCell = getUnvisitedNeighbor(grid.grid, currentCell);
  //   if (nextCell) {
  while (nextCell) {
    removeWalls(currentCell, nextCell);
    const currentCellWalls = { ...currentCell.walls };
    const nextCellWalls = { ...nextCell.walls };

    simulation++;
    // renderGrid(grid);
    setTimeout(
      (currentCell, nextCell, currentCellWalls, nextCellWalls) => {
        grid.head = currentCell;
        currentCell.renderVisited = true;
        currentCell.renderWalls = currentCellWalls;
        nextCell.renderWalls = nextCellWalls;
        grid.renderGrid();
      },
      (simulation * 1000) / FPS,
      currentCell,
      nextCell,
      currentCellWalls,
      nextCellWalls
    );
    generateMaze(grid, nextCell);
    nextCell = getUnvisitedNeighbor(grid.grid, currentCell);
  }
  simulation++;
  const currentCellWalls = { ...currentCell.walls };
  setTimeout(
    (currentCell, currentCellWalls) => {
      grid.head = currentCell;
      currentCell.renderVisited = true;
      currentCell.renderWalls = currentCellWalls;
      grid.renderGrid();
    },
    (simulation * 1000) / FPS,
    currentCell,
    currentCellWalls
  );
  console.log(simulation);
};

const getUnvisitedNeighbor = (grid, currentCell) => {
  const neighbors = [];
  const { row, col } = currentCell;
  if (row > 0 && !grid[row - 1][col].visited)
    neighbors.push(grid[row - 1][col]);
  if (col < grid[0].length - 1 && !grid[row][col + 1].visited)
    neighbors.push(grid[row][col + 1]);
  if (row < grid.length - 1 && !grid[row + 1][col].visited)
    neighbors.push(grid[row + 1][col]);
  if (col > 0 && !grid[row][col - 1].visited)
    neighbors.push(grid[row][col - 1]);
  if (neighbors.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * neighbors.length);
  return neighbors[randomIndex];
};

const removeWalls = (currentCell, nextCell) => {
  if (currentCell.row > nextCell.row) {
    currentCell.walls.top = false;
    nextCell.walls.bottom = false;
  } else if (currentCell.col < nextCell.col) {
    currentCell.walls.right = false;
    nextCell.walls.left = false;
  } else if (currentCell.row < nextCell.row) {
    currentCell.walls.bottom = false;
    nextCell.walls.top = false;
  } else if (currentCell.col > nextCell.col) {
    currentCell.walls.left = false;
    nextCell.walls.right = false;
  }
};

const grid = new Grid(40, 40);
grid.renderGrid(grid);
generateMaze(grid, grid.grid[0][0]);
