// Global variables
let angle = 0;

function setup() {
  createCanvas(400, 400, WEBGL);
}

function draw() {
  background(200);
  
  // Basic rotation
  rotateX(angle);
  rotateY(angle * 0.4);
  rotateZ(angle * 0.1);
  
  // Draw a simple cube
  box(100);
  
  angle += 0.03;
}
