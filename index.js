var canvas = document.getElementById('canvas');
var start = document.getElementById('start');
var reset = document.getElementById('reset');
var ctx = canvas.getContext('2d');
const resolution = 25;
canvas.width = 500;
canvas.height = 500;
var count = 0;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

function buildGrid() {
  return new Array(COLS).fill(0).map(() => new Array(ROWS).fill(0));
}


function handleClick(e){
    ctx.fillStyle = "black";
    ctx.fillRect(Math.floor(e.offsetX / resolution) * resolution,
    Math.floor(e.offsetY / resolution) * resolution,
    resolution, resolution);
    console.log(Math.floor(e.offsetX/resolution),Math.floor(e.offsetY/resolution));
    // render(grid);
}

function handleStart(e){
    console.log(grid)
}

function handleReset(){
    grid = new Array(COLS).fill(0).map(() => new Array(ROWS).fill(0));
    render(grid);
}

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? 'black' : 'white';
      ctx.fill();
      ctx.stroke();
    }
  }
}

function nextGen(grid){
    count ++;
    const nextGen = grid.map(arr => [...arr]);
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
          const cell = grid[col][row];
          let neighbours = 0;
          for(let i=-1; i<2; i++){
              for(let j=-1; j<2; j++){
                  if(i===0 && j===0){
                      continue;
                  }
                  const x_cell = col + i;
                  const y_cell = row + j;
                  if (x_cell >=0 && y_cell>=0 && x_cell < COLS && y_cell < ROWS){
                    const currentNeighbour = grid[col+i][row+j];
                    neighbours += currentNeighbour;
                  }
              }
          }
          if(cell === 1 && neighbours < 2){
              nextGen[col][row] = 0;
          }
          else if(cell === 1 && neighbours > 3){
              nextGen[col][row] = 0;
          }
          else if(cell === 0 && neighbours === 3){
            nextGen[col][row] = 1;
          }
        }
    }
    return nextGen;
}

// functions
let grid = buildGrid();
canvas.addEventListener('click', handleClick);
start.addEventListener('click', handleStart);
reset.addEventListener('click', handleReset);
requestAnimationFrame(update);

function update(){
    // grid = nextGen(grid);
    render(grid);
    // requestAnimationFrame(update);
}
