/*
FlyVibe - A polished endless flyer game

This game works with placeholder graphics by default, but can be enhanced with custom assets.
To use custom assets, create the following files in the assets folder:

- sprites.png: Main sprite sheet containing plane animations, pipes, and clouds
- flap.mp3: Sound when the plane flaps
- score.mp3: Sound when scoring a point
- hit.mp3: Sound when hitting an obstacle
- die.mp3: Sound when game over
- button.mp3: Sound when clicking buttons
- background.mp3: Background music
- font.ttf: Custom font for text
- medal_bronze.png, medal_silver.png, medal_gold.png, medal_platinum.png: Medal images

The game will automatically use placeholder graphics if these files are not found.
*/

// FlyVibe - A polished endless flyer game
let spriteSheet; // Main sprite sheet
let bgLayers = []; // Parallax background layers
let clouds = []; // Decorative clouds
let particles = []; // Particle effects
let sounds = {}; // Sound effects
let fonts = {}; // Custom fonts
let medals = {}; // Medal images

// Game variables
let vehicle;
let pipes = [];
let score = 0;
let highScore = 0;
let gameState = 'start';
let adTimer = 0;
let adDuration = 5000;
let framesSinceLastPipe = 0;
let pipeInterval = 100;
let difficultyLevel = 1;
let gameSpeed = 1;
let parallaxSpeed = 0.5;
let isNight = false;
let flashOpacity = 0;
let shakeAmount = 0;
let scoreAnimation = { value: 0, target: 0, speed: 0.1 };
let buttonHover = { restart: false, continue: false };
let runwayMode = true; // Flag for runway start sequence
let runwayX = 0; // Runway scroll position

// Viral features
let playerName = "Player";
let leaderboard = [
  {name: "Elon", score: 42},
  {name: "MrBeast", score: 37},
  {name: "Taylor", score: 31},
  {name: "Zuck", score: 26},
  {name: "Snoop", score: 21}
];
let shareButton;
let challengeButton;
let nameInputActive = false;
let nameInput = "";
let cursorBlink = 0;
let gameMode = "normal"; // normal, extreme, impossible
let gameModifiers = {
  normal: { speedMultiplier: 1, gravityMultiplier: 0.25, pointsMultiplier: 1 },
  extreme: { speedMultiplier: 1.5, gravityMultiplier: 1.2, pointsMultiplier: 2 },
  impossible: { speedMultiplier: 2, gravityMultiplier: 1.5, pointsMultiplier: 5 }
};
let streakCount = 0;
let perfectPass = false;
let comboMultiplier = 1;
let lastScoreTime = 0;
let scoreMessages = ["Nice!", "Great!", "Perfect!", "Amazing!", "Incredible!", "Unstoppable!", "GODLIKE!"];
let currentMessage = "";
let messageAlpha = 0;
let viralQuotes = [
  "I can't stop playing this game! #FlyVibe",
  "Just scored 42 in #FlyVibe! Can you beat that?",
  "This game is harder than my dating life! #FlyVibe",
  "My boss caught me playing #FlyVibe again...",
  "3am and still playing #FlyVibe. Send help!",
  "Relationship status: In love with #FlyVibe",
  "I'm not addicted to #FlyVibe, you are!",
  "Just one more try... #FlyVibe",
  "This game should come with a warning label! #FlyVibe"
];
let randomColorMode = false;
let colorTimer = 0;
let currentColor = 0;
let rainbowColors = [
  [255, 0, 0],    // Red
  [255, 165, 0],  // Orange
  [255, 255, 0],  // Yellow
  [0, 255, 0],    // Green
  [0, 0, 255],    // Blue
  [75, 0, 130],   // Indigo
  [238, 130, 238] // Violet
];

// Preload assets
function preload() {
  // Create placeholder graphics since we don't have real assets
  createPlaceholderAssets();

  // Use placeholder spritesheet directly
  spriteSheet = createPlaceholderSpritesheet();

  // Create empty sound objects
  sounds.flap = createEmptySound();
  sounds.score = createEmptySound();
  sounds.hit = createEmptySound();
  sounds.die = createEmptySound();
  sounds.button = createEmptySound();
  sounds.background = createEmptySound();

  // Use default font
  fonts.main = null;

  // Create placeholder medals
  medals.bronze = createMedalGraphic(color(205, 127, 50));
  medals.silver = createMedalGraphic(color(192, 192, 192));
  medals.gold = createMedalGraphic(color(255, 215, 0));
  medals.platinum = createMedalGraphic(color(229, 228, 226));
}

// Create an empty sound object with dummy methods
function createEmptySound() {
  return {
    play: () => {},
    setVolume: () => {},
    loop: () => {}
  };
}

// Create placeholder assets
function createPlaceholderAssets() {
  // This function will be called before any assets are loaded
  console.log('Creating placeholder assets');
}

