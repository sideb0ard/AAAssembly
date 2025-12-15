// Algorithmic Art Assembly 2026

p5.disableFriendlyErrors = true;

let images = []; // array of p5.Image objects (loaded in preload)
let filenames = [
  'img/wolff_parkinson.jpg',
  'img/charstyles.jpg',
  'img/gabor_lazar.jpg',
  'img/kara_lis_coverdale.jpg',
  'img/keith_fullerton.jpg',
  'img/luisa_mei.jpg',
  'img/mike_hodnick.jpg',
  'img/nathan_ho.jpg',
  'img/nnirror.jpg',
  'img/rtyler.jpg',
  'img/sebastian_camens.jpg',
  'img/tsrono.jpg',
  'img/william_fields.jpg'
];

let currentImageIndex = 0;
let imageCycleDuration = 5000; // ms each image stays before switching
let lastImageSwitch = 0;

// Transition control (randomized per-cell reveals)
let transitioning = false;
let transitionStart = 0;
let transitionDuration = 1000; // ms (max 1 second)
let revealTimes = []; // per-cell reveal times (2D array)
let nextBrightnessGrid = []; // target brightness grid for next image
let prevBrightnessGrid = []; // previous brightness snapshot

let cols = 50;
let rows = 50;
let margin;
let gridW, gridH, cellW, cellH;

const glyphSets = [
  ['.', ',', '`'],
  ['-', '_', '='],
  ['/', '\\', '|'],
  ['o', 'O', '0'],
  ['x', '+', '*'],
  ['~', '^', '¬'],
  ['#', 'H', 'M'],
  ['%', '8', 'B'],
  ['@', '&', 'Q']
];

// flatten glyphs for random flicker
const allGlyphs = glyphSets.flat();

// --- User-adjustable base color ---
let baseColor; // set in setup()

let brightnessGrid = [];
let switchIntervals = [];
let lastSwitchTimes = [];
let currentGlyphIndex = [];

const black = '#102628';
let adaptiveSpeed = 1.0;
let lastFrameTime = 0;

// Debounce variables for window resize
let resizeTimeout;
let isResizing = false;

function preload() {
  // Load all filenames into images[]
  for (let i = 0; i < filenames.length; i++) {
    images[i] = loadImage(filenames[i]);
  }
}

function setup() {
  // Get the container dimensions (using elt to access DOM element)
  let container = document.getElementById('p5-container');
  // Use clientWidth/clientHeight which gives us the inner size (excluding padding/borders)
  let containerWidth = container.clientWidth;
  let containerHeight = container.clientHeight;

  // Make it square based on the smaller dimension to fit in the container
  let canvasSize = min(containerWidth, containerHeight);
  // Use default renderer for performance, switch to SVG only for export
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('p5-container');
  noStroke();
  textFont('monospace');
  textAlign(CENTER, CENTER);
  frameRate(30);

  // --- Set base color here ---
  baseColor = color('#0ec646'); // terminal green

  margin = width * 0.02; // Reduced from 10% to 2% for more fill
  gridW = width - 2 * margin;
  gridH = height - 2 * margin;
  cellW = gridW / cols;
  cellH = gridH / rows;

  // initialize grids
  for (let y = 0; y < rows; y++) {
    brightnessGrid[y] = [];
    prevBrightnessGrid[y] = [];
    nextBrightnessGrid[y] = [];
    revealTimes[y] = [];
    switchIntervals[y] = [];
    lastSwitchTimes[y] = [];
    currentGlyphIndex[y] = [];
    for (let x = 0; x < cols; x++) {
      // placeholder values until first image processed
      brightnessGrid[y][x] = 0;
      prevBrightnessGrid[y][x] = 0;
      nextBrightnessGrid[y][x] = 0;
      revealTimes[y][x] = 0;
      switchIntervals[y][x] = random(500, 1200);
      lastSwitchTimes[y][x] = millis() + random(0, 1000);
      currentGlyphIndex[y][x] = floor(random(3));
    }
  }

  // Prepare first image (if any)
  if (images.length > 0 && images[0]) {
    brightnessGrid = makeBrightnessGridFromImage(images[0]);
  } else {
    // neutral fallback
    brightnessGrid = neutralGrid(50);
  }

  lastImageSwitch = millis();
}

