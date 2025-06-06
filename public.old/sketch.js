let gridModules = 20;
const dotSize = 1;
const timer = 4; // time between each new shape change, in seconds
const easing = 0.09; // movement speed
let margin = 10; // margin size (distance from edge of canvas)

const background_color = "#1a1a1a"; 
const intersection_color = "#F9481D";
const dot_color = "#F8F2DB";
const line_color = "#F8F2DB";
const num_lines = 200;
const line_width = 0.5;


let polygon;
let polygon2;

function drawDotGrid() {
  push();
  noStroke();
  let spacing = windowWidth / gridModules;
  for (let y = 0; y < windowHeight; y += spacing) {
    for (let x = 0; x < windowWidth; x += spacing) {
      fill(dot_color);
      ellipse(x, y, dotSize, dotSize);
    }
  }
  pop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(background_color);

  gridModules = int((windowWidth / 7) / 5);
  margin = int(gridModules * 0.5);

  console.log(
    "grid = " + gridModules, 
    "margin = " + margin
  );

  polygon = new Polygon();
  polygon2 = new Polygon();

  cursor(CROSS);
  noStroke();
  strokeCap(SQUARE);
}

function drawIntersection(polygon1, polygon2) {
  let points = getInterceptionPoints(polygon1.cur_points, polygon2.cur_points);

  noStroke();
  fill(intersection_color);
  beginShape();
  points.forEach((p) => {
    vertex(p.x, p.y);
  });
  endShape(CLOSE);
}

function draw() {
  background(background_color);

  
  polygon.update();
  polygon.draw();

  polygon2.update();
  polygon2.draw();

  drawIntersection(polygon, polygon2);

  // drawDotGrid();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  polygon.regenerate();
}
