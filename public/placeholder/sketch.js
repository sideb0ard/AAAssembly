const resolution = 20;

class FlowField {
  constructor() {
    this.resize();
    this.r = 6;
  }

  display() {
    stroke(0, 125, 0);
    let midy = Math.floor(this.rows / 2);
    let midx = Math.floor(this.cols / 2);
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let angle = this.field[y][x].heading();
        noFill();
        push();
        translate(x * resolution, y * resolution);
        rotate(angle);
        beginShape();
        vertex(this.r * 2, 0);
        vertex(-this.r * 2, -this.r);
        vertex(-this.r * 2, this.r);
        endShape(CLOSE);
        pop();
        this.field[y][x].rotate(0.01);
      }
    }

  }

  resize() {

    this.cols = floor(width / resolution);
    this.rows = floor(height / resolution);
    this.field = new Array(this.cols);
    for (let i = 0; i < this.rows; i++) {
      this.field[i] = new Array(this.cols);
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let x = j * width / this.cols;
        let y = i * height / this.rows;
        this.field[i][j] = createVector(width / 2 - x, height / 2 - y);
        this.field[i][j].rotate(PI / 2);
      }
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
  flow_field.display();
  //noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  flow_field.resize();
}