// Create a placeholder spritesheet
function createPlaceholderSpritesheet() {
  let sheet = createGraphics(300, 150);
  sheet.background(0, 0);

  // Draw paper plane frames (3 frames with slight animation)
  for (let i = 0; i < 3; i++) {
    let x = i * 34 + 17;
    let y = 12;

    // Blue paper colors - different shades for 3D effect
    let mainBlue = color(65, 105, 225);      // Royal blue
    let darkBlue = color(30, 60, 180);       // Darker shade for shadows
    let lightBlue = color(100, 150, 255);    // Lighter shade for highlights

    // Draw the paper plane body - main triangle
    sheet.fill(mainBlue);
    sheet.noStroke();
    sheet.beginShape();
    sheet.vertex(x - 15, y);                 // Back point
    sheet.vertex(x + 10, y - 2 + (i * 0.5)); // Front point (slight animation)
    sheet.vertex(x - 15, y + 8);             // Bottom back point
    sheet.endShape(CLOSE);

    // Top fold - creates the 3D effect of folded paper
    sheet.fill(lightBlue);
    sheet.beginShape();
    sheet.vertex(x - 15, y);                 // Back point
    sheet.vertex(x + 10, y - 2 + (i * 0.5)); // Front point
    sheet.vertex(x - 3, y - 5 + (i * 0.2));  // Top fold point
    sheet.endShape(CLOSE);

    // Bottom fold - shadow side
    sheet.fill(darkBlue);
    sheet.beginShape();
    sheet.vertex(x - 15, y);                 // Back point
    sheet.vertex(x - 3, y + 4);              // Center fold point
    sheet.vertex(x - 15, y + 8);             // Bottom back point
    sheet.endShape(CLOSE);

    // Wing fold - right side
    sheet.fill(lightBlue);
    sheet.beginShape();
    sheet.vertex(x - 15, y);                 // Back point
    sheet.vertex(x - 3, y - 5 + (i * 0.2));  // Top fold point
    sheet.vertex(x - 3, y + 4);              // Center fold point
    sheet.endShape(CLOSE);

    // Wing fold - left side (shadow)
    sheet.fill(darkBlue);
    sheet.beginShape();
    sheet.vertex(x - 15, y + 8);             // Bottom back point
    sheet.vertex(x - 3, y + 4);              // Center fold point
    sheet.vertex(x + 10, y - 2 + (i * 0.5)); // Front point
    sheet.endShape(CLOSE);

    // Fold lines - more prominent
    sheet.stroke(30, 60, 180, 180);
    sheet.strokeWeight(0.8);
    // Center crease
    sheet.line(x - 15, y, x + 10, y - 2 + (i * 0.5));
    // Wing creases
    sheet.line(x - 15, y, x - 3, y - 5 + (i * 0.2));
    sheet.line(x - 15, y, x - 3, y + 4);
    sheet.line(x - 3, y - 5 + (i * 0.2), x + 10, y - 2 + (i * 0.5));
    sheet.line(x - 3, y + 4, x + 10, y - 2 + (i * 0.5));
    sheet.line(x - 15, y + 8, x - 3, y + 4);
  }

  // Draw dead paper plane frame (crumpled blue paper)
  let x = 17;
  let y = 36;

  // Crumpled paper base - blue
  sheet.fill(65, 105, 225);
  sheet.noStroke();
  sheet.beginShape();
  sheet.vertex(x - 12, y - 2);
  sheet.vertex(x - 5, y - 7);
  sheet.vertex(x + 3, y - 3);
  sheet.vertex(x + 8, y - 6);
  sheet.vertex(x + 10, y + 2);
  sheet.vertex(x + 5, y + 5);
  sheet.vertex(x - 2, y + 3);
  sheet.vertex(x - 8, y + 6);
  sheet.endShape(CLOSE);

  // Darker blue areas for crumpled effect
  sheet.fill(30, 60, 180);
  sheet.beginShape();
  sheet.vertex(x - 5, y - 7);
  sheet.vertex(x + 3, y - 3);
  sheet.vertex(x - 2, y + 3);
  sheet.vertex(x - 8, y + 6);
  sheet.endShape(CLOSE);

  // Lighter blue highlights
  sheet.fill(100, 150, 255);
  sheet.beginShape();
  sheet.vertex(x + 3, y - 3);
  sheet.vertex(x + 8, y - 6);
  sheet.vertex(x + 10, y + 2);
  sheet.vertex(x + 5, y + 5);
  sheet.endShape(CLOSE);

  // Crumple lines
  sheet.stroke(30, 60, 180);
  sheet.strokeWeight(0.7);
  sheet.line(x - 5, y - 7, x + 5, y + 5);
  sheet.line(x + 3, y - 3, x - 8, y + 6);
  sheet.line(x - 12, y - 2, x + 10, y + 2);
  sheet.line(x + 8, y - 6, x - 2, y + 3);

  // Draw pipe parts - SIMPLIFIED
  // Top obstacle (single color)
  sheet.fill(255, 0, 0); // Bright red for top obstacle
  sheet.rect(0, 60, 52, 26);

  // Bottom obstacle (single color)
  sheet.fill(0, 0, 255); // Bright blue for bottom obstacle
  sheet.rect(0, 86, 52, 26);

  // Draw cloud types - without outlines
  for (let i = 0; i < 3; i++) {
    let cloudX = 104 + (i * 60);

    // Create a soft, simple cloud
    sheet.noStroke();

    // Base cloud - very soft white with high transparency
    sheet.fill(255, 255, 255, 180);
    sheet.ellipse(cloudX + 20, 15, 45, 20);

    // Add a few simple overlapping circles for a fluffy but minimal look
    sheet.fill(255, 255, 255, 210);
    sheet.ellipse(cloudX + 15, 13, 25, 15);
    sheet.ellipse(cloudX + 28, 12, 20, 14);

    // Subtle highlight on top for dimension
    sheet.fill(255, 255, 255, 240);
    sheet.ellipse(cloudX + 20, 10, 30, 12);
  }

  return sheet;
}

// Create a medal graphic with the given color
function createMedalGraphic(medalColor) {
  let medal = createGraphics(50, 50);
  medal.background(0, 0);
  medal.fill(medalColor);
  medal.strokeWeight(3);
  medal.stroke(50);
  medal.ellipse(25, 25, 40, 40);
  medal.fill(50);
  medal.noStroke();
  medal.textSize(20);
  medal.textAlign(CENTER, CENTER);
  medal.text("★", 25, 25);
  return medal;
}

// Vehicle class representing the player-controlled plane
class Vehicle {
    constructor() {
    this.x = 80;
    this.y = height / 2;
    this.velocity = 0;
    this.gravity = 0.1;
    this.flapStrength = -3;
    this.width = 34;
    this.height = 24;
    this.rotation = 0;
    this.frameCount = 0;
    this.animationSpeed = 0.2;
    this.currentFrame = 0;
    this.frames = [0, 1, 2, 1]; // Animation sequence
    this.isDead = false;
    this.trail = [];

    // Blue paper colors for effects
    this.mainBlue = color(65, 105, 225);      // Royal blue
    this.darkBlue = color(30, 60, 180);       // Darker shade for shadows
    this.lightBlue = color(100, 150, 255);    // Lighter shade for highlights
  }

