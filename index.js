var canvas = document.getElementById('canvas');
var start = document.getElementById('start');
var reset = document.getElementById('reset');
var random = document.getElementById('random');
var ctx = canvas.getContext('2d');
const resolution = 25;
canvas.width = resolution*resolution;
canvas.height = resolution*resolution;
var grid, select = false, isRunning=false, randomRunning=false;
var generation = 0;
const COLS = resolution;
const ROWS = resolution;
var getRowVal,getColVal;
var values = [];

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
    getRowVal = Math.floor(e.offsetX/resolution);
    getColVal = Math.floor(e.offsetY/resolution);
    values.push([getRowVal,getColVal])
    render(grid);
}

function handleStart(e){
  isRunning = true;
  if(select){
    window.requestAnimationFrame(function(){
      update(grid)
    });
  }
}

function handleReset(){
    // isRunning = false;
    // cancelAnimationFrame(update(grid))
    // canvas.style.pointerEvents = "auto";
    window.location.reload().preventDefault();
}

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      if(randomRunning && generation==1){
        if(cell){
          getRowVal = row;
          getColVal = col;
          values.push([getRowVal,getColVal])
        }
      }
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
          if(row==rowNum && col==colNum){
              if(generation<3){
                console.log("only 2 generations of inital values are printed to avoid browser crash")
                values.map((val)=>{
                  console.log("Generation: "+generation+"; ("+val[0]+","+val[1]+") = Neighbours: "+neighbours)
                })
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


  var grid = buildGrid();
  render(grid);


// functions
  canvas.addEventListener('click', handleClick);
start.addEventListener('click', handleStart);
reset.addEventListener('click', handleReset);
random.addEventListener('click', function(){
  if(!(isRunning)){
    canvas.style.pointerEvents = "none";
    console.log('To know number of neighbours give row and col inputs as getRowVal and getColVal in console');
    var grid1 = handleRandom();
    randomRunning=true;
    render(grid1);
    window.requestAnimationFrame(function(){
      update(grid1)
    });
  }
  isRunning = true;
});


function update(grid){
    grid = nextGen(grid, getRowVal, getColVal);
    render(grid);
    window.requestAnimationFrame(function(){
      update(grid)
    });
}
