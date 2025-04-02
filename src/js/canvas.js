import utils, { randomColor, randomIntFromRange } from "./utils";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let objects = [];
const colors = ["#00bdff", "#4d39ce", "#088eff"];

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// Objects
class Particle {
  constructor(x, y, radius, radian, velocity, distanceFromCenter, color) {
    this.x = x;
    this.y = y;

    this.radius = radius;
    this.radian = radian;
    this.velocity = velocity;
    this.distanceFromCenter = distanceFromCenter; //generate a distance from the center once, not on every update (that would make it look weird)

    this.lastMousePos = { x: x, y: y }; // this is the last position of the mouse

    // try the distanceFromCenter = {x: random , y: random}

    this.color = color;
  }

  draw(lastPoint) {
    c.beginPath();
    c.strokeStyle = this.color;
    c.lineWidth = this.radius;
    c.moveTo(lastPoint.x, lastPoint.y);
    c.lineTo(this.x, this.y);
    c.stroke();
    c.closePath();
  }

  update() {
    const lastPoint = { x: this.x, y: this.y };

    //move points over time
    this.radian += this.velocity;

    //drag effect (before setting the X and Y on line 69-70)
    this.lastMousePos.x += (mouse.x - this.lastMousePos.x) * 0.05;
    this.lastMousePos.y += (mouse.y - this.lastMousePos.y) * 0.05;

    //pass the previous value of X instead of innerWidth / 2
    this.x = this.lastMousePos.x + Math.cos(this.radian) * this.distanceFromCenter;
    this.y = this.lastMousePos.y + Math.sin(this.radian) * this.distanceFromCenter;
    this.draw(lastPoint);
  }
}

function init() {
  for (let i = 0; i < 150; i++) {
    objects.push(
      new Particle(
        innerWidth / 2,
        innerHeight / 2,
        randomIntFromRange(2, 5),
        randomIntFromRange(Math.random(), Math.PI * 2), //get a number between random and 2pi radians for the radian property
        Math.random() * 0.07,
        randomIntFromRange(50, 320),
        randomColor(colors)
      )
    );
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  c.fillStyle = "rgba(255,255,255,0.075)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  objects.forEach((object) => {
    object.update();
  });
}

init();
animate();