    update() {
    if (!this.isDead) {
      // Update velocity and position
      this.velocity += this.gravity;
      this.y += this.velocity;

      // Animate rotation based on velocity
      this.rotation = constrain(map(this.velocity, -10, 15, -PI/6, PI/2), -PI/6, PI/2);

      // Update animation frame
      this.frameCount += this.animationSpeed;
      this.currentFrame = this.frames[floor(this.frameCount) % this.frames.length];

      // Add white smoke trail effect
      if (frameCount % 2 === 0) {
        this.trail.push({
          x: this.x - 10,
          y: this.y,
          opacity: 180,
          size: random(3, 6),
          expandRate: random(0.01, 0.03)
        });
      }

      // Limit top of screen
      if (this.y < this.height/2) {
        this.y = this.height/2;
        this.velocity = 0;
      }
    }

    // Update trail
    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].x -= 2 * gameSpeed;
      this.trail[i].opacity -= 5;
      this.trail[i].size += this.trail[i].size * this.trail[i].expandRate; // Smoke expands as it dissipates
      if (this.trail[i].opacity <= 0) {
        this.trail.splice(i, 1);
      }
    }
  }

    flap() {
    if (!this.isDead) {
      this.velocity = this.flapStrength;
      sounds.flap.play();

      // Add white smoke particles
      for (let i = 0; i < 5; i++) {
        particles.push(new Particle(
          this.x - 5,
          this.y + random(-5, 5),
          random(-2, -1),
          random(-1, 1),
          random(4, 8),
          color(255, 255, 255, 150)
        ));
      }
    }
  }

  show() {
    push();
    translate(this.x, this.y);

    // Draw white smoke trail
    for (let t of this.trail) {
      noStroke();
      fill(255, 255, 255, t.opacity);
      ellipse(t.x - this.x, t.y - this.y, t.size);
    }

    // Draw vehicle with rotation
    rotate(this.rotation);

    // Draw sprite from spritesheet
    let spriteX = this.currentFrame * this.width;
    let spriteY = this.isDead ? this.height : 0; // Different sprite row when dead

    imageMode(CENTER);
    image(
      spriteSheet,
      0, 0,
      this.width, this.height,
      spriteX, spriteY,
      this.width, this.height
    );

    pop();
  }

  die() {
    if (!this.isDead) {
      this.isDead = true;
      sounds.hit.play();
      setTimeout(() => sounds.die.play(), 500);

      // Create white smoke explosion
      for (let i = 0; i < 20; i++) {
        particles.push(new Particle(
          this.x,
          this.y,
          random(-3, 3),
          random(-3, 3),
          random(5, 12),
          color(255, 255, 255, 200)
        ));
      }

      // Screen effects
      flashOpacity = 255;
      shakeAmount = 10;
    }
  }
}

// Pipe class representing obstacles
class Pipe {
  constructor() {
  // Increase base spacing from 150 to 200, and minimum from 100 to 180
  this.spacing = constrain(200 - (difficultyLevel * 5), 180, 200);
  this.top = random(height * 0.1, height * 0.6);
  this.bottom = height - (this.top + this.spacing);
  this.x = width;
  this.w = 52;
  this.speed = 2 * gameSpeed;
  this.passed = false;
  this.highlighted = false; // For visual effect when passing through
}

update() {
  this.x -= this.speed;

  // Highlight effect when passing through
  if (!this.passed && this.x < vehicle.x && this.x + this.w > vehicle.x - vehicle.width/2) {
    this.highlighted = true;
  } else {
    this.highlighted = false;
  }
}

show() {
  push();
  if (this.highlighted) {
    // Brighter highlight when passing through
    tint(255, 255, 200);
  }

  // 3D PIPE DRAWING WITH ENHANCED PERSPECTIVE

  // Draw top obstacle - RED with 3D effect
  noStroke();

  // Perspective effect - slightly narrower at the top
  let perspectiveNarrow = 5; // Pixels narrower at the far end

  // Main pipe body with subtle gradient
  for (let i = 0; i < this.top; i += 5) {
    // Create gradient from darker to brighter red (bottom to top)
    let gradientColor = map(i, 0, this.top, 220, 180);
    fill(gradientColor, 0, 0);

    // Calculate width based on perspective
    let perspectiveWidth = map(i, 0, this.top, this.w - perspectiveNarrow, this.w);
    let xOffset = (this.w - perspectiveWidth) / 2;

    rect(this.x + xOffset, i, perspectiveWidth, 5);
  }

  // Right edge highlight
  fill(255, 50, 50); // Lighter red for highlight
  rect(this.x + this.w - 8, 0, 8, this.top);

  // Bottom edge
  fill(180, 0, 0); // Darker red for shadow
  rect(this.x, this.top - 10, this.w, 10);

  // 3D pipe opening with depth
  // Outer rim with gradient
  for (let r = 0; r < 5; r++) {
    let rimColor = map(r, 0, 5, 200, 150);
    fill(rimColor, 0, 0);
    ellipse(this.x + this.w/2, this.top, this.w * map(r, 0, 5, 0.9, 0.8), 20 - r);
  }

  // Inner opening
  fill(100, 0, 0); // Dark red for pipe interior
  ellipse(this.x + this.w/2, this.top, this.w * 0.7, 15);

  // Deep interior with gradient
  for (let d = 0; d < 3; d++) {
    let depthColor = map(d, 0, 3, 80, 30);
    fill(depthColor, 0, 0);
    ellipse(this.x + this.w/2, this.top, this.w * map(d, 0, 3, 0.6, 0.4), 10 - d*2);
  }

  // Draw bottom obstacle - BLUE with 3D effect
  noStroke();

  // Main pipe body with subtle gradient
  for (let i = 0; i < this.bottom; i += 5) {
    // Create gradient from darker to brighter blue (top to bottom)
    let gradientColor = map(i, 0, this.bottom, 0, 50);
    fill(0, 0, 220 - gradientColor);

    // Calculate width based on perspective
    let perspectiveWidth = map(i, 0, this.bottom, this.w, this.w - perspectiveNarrow);
    let xOffset = (this.w - perspectiveWidth) / 2;

    rect(this.x + xOffset, height - this.bottom + i, perspectiveWidth, 5);
  }

  // Right edge highlight
  fill(50, 50, 255); // Lighter blue for highlight
  rect(this.x + this.w - 8, height - this.bottom, 8, this.bottom);

  // Top edge
  fill(0, 0, 180); // Darker blue for shadow
  rect(this.x, height - this.bottom, this.w, 10);

  // 3D pipe opening with depth
  // Outer rim with gradient
  for (let r = 0; r < 5; r++) {
    let rimColor = map(r, 0, 5, 0, 50);
    fill(0, 0, 180 - rimColor);
    ellipse(this.x + this.w/2, height - this.bottom, this.w * map(r, 0, 5, 0.9, 0.8), 20 - r);
  }

  // Inner opening
  fill(0, 0, 100); // Dark blue for pipe interior
  ellipse(this.x + this.w/2, height - this.bottom, this.w * 0.7, 15);

  // Deep interior with gradient
  for (let d = 0; d < 3; d++) {
    let depthColor = map(d, 0, 3, 80, 20);
    fill(0, 0, depthColor);
    ellipse(this.x + this.w/2, height - this.bottom, this.w * map(d, 0, 3, 0.6, 0.4), 10 - d*2);
  }

  pop();
}

offscreen() {
  return this.x < -this.w;
}

hits(vehicle) {
  // More forgiving hitbox for better gameplay
  // First, check if the plane is horizontally within the pipe's collision area
  // We'll use the center point of the plane for horizontal detection
  let planeCenter = vehicle.x;

  // Only check collision if the plane's center is between the pipe's left and right edges
  let horizontalCollision = planeCenter > this.x && planeCenter < this.x + this.w;

  if (!horizontalCollision) {
    return false; // No collision if not horizontally aligned
  }

  // If we're horizontally aligned, check vertical collision
  // Use a smaller hitbox for more forgiving gameplay
  let planeTop = vehicle.y - vehicle.height/5; // Even more forgiving (1/5 instead of 1/4)
  let planeBottom = vehicle.y + vehicle.height/5;

  // Check if the plane is in the gap
  let inGap = planeTop > this.top && planeBottom < height - this.bottom;

  // Return true for collision if NOT in the gap
  return !inGap;
}
}