function draw() {
  background(black);
  const now = millis();

  // If not currently transitioning and it's time, start a randomized transition to next image
  if (!transitioning && images.length > 1 && now - lastImageSwitch > imageCycleDuration) {
    const nextImageIndex = (currentImageIndex + 1) % images.length;

    // snapshot previous brightness
    prevBrightnessGrid = copyGrid(brightnessGrid);

    // prepare next brightness grid (target)
    if (images[nextImageIndex]) {
      nextBrightnessGrid = makeBrightnessGridFromImage(images[nextImageIndex]);
    } else {
      nextBrightnessGrid = neutralGrid(50);
    }

    // assign each cell a random reveal time within [now, now + transitionDuration]
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        revealTimes[y][x] = now + random(0, transitionDuration);
        // mark cell as unrevealed by setting a sentinel lastSwitchTimes value < transitionStart
        // (we'll use lastSwitchTimes to detect first reveal to initialize glyph index)
        lastSwitchTimes[y][x] = -Infinity;
      }
    }

    transitioning = true;
    transitionStart = now;
    // store which image we're transitioning to so we can commit at the end
    transitioningNextImageIndex = nextImageIndex;
  }

  // If transitioning, check whether all cells have revealed (i.e., current time > all revealTimes)
  if (transitioning) {
    // check if transition finished (all revealTimes <= now)
    let done = true;
    for (let y = 0; y < rows && done; y++) {
      for (let x = 0; x < cols; x++) {
        if (millis() < revealTimes[y][x]) {
          done = false;
          break;
        }
      }
    }

    if (done) {
      // commit next grid as active
      brightnessGrid = copyGrid(nextBrightnessGrid);

      // reinitialize per-cell glyph indices and timers so idle animation resumes smoothly
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const b = brightnessGrid[y][x];
          let level = floor(map(b, 0, 100, 0, glyphSets.length));
          level = constrain(level, 0, glyphSets.length - 1);
          const set = glyphSets[level];
          currentGlyphIndex[y][x] = floor(random(set.length));
          lastSwitchTimes[y][x] = millis() + random(0, 500);
          switchIntervals[y][x] = random(500, 1200);
        }
      }

      currentImageIndex = transitioningNextImageIndex;
      lastImageSwitch = millis();
      transitioning = false;
    }
  }

  // adaptive timing to prevent jitter
  if (lastFrameTime > 0) {
    const dt = now - lastFrameTime;
    const expected = 1000 / 30;
    adaptiveSpeed = lerp(adaptiveSpeed, expected / dt, 0.05);
  }
  lastFrameTime = now;

  // Extract RGB components of the base color
  const baseR = red(baseColor);
  const baseG = green(baseColor);
  const baseB = blue(baseColor);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let b; // brightness used for color mapping
      let glyphToDraw;

      if (transitioning) {
        const rt = revealTimes[y][x];
        if (millis() < rt) {
          // unrevealed yet: flicker with fast random glyphs
          // while flickering we can optionally show an interpolated brightness between prev and next
          const t = map(millis(), transitionStart, transitionStart + transitionDuration, 0, 1);
          b = lerp(prevBrightnessGrid[y][x], nextBrightnessGrid[y][x], constrain(t, 0, 1));
          glyphToDraw = allGlyphs[floor(random(allGlyphs.length))];
        } else {
          // just revealed (or past): commit this cell's brightness to the next grid
          b = nextBrightnessGrid[y][x];

          // initialize this cell's glyph index on first reveal
          if (lastSwitchTimes[y][x] === -Infinity) {
            // mark as initialized
            let level = floor(map(b, 0, 100, 0, glyphSets.length));
            level = constrain(level, 0, glyphSets.length - 1);
            const set = glyphSets[level];
            currentGlyphIndex[y][x] = floor(random(set.length));
            lastSwitchTimes[y][x] = millis();
            switchIntervals[y][x] = random(500, 1200);
          }

          // then use normal glyph selection/animation for revealed state
          maybeAdvanceGlyph(millis(), x, y, b);
          glyphToDraw = glyphForCurrentIndex(b, x, y);
        }
      } else {
        // normal (no transition)
        b = brightnessGrid[y][x];
        maybeAdvanceGlyph(millis(), x, y, b);
        glyphToDraw = glyphForCurrentIndex(b, x, y);
      }

      // --- Quantize brightness into 10 bands (for color mapping) ---
      const band = floor(b / 10) * 10;

      // --- Color mapping ---
      let glyphColor;
      if (band <= 50) {
        const t = map(band, 0, 50, 0, 1);
        const r = lerp(0.5 * baseR, baseR, t);
        const g = lerp(0.5 * baseG, baseG, t);
        const bl = lerp(0.5 * baseB, baseB, t);
        glyphColor = color(r, g, bl);
      } else {
        const t = map(band, 50, 100, 0, 1);
        const r = lerp(baseR, 255, t);
        const g = lerp(baseG, 255, t);
        const bl = lerp(baseB, 255, t);
        glyphColor = color(r, g, bl);
      }

      fill(glyphColor);
      textSize(cellW * 1.1); // Increased from 0.9 to 1.1 for better fill

      const gx = margin + x * cellW + cellW / 2;
      const gy = margin + y * cellH + cellH / 2;
      text(glyphToDraw, gx, gy);
    }
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveSVG('tidal_ascii_basecolor_bands.svg');
  } else if (key === 'n' || key === 'N') {
    // manual next (start transition immediately)
    lastImageSwitch = -Infinity;
  }
}

