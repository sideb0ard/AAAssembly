let start_point = null;

function findStart(points) {
  let maxY = 0;
  let minX = width;
  let index = -1;
  for (let i = 0; i < points.length; ++i) {
    if (maxY < points[i].y) {
      maxY = points[i].y;
      index = i;
    } else if (maxY == points[i].y && minX > points[i].x) {
      minX = points[i].x;
      index = i;
    }
  }
  start_point = points[index];
}

function sortFunc(a, b) {
  if (a.equals(start_point)) return -1 * Infinity;
  if (b.equals(start_point)) return Infinity;

  let distA = a.dist(start_point);
  let distB = b.dist(start_point);
  let cosA = (a.x - start_point.x) / distA;
  let cosB = (b.x - start_point.x) / distB;

  return cosB - cosA;
}

function mask_line(vec, top_x, top_y, bottom_x, bottom_y) {
  let line_points = polyLine(vec, top_x, top_y, bottom_x, bottom_y);
  return line_points;
}

function getInterceptionPoints(p1, p2) {
  let points = [];

  let next = 0;
  for (let current = 0; current < p1.length; current++) {
    next = current + 1;
    if (next == p1.length) next = 0;

    let vc = p1[current]; // c for "current"
    let vn = p1[next]; // n for "next"

    let linePoints = polyLine(p2, vc.x, vc.y, vn.x, vn.y);
    if (linePoints) points.push(...linePoints);
  }
  findStart(points);
  points.sort(sortFunc);
  
  return points;
}

// POLYGON/LINE
function polyLine(vertices, x1, y1, x2, y2) {
  // console.log("pol", vertices, x1, y1, x2, y2);
  let points = [];
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next == vertices.length) next = 0;

    let x3 = vertices[current].x;
    let y3 = vertices[current].y;
    let x4 = vertices[next].x;
    let y4 = vertices[next].y;

    let v = lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (v) {
      points.push(v);
    }
  }

  return points;
}

function getInterceptPoint(x1, y1, x2, y2, x3, y3, x4, y4) {
  let slope1 = (y2 - y1 - 1) / (x2 - x1 - 1); // m

  let yintersect1 = y1 - slope1 * x1; // b

  let slope2 = (y4 - y3) / (x4 - x3); // m
  let yintersect2 = y3 - slope2 * x3; // b

  let x_intersect = (yintersect2 - yintersect1) / (slope1 - slope2);
  let y_intersect = slope1 * x_intersect + yintersect1;

  return createVector(x_intersect, y_intersect);
}

function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  // calculate the direction of the lines
  let uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines intercept
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return getInterceptPoint(x1, y1, x2, y2, x3, y3, x4, y4);
  }
}