// Particle effect class
class Particle {
  constructor(x, y, vx, vy, size, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.alpha = 255;
    this.gravity = 0.05; // Reduced gravity for smoke
    this.drag = 0.98;
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.02, 0.02);
    this.expandRate = random(0.01, 0.03); // Smoke expands as it dissipates
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.alpha -= 5;
    this.size += this.size * this.expandRate; // Smoke expands
    this.rotation += this.rotationSpeed;
  }

  show() {
    if (this.alpha > 0) {
      push();
      translate(this.x, this.y);
      rotate(this.rotation);

      // Draw smoke particle
      noStroke();
      fill(red(this.color), green(this.color), blue(this.color), this.alpha);

      // Soft-edged circle for smoke
      ellipse(0, 0, this.size);

      pop();
    }
  }

  isDead() {
    return this.alpha <= 0 || this.size < 0.5;
  }
}

// Cloud class for background decoration
class Cloud {
  constructor() {
    this.x = width + random(50, 200);
    this.y = random(50, height/2);
    this.speed = random(0.2, 0.5) * parallaxSpeed;
    this.size = random(0.8, 1.3);
    this.opacity = random(180, 220);
    this.width = random(60, 100);
    this.height = random(25, 40);

    // Randomize cloud shape slightly
    this.offsetX1 = random(-5, 5);
    this.offsetX2 = random(-5, 5);
    this.offsetY1 = random(-3, 3);
    this.offsetY2 = random(-3, 3);
  }

  update() {
    this.x -= this.speed * gameSpeed;
  }

  show() {
    push();
    translate(this.x, this.y);
    scale(this.size);

    // Draw a soft, simple cloud directly
    noStroke();

    // Base cloud - soft white with transparency
    fill(255, 255, 255, this.opacity);
    ellipse(0, 0, this.width, this.height);

    // Add a few simple overlapping circles for a fluffy but minimal look
    fill(255, 255, 255, min(this.opacity + 20, 255));
    ellipse(-this.width/4 + this.offsetX1, -this.height/4 + this.offsetY1, this.width/2, this.height/1.5);
    ellipse(this.width/4 + this.offsetX2, -this.height/5 + this.offsetY2, this.width/2.5, this.height/1.8);

    // Subtle highlight on top for dimension
    fill(255, 255, 255, min(this.opacity + 40, 255));
    ellipse(0, -this.height/3, this.width/1.5, this.height/2);

    pop();
  }

  offscreen() {
    return this.x < -100;
  }
}

// Background layer for parallax effect
class BackgroundLayer {
  constructor(y, height, speed, color) {
    this.y = y;
    this.height = height;
    this.speed = speed;
    this.color = color;
    this.elements = [];

    // Create initial elements
    for (let i = 0; i < 3; i++) {
      this.elements.push({
        x: i * width,
        width: width
      });
    }
  }

  update() {
    // Move elements
    for (let i = this.elements.length - 1; i >= 0; i--) {
      this.elements[i].x -= this.speed * gameSpeed;

      // If element is off screen, move it to the end
      if (this.elements[i].x + this.elements[i].width < 0) {
        let lastElement = this.elements[this.elements.length - 1];
        this.elements[i].x = lastElement.x + lastElement.width;
        this.elements.push(this.elements.splice(i, 1)[0]);
      }
    }
  }

  show() {
    fill(this.color);
    noStroke();

    for (let element of this.elements) {
      rect(element.x, this.y, element.width, this.height);
    }
  }
}

// Button class for UI
class Button {
  constructor(x, y, width, height, text, action) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.action = action;
    this.hover = false;
    this.pressEffect = 0;
  }

  update() {
    // Check if mouse is over button
    this.hover = mouseX > this.x - this.width/2 &&
                 mouseX < this.x + this.width/2 &&
                 mouseY > this.y - this.height/2 &&
                 mouseY < this.y + this.height/2;

    // Press effect animation
    if (this.pressEffect > 0) {
      this.pressEffect -= 0.1;
    }
  }

  show() {
    push();
    translate(this.x, this.y);

    // Button shadow
    fill(0, 100);
    noStroke();
    rect(-this.width/2 + 3, -this.height/2 + 3 + this.pressEffect, this.width, this.height, 10);

    // Button body
    if (this.hover) {
      fill(250, 220, 100);
    } else {
      fill(240, 180, 60);
    }
    stroke(200, 120, 0);
    strokeWeight(3);
    rect(-this.width/2, -this.height/2 + this.pressEffect, this.width, this.height, 10);

    // Button text
    noStroke();
    fill(50, 30, 0);
    textAlign(CENTER, CENTER);
    useFont();
    textSize(this.height * 0.5);
    text(this.text, 0, this.pressEffect);

    pop();
  }

  click() {
    if (this.hover) {
      this.pressEffect = 5;
      sounds.button.play();
      this.action();
      return true;
    }
    return false;
  }
}

