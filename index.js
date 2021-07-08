var canvas = document.getElementById('canvas');
var start = document.getElementById('start');
var reset = document.getElementById('reset');
var random = document.getElementById('random');
var ctx = canvas.getContext('2d');
const resolution = 25;
canvas.width = resolution*resolution;
canvas.height = resolution*resolution;
var grid, select = false, isRunning=false;
var generation = 0;
const COLS = resolution;
const ROWS = resolution;

function buildGrid() {
  return new Array(COLS).fill(0).map(() => new Array(ROWS).fill(0));
}

function handleRandom() {
  return new Array(COLS).fill(0).map(() => new Array(ROWS).fill(0).map(() => Math.floor(Math.random()*2)));
}


function handleClick(e){
    select = true;
    ctx.fillRect(Math.floor(e.offsetX / resolution) * resolution,
    Math.floor(e.offsetY / resolution) * resolution,
    resolution, resolution);
    grid[Math.floor(e.offsetX/resolution)][Math.floor(e.offsetY/resolution)] = 1;
    render(grid);
}

function handleStart(e){
  if(select){
    canvas.style.pointerEvents = "none";
    isRunning = true;
    window.requestAnimationFrame(function(){
      update(grid)
    });
  }
}

function handleReset(){
    // isRunning = false;
    // cancelAnimationFrame(update(grid))
    // canvas.style.pointerEvents = "auto";
    window.location.reload();
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

function nextGen(grid, rowNum, colNum){
  generation++;
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
          if(cell && generation<2){
            console.log("Click on reset to refresh")
            console.log("Generation: "+generation+"; ("+row+","+col+") = Neighbours: "+ neighbours)
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


  var grid = buildGrid();
  render(grid);


// functions
  canvas.addEventListener('click', handleClick);
  start.addEventListener('click', handleStart);
  reset.addEventListener('click', handleReset);
  random.addEventListener('click', function(){
  if(!(isRunning)){
    canvas.style.pointerEvents = "none";
    var grid1 = handleRandom();
    render(grid1);
    window.requestAnimationFrame(function(){
      update(grid1)
    });
  }
  isRunning = true;
});


function update(grid){
    grid = nextGen(grid);
    render(grid);
    window.requestAnimationFrame(function(){
      update(grid)
    });
}
