// Global variables to store circle patterns, circle diameter, and spacing between circles
let song;
let fft;
let patterns = [];
let circleDiameter;
let spacing = 30; // Define space between circles
let angle = 0; // Global variable to control the rotation angle

function preload() {
  song = loadSound('audio/Bless_This_Space.mp3', soundLoaded, loadError);
}

function soundLoaded() {
  console.log('Sound loaded successfully');
}

function loadError(err) {
  console.log('Error loading sound: ' + err);
}

function setup() {
  // Create a canvas to fit the full window size and set the background color
  createCanvas(windowWidth, windowHeight);
  background('#194973');

  circleDiameter = 200; // Define a fixed diameter for the circles

  // Calculate the number of circles that can fit in the canvas width (columns) and height (rows)
  let cols = ceil(width / (circleDiameter + spacing));
  let rows = ceil(height / (circleDiameter + spacing));

  // Loop through the columns and rows to position each circle pattern
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      // Calculate staggered offset for both x and y positions
      let offsetX = (j % 2) * spacing * 2; // Horizontal staggering
      let offsetY = (i % 2) * spacing * 2; // Vertical staggering

      // Calculate the x and y positions for each circle
      let x = i * (circleDiameter + spacing) + offsetX + circleDiameter / 2;
      let y = j * (circleDiameter + spacing) + offsetY + circleDiameter / 2;
      

      // Generate random colors for the circle and inner shapes
      let color = [random(255), random(255), random(255)];
      let dotColor = [random(255), random(255), random(255)];

      // Store the circle pattern attributes in the patterns array
      patterns.push({
        x: x,
        y: y,
        size: circleDiameter,
        color: color,
        dotColor: dotColor,
        type: int(random(3)), // Randomly select one of three design types
      });
    }
  }
  

  // Draw each circle pattern on the canvas
  for(let pattern of patterns) {
    drawPattern(pattern);
  }
}

// Draw animation
function draw() {
  background('#194973'); // Clear the canvas

  // Check if the song is playing before updating the angle for rotation
  if (song.isPlaying()) {
    angle += 0.01; // Increase the angle for rotation only if the song is playing
  }

  // Draw each circle pattern with the current angle
  for (let pattern of patterns) {
    push(); // Save the current drawing state
    translate(pattern.x, pattern.y); // Move the origin to the circle's center
    if (song.isPlaying()) {
      rotate(angle); // Rotate the grid only if the song is playing
    }
    drawPattern(pattern); // Draw the pattern
    pop(); // Restore the original drawing state
  }
}



function drawPattern(pattern) {
  // Draw the outer "pearl necklace" chain around each circle with the new pattern
  let outerRadius = pattern.size / 2 + 10; // Define the radius for the pearl chain
  let pearls = [1, 1, 1, 0]; // Define the pattern of pearls (1 small, 1 small, 1 small, 0 large, and so on)
  let pearlIndex = 0;

  let numPearls = TWO_PI * outerRadius / 20;
  for (let i = 0; i < numPearls; i++) {
    let angle = i * TWO_PI / numPearls;
    let pearlX = outerRadius * cos(angle);
    let pearlY = outerRadius * sin(angle);

    if (pearls[pearlIndex] === 1) {
      fill(pattern.dotColor); // Set the fill color for the small pearls
      ellipse(pearlX, pearlY, 10); // Draw a small pearl
    } else {
      fill(255); // Set the fill color for the large pearls
      ellipse(pearlX, pearlY, 20); // Draw a large pearl
    }

    pearlIndex = (pearlIndex + 1) % pearls.length; // Move to the next pattern element
  }

  let numCircle = 5; // Number of circles
  let startRadius = 100; // Initial radius
  let radiusStep = 20; // Decreasing radius
  for(let i = 0; i < numCircle; i++){
    let radius = startRadius - radiusStep * i;
    ellipse(0, 0, radius * 2);
    fill(pattern.color); // Set the fill color for the circle
  }

  let numShapes = 20;
  for(let i = 0; i < numShapes; i++) {
    for(let j = 0; j < 5; j++){
      let angle = TWO_PI / numShapes * i;
      let shapeX = (pattern.size / 2 - 10 * j) * cos(angle);
      let shapeY = (pattern.size / 2 - 10 * j) * sin(angle);
      fill(pattern.dotColor); // Set the fill color for the inner shapes

      // Depending on the design type, draw either dots, lines, or rings
      if (pattern.type === 0) {
        ellipse(shapeX, shapeY, 5);

      } else if(pattern.type === 1) {
        for(let i = 0; i < numShapes; i++) {
          let angle = TWO_PI / numShapes * i;
          let innerRadius = pattern.size / 2 * 0.6;
          for(let j = 0; j < 5; j++){
            let shapeX = innerRadius * cos(angle) - 10 * j * cos(angle);
            let shapeY = innerRadius * sin(angle) - 10 * j * sin(angle);
            fill(pattern.dotColor);
            ellipse(shapeX, shapeY, 5);
          }
        }

      } else if(pattern.type === 2) {
        for(let j = 0; j < 8; j++){
          let radius = 6 * j;
          noFill();
          stroke(pattern.dotColor); // Set the stroke color for the rings
          ellipse(0, 0, radius); // Draw the rings centered around the new origin (0,0)
        }
        stroke(0); // Reset the stroke color for other shapes
      
        // Now draw the sawtooth ring, still around (0,0)
        drawSawtoothRing(0, 0, pattern.size / 3, 20, pattern.size / 2 * 0.35);
      }
    }
  }

  if (pattern.type === 2) {
    drawSawtoothRing(0, 0, pattern.size / 3, 20, pattern.size / 2 * 0.35);
  }
}

// The drawSawtoothRing function should also be updated to draw around the origin
function drawSawtoothRing(cx, cy, radius, teeth, toothHeight){
  let angleIncrement = TWO_PI / teeth;
  beginShape();
  for (let i = 0; i < teeth; i++) {
    let angle = i * angleIncrement;
    
    // Inner vertex
    let innerX = (radius - toothHeight) * cos(angle);
    let innerY = (radius - toothHeight) * sin(angle);
    vertex(innerX, innerY);
    
    // Outer vertex
    let outerX = (radius + toothHeight) * cos(angle + angleIncrement / 2);
    let outerY = (radius + toothHeight) * sin(angle + angleIncrement / 2);
    vertex(outerX, outerY);
  }
  endShape(CLOSE);
}



// Function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas to fit the new window size
  background('#194973'); // Clear the canvas with the same background
  setup(); // Recalculate columns and rows
  patterns = []; // Reset Pattern Array
  loop();
}


function drawSawtoothRing(cx, cy, radius, teeth, toothHeight){
  let angleIncrement = TWO_PI/teeth;

  beginShape();
  for (let i = 0; i < teeth; i++) {
    let angle = i * angleIncrement;
    
    // Inner vertex
    let innerX = cx + (radius - toothHeight) * cos(angle);
    let innerY = cy + (radius - toothHeight) * sin(angle);
    vertex(innerX, innerY);
    
    // Outer vertex
    let outerX = cx + (radius + toothHeight) * cos(angle + angleIncrement / 2);
    let outerY = cy + (radius + toothHeight) * sin(angle + angleIncrement / 2);
    vertex(outerX, outerY);

    noFill(); // Set SawtoothRing to no fill
  }

  endShape(CLOSE);
  fill(random(255), random(255), random(255)); // Restore fill properties of other shapes
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause(); // Pause the song if it is playing
  } else {
    song.loop(); // Play the song if it is not playing
  }
}