// UI elements
let restartButton;
let continueButton;

  // Setup function to initialize the game
  function setup() {
    createCanvas(400, 600);
  imageMode(CORNER);

  // Create UI elements
  restartButton = new Button(width/2, height/2 + 50, 180, 50, "RESTART", resetGame);
  continueButton = new Button(width/2, height/2 + 120, 180, 50, "CONTINUE", watchAd);
  shareButton = new Button(width/2 - 95, height/2 + 190, 180, 50, "SHARE ON X", shareScore);
  challengeButton = new Button(width/2 + 95, height/2 + 190, 180, 50, "CHALLENGE", challengeFriend);

  // Create mode selection buttons
  normalModeButton = new Button(width/2 - 130, height/2 + 100, 120, 40, "NORMAL", () => selectGameMode("normal"));
  extremeModeButton = new Button(width/2, height/2 + 100, 120, 40, "EXTREME", () => selectGameMode("extreme"));
  impossibleModeButton = new Button(width/2 + 130, height/2 + 100, 120, 40, "IMPOSSIBLE", () => selectGameMode("impossible"));

  // Create rainbow mode button
  rainbowModeButton = new Button(width/2, height/2 + 160, 180, 40, "RAINBOW MODE", toggleRainbowMode);

  // Create background layers for parallax effect
  let skyColor = color(135, 206, 235);
  let hillColor1 = color(100, 155, 100);
  let hillColor2 = color(70, 130, 70);
  let groundColor = color(210, 180, 140);

  bgLayers.push(new BackgroundLayer(height - 100, 100, 1, groundColor)); // Ground
  bgLayers.push(new BackgroundLayer(height - 150, 50, 0.5, hillColor2)); // Far hills
  bgLayers.push(new BackgroundLayer(height - 180, 80, 0.8, hillColor1)); // Near hills

  // Create initial clouds
  for (let i = 0; i < 5; i++) {
    clouds.push(new Cloud());
    clouds[i].x = random(width);
  }

  // Initialize game
  resetGame();

  // Set text properties
  // Don't call textFont when fonts.main is null

  // Start background music (looping)
  sounds.background.setVolume(0.3);
  sounds.background.loop();
}

// Helper function to use the appropriate font
function useFont() {
  // Don't call textFont if fonts.main is null
  // This prevents the "empty variable" error
  }

  // Main draw loop
  function draw() {
  // Apply screen shake effect
  if (shakeAmount > 0) {
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
    shakeAmount *= 0.9;
  }

  // Draw sky background (day/night cycle)
  let skyColor;
  if (isNight) {
    skyColor = color(20, 24, 82);
  } else {
    skyColor = color(135, 206, 235);
  }
  background(skyColor);

  // Update and draw clouds
  for (let i = clouds.length - 1; i >= 0; i--) {
    clouds[i].update();
    clouds[i].show();
    if (clouds[i].offscreen()) {
      clouds.splice(i, 1);
    }
  }

  // Spawn new clouds
  if (frameCount % 100 === 0 || clouds.length < 3) {
    clouds.push(new Cloud());
  }

  // Update and draw background layers
  for (let layer of bgLayers) {
    layer.update();
    layer.show();
  }

  // Game state handling
    if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'playing') {
    updateGameplay();
    drawGameplay();
  } else if (gameState === 'gameover') {
    drawGameOverScreen();
  } else if (gameState === 'watchingAd') {
    drawAdScreen();
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  // Draw flash effect
  if (flashOpacity > 0) {
    fill(255, 255, 255, flashOpacity);
    rect(0, 0, width, height);
    flashOpacity -= 10;
  }
}

// Draw the start screen
function drawStartScreen() {
  // Title animation with rainbow effect if enabled
  let titleY = height/3 + sin(frameCount * 0.05) * 5;

  // Draw title
  textSize(50);
  textAlign(CENTER);

  // Shadow
  fill(0, 100);
  text("FlyVibe", width/2 + 3, titleY + 3);

  // Title with potential rainbow effect
  if (randomColorMode) {
    colorTimer += 0.05;
    if (colorTimer >= 1) {
      colorTimer = 0;
      currentColor = (currentColor + 1) % rainbowColors.length;
    }

    let nextColor = (currentColor + 1) % rainbowColors.length;
    let r = lerp(rainbowColors[currentColor][0], rainbowColors[nextColor][0], colorTimer);
    let g = lerp(rainbowColors[currentColor][1], rainbowColors[nextColor][1], colorTimer);
    let b = lerp(rainbowColors[currentColor][2], rainbowColors[nextColor][2], colorTimer);

    fill(r, g, b);
  } else {
    fill(255, 215, 0);
  }

  stroke(200, 100, 0);
  strokeWeight(3);
  text("FlyVibe", width/2, titleY);

  // Viral tagline
  noStroke();
  textSize(16);
  fill(255);
  text("THE GAME EVERYONE'S TALKING ABOUT", width/2, titleY + 30);

  // Instructions
  textSize(24);
  text("Click or Press Space to Start", width/2, height/2 + 20);

  textSize(16);
  text("Control with Mouse or Space Bar", width/2, height/2 + 50);

  // Game mode selection
  textSize(20);
  fill(255);
  text("SELECT MODE:", width/2, height/2 + 80);

  normalModeButton.update();
  extremeModeButton.update();
  impossibleModeButton.update();
  rainbowModeButton.update();

  normalModeButton.show();
  extremeModeButton.show();
  impossibleModeButton.show();
  rainbowModeButton.show();

  // Highlight selected mode
  switch(gameMode) {
    case "normal":
      stroke(100, 255, 100);
      strokeWeight(3);
      noFill();
      rect(width/2 - 130 - 60, height/2 + 100 - 20, 120, 40, 10);
      break;
    case "extreme":
      stroke(255, 200, 0);
      strokeWeight(3);
      noFill();
      rect(width/2 - 60, height/2 + 100 - 20, 120, 40, 10);
      break;
    case "impossible":
      stroke(255, 50, 50);
      strokeWeight(3);
      noFill();
      rect(width/2 + 130 - 60, height/2 + 100 - 20, 120, 40, 10);
      break;
  }

  // Name input
  textSize(18);
  fill(255);
  text("ENTER YOUR NAME:", width/2, height/2 + 200);

  // Name input box
  fill(0, 50);
  rect(width/2 - 100, height/2 + 210, 200, 30);

  // Display current name or placeholder
  fill(255);
  textAlign(LEFT);
  if (playerName === "Player" && !nameInputActive) {
    fill(150);
    text("Click to enter name", width/2 - 90, height/2 + 230);
  } else {
    text(playerName + (nameInputActive && frameCount % 30 < 15 ? "|" : ""), width/2 - 90, height/2 + 230);
  }
      textAlign(CENTER);

  // High scores
  textSize(20);
  fill(255);
  text("LEADERBOARD", width/2, height/2 + 260);

  for (let i = 0; i < leaderboard.length; i++) {
    if (leaderboard[i].name === playerName) {
      fill(255, 255, 0);
    } else {
      fill(255);
    }
    text((i+1) + ". " + leaderboard[i].name + " - " + leaderboard[i].score, width/2, height/2 + 290 + i * 25);
  }

  // Animated plane
  let demoX = width/2 + sin(frameCount * 0.05) * 30;
  let demoY = height/2 - 50 + cos(frameCount * 0.08) * 15;

  push();
  translate(demoX, demoY);
  rotate(sin(frameCount * 0.1) * 0.2);

  // Draw demo plane with potential rainbow effect
  if (randomColorMode) {
    let r = rainbowColors[floor(frameCount/5) % rainbowColors.length][0];
    let g = rainbowColors[floor(frameCount/5) % rainbowColors.length][1];
    let b = rainbowColors[floor(frameCount/5) % rainbowColors.length][2];
    fill(r, g, b);
  } else {
    fill(0, 0, 255);
  }

  noStroke();
  triangle(-10, 0, 10, -5, 10, 5);

  pop();

  // Floating clouds
  if (frameCount % 60 === 0) {
    clouds.push(new Cloud());
  }

  // Random viral quote at the bottom
  if (frameCount % 300 === 0) {
    currentMessage = viralQuotes[floor(random(viralQuotes.length))];
    messageAlpha = 255;
  }

  if (messageAlpha > 0) {
    fill(255, 255, 255, messageAlpha);
    textSize(16);
    text(currentMessage, width/2, height - 30);
    messageAlpha -= 0.5;
  }
}

