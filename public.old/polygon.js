
class LinePoints {
    constructor(vec1, vec2) {
      this.top = vec1;
      this.bottom = vec2;
    }
  }
  
  function generatePoints() {
    let W = windowWidth - margin * 2;
    let H = windowHeight - margin * 2;
    let points = [];
    points.push(
      createVector(random(margin * 2, W / 2), margin * 2),
      createVector(random(W / 2, W), margin * 2),
      createVector(W, random(margin * 2, H / 2)),
      createVector(W - random(0, 100), random(H / 2, H)),
      createVector(random(W / 2, W), H),
      createVector(random(W / 2), H),
      createVector(margin, random(H / 2, H))
    );
    return points;
  }
  
  function compareVector(a, b) {
    if (a.x < b.x) {
      return -1;
    }
    if (a.x > b.x) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }
  
  class Polygon {
    constructor() {
      this.cur_points = generatePoints();
      this.target_points = generatePoints();
      this.next_shuffle_time_frame_no = 0;
    }
  
    regenerate() {
      this.cur_points = this.target_points;
      this.target_points = generatePoints();
      this.next_shuffle_time_frame_no = frameCount + timer * frameRate();
      this.line_points = this.generateLinePoints();
    }
  
    generateLinePoints() {
      let line_points = [];
  
      let min_x = width;
      let max_x = 0;
      for (let i = 0; i < this.cur_points.length; ++i) { 
        if (min_x > this.cur_points[i].x) {
          min_x = this.cur_points[i].x;
        }
        if (max_x < this.cur_points[i].x) {
          max_x = this.cur_points[i].x;
        }
      }
  
      let offset = (max_x - min_x) / num_lines;
      for (let i = 0; i < num_lines; i++) {
        let ofs = min_x + i * offset;
        let top = new createVector(ofs, 0);
        let bottom = new createVector(ofs, height);
        line_points.push(new LinePoints(top, bottom));
      }
      let ofs = min_x + num_lines * offset;
      let last_top = new createVector(ofs, 0);
      let last_bottom = new createVector(ofs, height);
      line_points.push(new LinePoints(last_top, last_bottom));
      return line_points;
    }
  
    update() {
      if (frameCount > this.next_shuffle_time_frame_no) {
        this.regenerate();
      }
  
      this.cur_points.forEach((p, index) => {
        let dx = this.target_points[index].x - p.x;
        let dy = this.target_points[index].y - p.y;
        p.x += dx * easing;
        p.y += dy * easing;
      });
      
      this.masked_line_points = [];
      this.line_points.forEach((p) => {
        this.masked_line_points.push(
          mask_line(this.cur_points, p.top.x, p.top.y, p.bottom.x, p.bottom.y)
        );
      });
  
    }
  
    draw() {
      strokeWeight(line_width);
      stroke(line_color);   
      
      for (let i = 0; i < this.masked_line_points.length; i += 2) {
        if (this.masked_line_points[i][0] && this.masked_line_points[i][1]) {
          line(
            this.masked_line_points[i][0].x,
            this.masked_line_points[i][0].y,
            this.masked_line_points[i][1].x,
            this.masked_line_points[i][1].y
          );
        }
      }
    }
  }
  