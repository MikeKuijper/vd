// sketch.js
//let count = 2000;
//let count = 10;
//let halfLife = 5; //in sec
//let fps = 30;
//let pauseOnHalfLife = false;
//let mayhem = false;
//let sound = true;
//let mayhemTime = 2.5;

let atoms = [];

let options = {
  "count": 2000,
  "halfLife": 5,
  "fps": 30,
  "pauseOnHalfLife": false,
  "sound": false,
  "mayhem": false,
  "mayhemTime": 2.5
};

let undecayedCount = 0;
let resetMillis = 0;

let k = options.fps * options.halfLife;

let hasStarted = false;
let hasRestarted = false;
let hasPaused = false;

let pop;

function preload() {
  pop = loadSound("assets/pop.mp3");
  //if (sound) pop = loadSound("Doh 4.mp3");
}

function start() {
  options.halfLife = parseFloat(document.getElementById('halfLife').value);
  options.sound = document.getElementById('soundfx').checked;
  options.count = parseFloat(document.getElementById('atomCount').value);
  options.pauseOnHalfLife = document.getElementById('pauseOnHalfLife').checked;

  print(options);

  generateAtoms(atoms);
  hasStarted = true;
  resetMillis = millis();
  //hasPaused = false;
  k = options.fps * options.halfLife;
  loop();
}

function reset() {
  noLoop();
  //resetMillis = millis();
}

let canvas;

function setup() {
  let parent = document.getElementById("sketch-holder");
  canvas = createCanvas(parent.offsetWidth, 500);
  canvas.parent('sketch-holder');

  document.getElementById('halfLife').value = options.halfLife;
  document.getElementById('soundfx').checked = options.sound;
  document.getElementById('atomCount').value = options.count;
  document.getElementById('pauseOnHalfLife').checked = options.pauseOnHalfLife;

  frameRate(options.fps);
  noLoop();
}

function draw() {
  if (hasStarted) {
    background(80);

    textSize(12);
    fill(255);
    noStroke();
    textAlign(LEFT);
    if (options.halfLife <= 1) text("Halfwaardetijd: " + options.halfLife + " seconde", 20, 20);
    else text("Halfwaardetijd: " + options.halfLife + " seconden", 20, 20);
    text(nfc((millis() - resetMillis) / 1000, 2) + "s", 20, height - 20);
    //text(nfc(frameRate(), 1), 100, height - 20);
    textAlign(RIGHT);
    text(nfc(100 - (undecayedCount / options.count) * 100, 1) + "%", width - 20, 20);
    text((options.count - undecayedCount) + "/" + options.count, width - 20, height - 20);
    textAlign(LEFT);

    stroke(255, 50, 24);
    point(150, height - 23);
    fill(255);
    noStroke();
    text("vervallen", 170, height - 20);

    stroke(255);
    point(250, height - 23);
    fill(255);
    noStroke();
    text("(nog) niet vervallen", 270, height - 20);

    if (nfc((millis() - resetMillis) / 1000, 2) >= options.halfLife && options.pauseOnHalfLife) {
      noLoop();

    }

    drawAtoms(atoms);
    if (frameCount % 1 == 0 && frameCount > 0) {
      decay(atoms);
    }
    if (undecayedCount == 0 && !hasRestarted) {
      if (!options.mayhem) hasRestarted = true;
      setTimeout(function() {
        generateAtoms(atoms);
        resetMillis = millis();
        hasRestarted = false;
      }, options.mayhemTime * 1000);
    }
  }
}

function generateAtoms(_atoms) {
  atoms = [];
  for (let i = 0; i < options.count; i++) {
    let x = random(20, width - 20);
    let y = random(40, height - 40);
    atoms.push({
      "x": x,
      "y": y,
      "hasDecayed": false
    });
  }
}

function drawAtoms(_atoms) {
  undecayedCount = 0;
  for (let i in _atoms) {
    let currentAtom = _atoms[i];


    strokeWeight(8);
    if (currentAtom.hasDecayed) {
      stroke(255, 50, 24);
    } else {
      stroke(255);
    }
    point(currentAtom.x, currentAtom.y);

    if (!currentAtom.hasDecayed) undecayedCount++;
  }
}

function decay(_atoms) {
  for (let i in _atoms) {
    let currentAtom = _atoms[i];
    if (!currentAtom.hasDecayed) {
      let condition = random(k * sqrt(2)) < 1;
      currentAtom.hasDecayed = condition;
      if (condition && options.sound) pop.play();
    }
  }
}