// Update game during gameplay
function updateGameplay() {
  // Apply game mode modifiers
  let modifier = gameModifiers[gameMode];

  if (runwayMode) {
    // In runway mode, plane stays stationary on runway
    vehicle.y = height - bgLayers[0].height/2 - vehicle.height/2;
    vehicle.velocity = 0;
    vehicle.rotation = 0;

    // Runway is stationary until takeoff
    runwayX = 0;

    // Show takeoff instructions
    fill(255);
    textSize(24);
    textAlign(CENTER);
    text("Click or Press SPACE to take off!", width/2, height/2);

    // No pipes spawn during runway mode
    return;
  }

  // Normal gameplay after takeoff
  // Update vehicle with modified gravity
  vehicle.gravity = 0.3 * modifier.gravityMultiplier;
  vehicle.update();

  // Check if vehicle hit the ground
  if (vehicle.y >= height - bgLayers[0].height/2) {
    vehicle.die();
    gameState = 'gameover';
  }

  // Spawn new pipes
  framesSinceLastPipe++;
  if (framesSinceLastPipe >= pipeInterval) {
    pipes.push(new Pipe());
    framesSinceLastPipe = 0;

    // Gradually decrease pipe interval as score increases
    pipeInterval = max(80, 100 - floor(score/10) * 2);
  }

  // Update pipes with modified speed
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].speed = 2 * gameSpeed * modifier.speedMultiplier;
    pipes[i].update();

    // Check for collision
    if (pipes[i].hits(vehicle)) {
      vehicle.die();
      gameState = 'gameover';
    }

    // Check if pipe was passed
    if (!pipes[i].passed && pipes[i].x + pipes[i].w < vehicle.x - vehicle.width/4) {
      pipes[i].passed = true;

      // Calculate perfect pass (if plane is in the middle of the gap)
      let gapMiddle = pipes[i].top + pipes[i].spacing/2;
      perfectPass = abs(vehicle.y - gapMiddle) < 20;

      // Update streak and combo
      if (perfectPass) {
        streakCount++;
        // Increase combo multiplier for consecutive perfect passes
        comboMultiplier = min(5, 1 + streakCount * 0.5);
      } else {
        streakCount = 0;
        comboMultiplier = 1;
      }

      // Calculate points with all multipliers
      let points = 1 * modifier.pointsMultiplier * comboMultiplier;
      score += points;

      // Show appropriate message based on streak
      if (streakCount > 0) {
        let messageIndex = min(scoreMessages.length - 1, streakCount - 1);
        currentMessage = scoreMessages[messageIndex];
        messageAlpha = 255;
      }

      scoreAnimation.target = score;
      sounds.score.play();
      lastScoreTime = millis();

      // Create score particles
      for (let j = 0; j < 5; j++) {
        // Use rainbow colors if enabled
        let particleColor;
        if (randomColorMode) {
          let colorIndex = floor(random(rainbowColors.length));
          particleColor = color(
            rainbowColors[colorIndex][0],
            rainbowColors[colorIndex][1],
            rainbowColors[colorIndex][2]
          );
        } else if (perfectPass) {
          particleColor = color(255, 215, 0); // Gold for perfect pass
        } else {
          particleColor = color(255, 255, 255);
        }

        particles.push(new Particle(
          vehicle.x + 20,
          vehicle.y - 20,
          random(0, 2),
          random(-2, -0.5),
          random(5, 10),
          particleColor
        ));
      }

      // Increase difficulty
      if (score % 10 === 0) {
        // Make difficulty increase more slowly (every 15 points instead of 10)
        // and cap at a lower maximum (8 instead of 10)
        difficultyLevel = min(8, 1 + floor(score / 15));
        // Make speed increase more slowly
        gameSpeed = min(1.3, 1 + (score / 150));

        // Day/night transition
        if (score % 20 === 0) {
          isNight = !isNight;
        }
      }
    }

    // Remove off-screen pipes
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  // Animate score counter
  scoreAnimation.value += (scoreAnimation.target - scoreAnimation.value) * scoreAnimation.speed;

  // Fade out message
  if (messageAlpha > 0) {
    messageAlpha -= 2;
  }
}

