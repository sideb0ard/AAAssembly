

const gridModules = 20;
const dotSize = 2;
const timer = 6; // time between each new shape change, in seconds
const easing = 0.09; // movement speed
let margin = 50; // margin size (distance from edge of canvas)
const backgrounds = ['#F9481D','#5BDA00']; // background colours
const fills = ['#F8F2DB','#1A1A1A']; // foreground colours

let polygon;
let point;
let W,H;

function setup() {
  W = windowWidth - (margin*2);
  H = windowHeight - (margin*2);  
  createCanvas(windowWidth,windowHeight);
  background(backgrounds[0]);
  
  polygon = new Polygon(random(fills),W,H,margin,easing,timer,dotSize);

  let pos = createVector(width/2,height/2);
  let target = createVector(width/2,height/2);
  cursor(CROSS);
  noStroke();
}



function draw() {
  background(hexToRgb(backgrounds[0]),1);
  
  polygon.draw();
  polygon.points.forEach(p => {
    p.draw();
    p.shuffle();
  })

  drawDotGrid();
}



// Draw the grid of white dots
// refer to spacing and gridModules in sketch setup
function drawDotGrid() {
  push();
  noStroke();
  let spacing = windowWidth / gridModules;
  for(let y = 0; y < windowHeight; y += spacing) {
    for(let x = 0; x < windowWidth; x += spacing) {    
      fill(fills[0]);
      ellipse(x,y,dotSize,dotSize);
    }
  }
  pop();
}




// convert hex value to rgb values
function hexToRgb(hex) {
    hex = hex.replace('#', '');

    var bigint = parseInt(hex, 16);

    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return color(r, g, b);
}
