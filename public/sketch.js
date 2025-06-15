const resolution = 20;

class FlowField {
  constructor() {
    this.resize();
    this.r = 6;
  }
  display() {
    stroke(0, 125, 0);
    //fill(100, 255, 0);
    noFill();
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let angle = this.field[y][x].heading();
        push();
        translate(x * resolution, y * resolution);
        rotate(angle);
        beginShape();
        vertex(this.r * 2, 0);
        vertex(-this.r * 2, -this.r);
        vertex(-this.r * 2, this.r);
        endShape(CLOSE);
        pop();
      }
    }
  }
  resize() {
    noiseSeed(random(1000));
    this.cols = floor(width / resolution);
    this.rows = floor(height / resolution);
    this.field = new Array(this.cols);
    for (let i = 0; i < this.rows; i++) {
      this.field[i] = new Array(this.cols);
    }
    let xoff = 0;
    for (let i = 0; i < this.rows; i++) {
      let yoff = 0;
      for (let j = 0; j < this.cols; j++) {
        let angle = map(noise(xoff, yoff), 0, 1, 0, TWO_PI);
        //this.field[i][j] = p5.Vector.random2D();
        //this.field[i][j] = createVector(1, 0);
        // this.field[i][j] = createVector(i * i, j);
        this.field[i][j] = p5.Vector.fromAngle(angle);
        yoff += 0.01;
      }
      xoff += 0.01;
    }
  }
}

let flow_field;

function setup() {
  let p5Canvas = createCanvas(windowWidth, windowHeight);
  p5Canvas.parent('p5-background');
  flow_field = new FlowField();
}

function draw() {
  background(0);
  if (frameCount % 10 == 0) {
    flow_field.resize();
  }
  flow_field.display();
  //noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  flow_field.resize();
}