// Draw the gameplay elements
function drawGameplay() {
  if (runwayMode) {
    // Draw runway - completely stationary
    fill(50); // Dark gray for runway
    rect(0, height - bgLayers[0].height/2 + 10, width, 20);

    // Draw runway markings - fixed positions
    fill(255);
    for (let i = 0; i < 10; i++) {
      rect(i * 100, height - bgLayers[0].height/2 + 18, 50, 4);
    }

    // Draw runway lights - fixed positions
    for (let i = 0; i < 20; i++) {
      fill(255, 255, 0); // Yellow lights
      ellipse(i * 40, height - bgLayers[0].height/2 + 5, 5, 5);
      fill(255, 0, 0); // Red lights
      ellipse(i * 40 + 20, height - bgLayers[0].height/2 + 5, 5, 5);
    }
  }

  // Draw pipes
  for (let pipe of pipes) {
    pipe.show();
  }

  // Draw vehicle with rainbow effect if enabled
  if (randomColorMode) {
    let r = rainbowColors[floor(frameCount/5) % rainbowColors.length][0];
    let g = rainbowColors[floor(frameCount/5) % rainbowColors.length][1];
    let b = rainbowColors[floor(frameCount/5) % rainbowColors.length][2];
    vehicle.color = color(r, g, b);
  } else {
    vehicle.color = color(0, 0, 255);
  }
  vehicle.show();

  // Draw score with shadow
  textSize(40);
  textAlign(CENTER);
  fill(0, 100);
  text(floor(scoreAnimation.value), width/2 + 2, 52);
  fill(255);
  text(floor(scoreAnimation.value), width/2, 50);

  // Draw game mode indicator
  textSize(16);
  let modeColor;
  switch(gameMode) {
    case "normal":
      modeColor = color(100, 255, 100);
      break;
    case "extreme":
      modeColor = color(255, 200, 0);
      break;
    case "impossible":
      modeColor = color(255, 50, 50);
      break;
  }
  fill(modeColor);
  text(gameMode.toUpperCase() + " MODE", width/2, 80);

  // Draw combo multiplier if active
  if (comboMultiplier > 1) {
      textSize(24);
    fill(255, 215, 0);
    text("COMBO x" + comboMultiplier.toFixed(1), width/2, 110);
  }

  // Draw streak message if active
  if (messageAlpha > 0) {
    textSize(30);
    fill(255, 255, 255, messageAlpha);
    text(currentMessage, width/2, height/2 - 100);

    if (streakCount > 2) {
      textSize(20);
      fill(255, 215, 0, messageAlpha);
      text("STREAK: " + streakCount, width/2, height/2 - 70);
    }
  }
}

// Draw the game over screen
function drawGameOverScreen() {
  // Update buttons
  restartButton.update();
  continueButton.update();
  shareButton.update();
  challengeButton.update();

  // Draw semi-transparent overlay
  fill(0, 150);
  rect(0, 0, width, height);

  // Draw score panel
  let panelWidth = 300;
  let panelHeight = 200;
  let panelX = width/2 - panelWidth/2;
  let panelY = height/3 - panelHeight/2;

  // Panel shadow
  fill(0, 100);
  rect(panelX + 5, panelY + 5, panelWidth, panelHeight, 20);

  // Panel background
  fill(255, 230, 180);
  stroke(200, 150, 80);
  strokeWeight(3);
  rect(panelX, panelY, panelWidth, panelHeight, 20);

  // Game over text
      textAlign(CENTER);
  textSize(40);
  fill(200, 50, 50);
  noStroke();
  text("GAME OVER", width/2, panelY + 50);

  // Score text
  textSize(24);
  fill(50);
  text("Score: " + score, width/2, panelY + 90);

  // Game mode text
  textSize(18);
  let modeColor;
  switch(gameMode) {
    case "normal":
      modeColor = color(0, 150, 0);
      break;
    case "extreme":
      modeColor = color(200, 150, 0);
      break;
    case "impossible":
      modeColor = color(200, 0, 0);
      break;
  }
  fill(modeColor);
  text(gameMode.toUpperCase() + " MODE", width/2, panelY + 115);

  // High score
  textSize(24);
  fill(50);
  if (score > highScore) {
    highScore = score;
    text("NEW HIGH SCORE!", width/2, panelY + 145);

    // Update leaderboard
    let playerEntry = leaderboard.find(entry => entry.name === playerName);
    if (playerEntry) {
      if (score > playerEntry.score) {
        playerEntry.score = score;
        // Sort leaderboard
        leaderboard.sort((a, b) => b.score - a.score);
      }
    } else {
      // Add player to leaderboard
      leaderboard.push({name: playerName, score: score});
      // Sort leaderboard
      leaderboard.sort((a, b) => b.score - a.score);
      // Keep only top 5
      if (leaderboard.length > 5) {
        leaderboard = leaderboard.slice(0, 5);
      }
    }
  } else {
    text("Best: " + highScore, width/2, panelY + 145);
  }

  // Medal based on score
  let medalImg;
  if (score >= 50) {
    medalImg = medals.platinum;
  } else if (score >= 30) {
    medalImg = medals.gold;
  } else if (score >= 20) {
    medalImg = medals.silver;
  } else if (score >= 10) {
    medalImg = medals.bronze;
  }

  if (medalImg) {
    image(medalImg, panelX + 50, panelY + 80, 50, 50);
  }

  // Draw buttons
  restartButton.show();
  continueButton.show();
  shareButton.show();
  challengeButton.show();

  // Draw viral message
  textSize(18);
  fill(255);
  text("SHARE YOUR SCORE!", width/2, height - 50);
}