// ----- Helper: make brightness grid from an image (returns a rows×cols 2D array) -----
function makeBrightnessGridFromImage(img) {
  // Work on a copy to avoid mutating the original p5.Image unexpectedly
  let copy = img.get(); // get() clones the image
  copy.resize(cols, rows);
  copy.loadPixels();

  let grid = [];
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = brightness(copy.get(x, y));
    }
  }
  return grid;
}

// ----- Helper: copy a grid (2D array) -----
function copyGrid(g) {
  let out = [];
  for (let y = 0; y < rows; y++) {
    out[y] = [];
    for (let x = 0; x < cols; x++) {
      out[y][x] = (g[y] && typeof g[y][x] === 'number') ? g[y][x] : 50;
    }
  }
  return out;
}

// ----- Helper: neutral grid with constant brightness -----
function neutralGrid(val = 50) {
  let g = [];
  for (let y = 0; y < rows; y++) {
    g[y] = [];
    for (let x = 0; x < cols; x++) g[y][x] = val;
  }
  return g;
}

// ----- Helpers for glyph selection and per-cell animation -----
// Advance glyph index for cell (x,y) if enough time has passed
function maybeAdvanceGlyph(now, x, y, brightnessValue) {
  if ((now - lastSwitchTimes[y][x]) * adaptiveSpeed > switchIntervals[y][x]) {
    let level = floor(map(brightnessValue, 0, 100, 0, glyphSets.length));
    level = constrain(level, 0, glyphSets.length - 1);
    const set = glyphSets[level];
    currentGlyphIndex[y][x] = (currentGlyphIndex[y][x] + 1) % set.length;
    lastSwitchTimes[y][x] = now;
    switchIntervals[y][x] = random(500, 1200);
  }
}

// Return glyph for the current glyph index according to brightness
function glyphForCurrentIndex(brightnessValue, x, y) {
  let level = floor(map(brightnessValue, 0, 100, 0, glyphSets.length));
  level = constrain(level, 0, glyphSets.length - 1);
  const set = glyphSets[level];
  const idx = currentGlyphIndex[y][x] % set.length;
  return set[idx];
}

// Handle window resizing with debouncing
function windowResized() {
  isResizing = true;

  // Clear existing timeout
  clearTimeout(resizeTimeout);

  // Set new timeout - only resize after user stops resizing for 150ms
  resizeTimeout = setTimeout(() => {
    let container = document.getElementById('p5-container');
    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;
    let canvasSize = min(containerWidth, containerHeight);
    resizeCanvas(canvasSize, canvasSize);

    // Recalculate grid dimensions
    margin = width * 0.02; // Reduced from 10% to 2% for more fill
    gridW = width - 2 * margin;
    gridH = height - 2 * margin;
    cellW = gridW / cols;
    cellH = gridH / rows;

    isResizing = false;
  }, 150);
}