// Draw the ad screen
function drawAdScreen() {
  background(0);

  // Calculate progress
  let progress = min(1, (millis() - adTimer) / adDuration);

  // Draw progress bar
  fill(50);
  rect(50, height/2 + 50, width - 100, 20);
  fill(0, 200, 0);
  rect(50, height/2 + 50, (width - 100) * progress, 20);

  // Draw ad text
      textSize(32);
      textAlign(CENTER);
  fill(255);
  text("Watching Ad...", width/2, height/2);

  textSize(16);
  text(floor((adDuration - (millis() - adTimer))/1000) + " seconds remaining", width/2, height/2 + 30);

  // Check if ad is finished
  if (progress >= 1) {
        vehicle.y = height / 2;
        vehicle.velocity = 0;
    vehicle.isDead = false;
        gameState = 'playing';

    // Create revival particles
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(
        vehicle.x,
        vehicle.y,
        random(-3, 3),
        random(-3, 3),
        random(5, 15),
        color(100, 255, 100, 200)
      ));
    }
    }
  }

  // Handle mouse clicks
  function mousePressed() {
  if (gameState === 'start') {
    // Check if clicking on name input box
    if (mouseY > height/2 + 210 && mouseY < height/2 + 240 &&
        mouseX > width/2 - 100 && mouseX < width/2 + 100) {
      nameInputActive = true;
      if (playerName === "Player") {
        playerName = "";
      }
      return;
    }

    // Check mode buttons
    if (normalModeButton.click() || extremeModeButton.click() ||
        impossibleModeButton.click() || rainbowModeButton.click()) {
      return;
    }

    startGame();
  } else if (gameState === 'playing') {
    if (runwayMode) {
      // Take off from runway
      runwayMode = false;
      vehicle.flap();
      vehicle.flap(); // Double flap for good initial lift

      // Create takeoff particles
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle(
          vehicle.x - 10,
          vehicle.y + 10,
          random(-3, -1),
          random(-1, 1),
          random(5, 15),
          color(100, 100, 100, 200) // Smoke particles
        ));
      }
    } else {
      vehicle.flap();
    }
  } else if (gameState === 'gameover') {
    // Check button clicks
    if (shareButton.click() || challengeButton.click()) {
      return;
    }

    if (!restartButton.click()) {
      continueButton.click();
    }
  }
}

// Handle keyboard input
function keyPressed() {
  if (nameInputActive) {
    if (keyCode === ENTER || keyCode === RETURN) {
      nameInputActive = false;
      if (playerName === "") {
        playerName = "Player";
      }
    } else if (keyCode === BACKSPACE) {
      playerName = playerName.slice(0, -1);
    } else if (keyCode >= 32 && keyCode <= 126 && playerName.length < 10) {
      playerName += key;
    }
    return;
  }

  if (keyCode === 32) { // 32 is the keyCode for space bar
    if (gameState === 'start') {
      startGame();
    } else if (gameState === 'playing') {
      if (runwayMode) {
        // Take off from runway
        runwayMode = false;
        vehicle.flap();
        vehicle.flap(); // Double flap for good initial lift

        // Create takeoff particles
        for (let i = 0; i < 15; i++) {
          particles.push(new Particle(
            vehicle.x - 10,
            vehicle.y + 10,
            random(-3, -1),
            random(-1, 1),
            random(5, 15),
            color(100, 100, 100, 200) // Smoke particles
          ));
        }
      } else {
        vehicle.flap();
      }
    } else if (gameState === 'gameover') {
      resetGame();
    }
  }
}

// Start the game
function startGame() {
  resetGame();
  gameState = 'playing';
  runwayMode = true; // Start on runway

  // Create start particles
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(
      width/2,
      height/2,
      random(-3, 3),
      random(-3, 3),
      random(5, 15),
      color(255, 215, 0, 200)
    ));
  }
}

// Reset the game to initial state
function resetGame() {
  vehicle = new Vehicle();
  pipes = [];
  score = 0;
  scoreAnimation = { value: 0, target: 0, speed: 0.1 };
  gameState = 'playing';
  difficultyLevel = 1;
  gameSpeed = 1;
  framesSinceLastPipe = 0;
  // Increase initial pipe interval to give player more time between pipes
  pipeInterval = 120;
  streakCount = 0;
  comboMultiplier = 1;
  perfectPass = false;
  messageAlpha = 0;
}

// Watch ad to continue
function watchAd() {
  gameState = 'watchingAd';
  adTimer = millis();
}

// Select game mode
function selectGameMode(mode) {
  gameMode = mode;
  sounds.button.play();

  // Create particles for mode selection
  let particleColor;
  switch(mode) {
    case "normal":
      particleColor = color(100, 255, 100);
      break;
    case "extreme":
      particleColor = color(255, 200, 0);
      break;
    case "impossible":
      particleColor = color(255, 50, 50);
      break;
  }

  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(
      width/2,
      height/2,
      random(-3, 3),
      random(-3, 3),
      random(5, 15),
      particleColor
    ));
  }
}

// Toggle rainbow mode
function toggleRainbowMode() {
  randomColorMode = !randomColorMode;
  sounds.button.play();

  // Create rainbow particles
  for (let i = 0; i < 30; i++) {
    let randomColorIndex = floor(random(rainbowColors.length));
    let r = rainbowColors[randomColorIndex][0];
    let g = rainbowColors[randomColorIndex][1];
    let b = rainbowColors[randomColorIndex][2];

    particles.push(new Particle(
      width/2,
      height/2,
      random(-3, 3),
      random(-3, 3),
      random(5, 15),
      color(r, g, b, 200)
    ));
  }
}

// Share score on social media
function shareScore() {
  let shareText = "";

  if (score > 30) {
    shareText = `I just scored ${score} points in ${gameMode.toUpperCase()} mode on #FlyVibe! I'm unstoppable! Can you beat that? Play at flyvibe.com`;
  } else if (score > 20) {
    shareText = `Just scored ${score} in #FlyVibe ${gameMode.toUpperCase()} mode! So addictive! Try to beat me at flyvibe.com`;
  } else if (score > 10) {
    shareText = `Got ${score} points in #FlyVibe ${gameMode.toUpperCase()} mode. Not bad, but I know I can do better! Play at flyvibe.com`;
  } else {
    shareText = `This game is HARD! Only got ${score} points in #FlyVibe ${gameMode.toUpperCase()} mode. Can you do better? flyvibe.com`;
  }

  // In a real implementation, this would open a share dialog for Twitter/X
  // For now, we'll just show an alert with the share text
  alert("Share this on X:\n\n" + shareText);

  sounds.button.play();
}

// Challenge a friend
function challengeFriend() {
  let challengeText = `I challenge you to beat my score of ${score} in #FlyVibe ${gameMode.toUpperCase()} mode! Play now at flyvibe.com`;

  // In a real implementation, this would open a share dialog
  alert("Challenge your friends on X:\n\n" + challengeText);

  sounds.button.play();
  }
