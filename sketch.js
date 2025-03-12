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
let pipeInterval = 200; // Doubled from 100 to 200
let difficultyLevel = 1;
let gameSpeed = 1;
let parallaxSpeed = 0.5;
let flashOpacity = 0;
let shakeAmount = 0;
let scoreAnimation = { value: 0, target: 0, speed: 0.1 };
let buttonHover = { restart: false, continue: false };
let runwayMode = true; // Flag for runway start sequence
let runwayX = 0; // Runway scroll position
let fullscreenButton; // Fullscreen toggle button

// Day-night cycle variables
let dayTime = 0.2; // Start with a fixed time (afternoon) to avoid potential issues
let dayLength = 18000; // 5 minutes in frames (60fps * 60sec * 5min = 18000)
let skyColors = {
  noon: [135, 206, 235],      // Bright blue
  afternoon: [120, 190, 230],  // Slightly less bright blue
  lateAfternoon: [110, 170, 225], // Deeper blue
  sunset: [255, 130, 100],     // Orange-red
  dusk: [70, 80, 120],         // Deep blue-purple
  night: [20, 24, 82],         // Dark blue
  midnight: [10, 10, 30],      // Very dark blue
  earlyMorning: [70, 80, 120], // Deep blue-purple (like dusk)
  dawn: [255, 130, 100],       // Orange-red (like sunset)
  morning: [110, 170, 225],    // Deeper blue (like late afternoon)
  midMorning: [120, 190, 230]  // Slightly less bright blue (like afternoon)
};

// Viral features
let playerName = "Player";
let leaderboard = [
  {name: "Ace", score: 42},
  {name: "Pro", score: 36},
  {name: "Cool", score: 28},
  {name: "Noob", score: 15},
  {name: "Newbie", score: 7}
];
let shareButton;
let challengeButton;
let nameInputActive = false;
let nameInput = "";
let cursorBlink = 0;
let gameMode = "normal"; // normal, tailwind, stormy
let gameModifiers = {
  normal: { speedMultiplier: 1, gravityMultiplier: 0.25, pointsMultiplier: 1 },
  tailwind: { speedMultiplier: 1.5, gravityMultiplier: 0.25, pointsMultiplier: 2 },
  stormy: { speedMultiplier: 1, gravityMultiplier: 0.25, pointsMultiplier: 5 }
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
  "My boss caught me playing #FlyVibe at work!",
  "I'm officially addicted to #FlyVibe"
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
    this.x = width * 0.2; // Position at 20% of screen width instead of fixed value
    this.y = height / 2; // This already positions the plane in the middle of the screen height
    this.velocity = 0;
    this.gravity = 0.1;
    this.flapStrength = -3; // Reduced from -3 to make flaps less powerful
    this.width = 34;
    this.height = 24;
    this.rotation = 0;
    this.frameCount = 0;
    this.animationSpeed = 0.2;
    this.currentFrame = 0;
    this.frames = [0, 1, 2, 1]; // Animation sequence
    this.isDead = false;
    this.trail = [];

    // Bird-like flight physics
    this.wingEnergy = 0;           // Energy from wing flap
    this.wingDecay = 0.995;        // Much slower energy decay
    this.flapCooldown = 0;         // Prevent rapid flapping
    this.maxFlapCooldown = 6;      // Frames to wait between flaps
    this.flapMomentum = 0;         // Forward momentum from flapping
    this.maxFlapMomentum = 0.8;    // Maximum momentum
    this.momentumDecay = 0.59;     // Slow momentum decay
    this.liftCoefficient = 0.025;  // Lift coefficient
    this.baseLift = 0.02;          // Constant base lift factor
    // Removed consecutiveFlaps and flapDiminishFactor

    // Weather effects for stormy mode
    this.weatherEffectTimer = 0;
    this.weatherEffectDuration = 0;
    this.weatherEffectType = null; // 'airpocket', 'headwind', 'tailwind'
    this.weatherEffectIntensity = 0;
    this.weatherEffectWarning = false;
    this.weatherEffectCooldown = 0; // Cooldown between weather effects

    // Blue paper colors for effects
    this.mainBlue = color(65, 105, 225);      // Royal blue
    this.darkBlue = color(30, 60, 180);       // Darker shade for shadows
    this.lightBlue = color(100, 150, 255);    // Lighter shade for highlights
  }

    update() {
    if (!this.isDead) {
      // Decrease flap cooldown
      if (this.flapCooldown > 0) {
        this.flapCooldown--;
      }
      // Removed consecutiveFlaps counter reset

      // Wing energy decays over time
      this.wingEnergy *= this.wingDecay;

      // Forward momentum decays over time
      this.flapMomentum *= this.momentumDecay;

      // Calculate lift based on forward momentum plus base lift
      let lift = (this.flapMomentum * this.liftCoefficient) + this.baseLift;

      // Apply gravity, wing energy and lift to velocity
      this.velocity += this.gravity - this.wingEnergy - lift;

      // Apply weather effects in stormy mode
      if (gameMode === 'stormy') {
        // Update existing weather effect
        if (this.weatherEffectType) {
          this.weatherEffectTimer--;

          // Check if we're transitioning from warning to actual effect
          if (this.weatherEffectWarning && this.weatherEffectTimer <= this.weatherEffectDuration) {
            this.weatherEffectWarning = false;

            // Show the "now happening" message
            let message = "";
            switch(this.weatherEffectType) {
              case 'airpocket':
                message = "Air Pocket!";
                break;
              case 'headwind':
                message = "Headwind!";
                break;
              case 'tailwind':
                message = "Tailwind!";
                break;
            }

            currentMessage = message;
            messageAlpha = 255;

            // Create another burst of particles when the effect actually starts
            for (let i = 0; i < 15; i++) {
              let particleColor;
              if (this.weatherEffectType === 'airpocket') {
                particleColor = color(100, 100, 100, 200);
              } else if (this.weatherEffectType === 'headwind') {
                particleColor = color(200, 100, 100, 200);
              } else if (this.weatherEffectType === 'tailwind') {
                particleColor = color(100, 200, 100, 200);
              }

              particles.push(new Particle(
                this.x + random(-20, 20),
                this.y + random(-20, 20),
                random(-2, 2),
                random(-2, 2),
                random(5, 10),
                particleColor
              ));
            }
          }

          // Only apply the effect if we're past the warning phase
          if (!this.weatherEffectWarning) {
            // Apply the current weather effect
            switch(this.weatherEffectType) {
              case 'airpocket':
                // Subtle drop - increase gravity very slightly
                this.velocity += this.weatherEffectIntensity;
                break;
              case 'headwind':
                // Slow down pipes temporarily
                // This is handled in the updateGameplay function
                break;
              case 'tailwind':
                // Speed up pipes temporarily
                // This is handled in the updateGameplay function
                break;
            }
          }

          // Create weather effect particles
          if (frameCount % 3 === 0) {
            // Only create effect particles if we're past the warning phase
            if (!this.weatherEffectWarning) {
              let particleColor;
              if (this.weatherEffectType === 'airpocket') {
                particleColor = color(100, 100, 100, 150); // Gray for air pocket
              } else if (this.weatherEffectType === 'headwind') {
                particleColor = color(200, 100, 100, 150); // Red for headwind
              } else if (this.weatherEffectType === 'tailwind') {
                particleColor = color(100, 200, 100, 150); // Green for tailwind
              }

              particles.push(new Particle(
                this.x + random(-20, 20),
                this.y + random(-20, 20),
                random(-2, 2),
                random(-2, 2),
                random(3, 8),
                particleColor
              ));
            }
            // Create occasional warning particles during warning phase
            else if (random() < 0.3) {
              let particleColor;
              if (this.weatherEffectType === 'airpocket') {
                particleColor = color(100, 100, 100, 100); // Gray for air pocket
              } else if (this.weatherEffectType === 'headwind') {
                particleColor = color(200, 100, 100, 100); // Red for headwind
              } else if (this.weatherEffectType === 'tailwind') {
                particleColor = color(100, 200, 100, 100); // Green for tailwind
              }

              // Create particles ahead of the plane during warning
              particles.push(new Particle(
                this.x + random(50, 100),
                this.y + random(-30, 30),
                random(-1, 1),
                random(-1, 1),
                random(3, 6),
                particleColor
              ));
            }
          }

          // End the weather effect when timer expires
          if (this.weatherEffectTimer <= 0) {
            this.weatherEffectType = null;
            this.weatherEffectWarning = false;

            // Set a random cooldown period between 5-30 seconds (300-1800 frames at 60fps)
            this.weatherEffectCooldown = floor(random(300, 1800));
          }
        }
        // Check cooldown timer
        else if (this.weatherEffectCooldown > 0) {
          this.weatherEffectCooldown--;
        }
        // Randomly create new weather effects only if cooldown is over
        else if (random() < 0.02) { // 2% chance per frame when cooldown is over
          this.startWeatherEffect();
        }
      }

      this.y += this.velocity;

      // Animate rotation based on velocity and wing energy - more subtle
      let targetRotation = constrain(map(this.velocity, -10, 15, -PI/8, PI/2), -PI/8, PI/2);
      // Add a very slight upward tilt when actively flapping
      if (this.wingEnergy > 0.01) {
        targetRotation -= this.wingEnergy * 0.1; // Reduced tilt effect
      }
      // Smoother, more gradual rotation transition
      this.rotation = lerp(this.rotation, targetRotation, 0.05); // Slower transition

      // Update animation frame - slightly speed up animation during active flapping
      let currentAnimSpeed = this.animationSpeed;
      if (this.wingEnergy > 0.01) {
        currentAnimSpeed = this.animationSpeed * 1.2; // Reduced animation speed increase
      }
      this.frameCount += currentAnimSpeed;
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
    if (!this.isDead && this.flapCooldown <= 0) {
      // Set cooldown to prevent rapid flapping
      this.flapCooldown = this.maxFlapCooldown;

      // Removed tracking consecutive flaps
      // Removed diminishing factor calculation

      // Initial burst of upward force - reduced for less height
      this.velocity = this.flapStrength * 0.2; // Reduced from 0.25 to 0.2

      // Add wing energy that dissipates over time - reduced for less height
      this.wingEnergy = 0.05; // Reduced from 0.08 to 0.05

      // Add forward momentum from flapping - consistent for every flap
      let momentumGain = 0.25;
      this.flapMomentum = min(this.flapMomentum + momentumGain, this.maxFlapMomentum);

      sounds.flap.play();

      // Add white smoke particles with more varied velocities
      for (let i = 0; i < 5; i++) {
        particles.push(new Particle(
          this.x - 5,
          this.y + random(-5, 5),
          random(-2.5, -0.5), // More varied horizontal velocity
          random(-1.5, 1.5),  // More varied vertical velocity
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

  // Start a random weather effect for stormy mode
  startWeatherEffect() {
    // Choose a random weather effect type
    const effectTypes = ['airpocket', 'headwind', 'tailwind'];
    this.weatherEffectType = random(effectTypes);

    // Set duration based on effect type
    switch(this.weatherEffectType) {
      case 'airpocket':
        // Short but less intense
        this.weatherEffectDuration = floor(random(20, 40));
        this.weatherEffectIntensity = random(0.05, 0.1); // Reduced from 0.2-0.4 to 0.05-0.1
        break;
      case 'headwind':
      case 'tailwind':
        // Longer duration
        this.weatherEffectDuration = floor(random(60, 120));
        this.weatherEffectIntensity = random(0.5, 1.5);
        break;
    }

    // Add 3 seconds (180 frames at 60fps) warning before the effect starts
    this.weatherEffectTimer = this.weatherEffectDuration + 180;
    this.weatherEffectWarning = true; // Flag to indicate we're in warning phase

    // Create a burst of warning particles
    for (let i = 0; i < 10; i++) {
      let particleColor;
      if (this.weatherEffectType === 'airpocket') {
        particleColor = color(100, 100, 100, 200); // Gray for air pocket
      } else if (this.weatherEffectType === 'headwind') {
        particleColor = color(200, 100, 100, 200); // Red for headwind
      } else if (this.weatherEffectType === 'tailwind') {
        particleColor = color(100, 200, 100, 200); // Green for tailwind
      }

      particles.push(new Particle(
        this.x + random(-10, 10),
        this.y + random(-10, 10),
        random(-2, 2),
        random(-2, 2),
        random(5, 10),
        particleColor
      ));
    }

    // Add a warning message
    let message = "";
    switch(this.weatherEffectType) {
      case 'airpocket':
        message = "Air Pocket Ahead!";
        break;
      case 'headwind':
        message = "Headwind Approaching!";
        break;
      case 'tailwind':
        message = "Tailwind Coming!";
        break;
    }

    currentMessage = message;
    messageAlpha = 255;
  }
}

// Pipe class representing obstacles
class Pipe {
  constructor() {
    // Adjust spacing based on window height
    let minSpacing = height * 0.3; // 30% of screen height
    let maxSpacing = height * 0.4; // 40% of screen height
    this.spacing = constrain(maxSpacing - (difficultyLevel * height * 0.01), minSpacing, maxSpacing);
    this.top = random(height * 0.1, height * 0.5);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 52;
    this.speed = 2.4 * gameSpeed; // Increased by 20% from 2.0 to 2.4
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
    noStroke();

    // Draw top obstacle - RED with 3D effect
    // Main pipe body with subtle gradient
    for (let i = 0; i < this.top; i += 5) {
      // Create gradient from darker to brighter red (bottom to top)
      let gradientColor = map(i, 0, this.top, 0, 50);
      fill(200 + gradientColor, 0, 0);

      // Add perspective effect - pipe gets narrower at the top
      let perspectiveWidth = map(i, 0, this.top, this.w, this.w * 0.8);
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
      fill(0, 0, 200 + gradientColor);

      // Add perspective effect - pipe gets narrower at the bottom
      let perspectiveWidth = map(i, 0, this.bottom, this.w, this.w * 0.8);
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
      let rimColor = map(r, 0, 5, 200, 150);
      fill(0, 0, rimColor);
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
    this.baseOpacity = random(180, 220);
    this.width = random(60, 100);
    this.height = random(25, 40);

    // Randomize cloud shape slightly
    this.offsetX1 = random(-5, 5);
    this.offsetX2 = random(-5, 5);
    this.offsetY1 = random(-3, 3);
    this.offsetY2 = random(-3, 3);

    // For tailwind mode - elongation factor
    this.elongation = random(1.2, 2.0);
  }

  update() {
    this.x -= this.speed * gameSpeed;
  }

  show() {
    // Calculate time-of-day visibility factor
    let timeVisibility = this.getTimeVisibility();

    // If clouds are completely invisible at this time, don't render them
    if (timeVisibility <= 0) return;

    push();
    translate(this.x, this.y);
    scale(this.size);

    // Draw a soft, simple cloud directly
    noStroke();

    // Adjust cloud appearance based on game mode
    let opacity = this.baseOpacity;
    let cloudColor = [255, 255, 255]; // Default white
    let widthMultiplier = 1;
    let heightMultiplier = 1;

    if (gameMode === "normal") {
      // Normal mode - slightly reduced opacity (80% of base)
      opacity = this.baseOpacity * 0.8;
    } else if (gameMode === "tailwind") {
      // Tailwind mode - wispier clouds (elongated, more transparent)
      widthMultiplier = this.elongation;
      heightMultiplier = 0.7;
      opacity = this.baseOpacity * 0.7;
    } else if (gameMode === "stormy") {
      // Stormy mode - darker clouds
      cloudColor = [220, 220, 220]; // Slightly darker gray
      opacity = this.baseOpacity * 0.9;
    }

    // Apply time-of-day visibility
    opacity *= timeVisibility;

    // Base cloud with adjusted appearance
    fill(cloudColor[0], cloudColor[1], cloudColor[2], opacity);
    ellipse(0, 0, this.width * widthMultiplier, this.height * heightMultiplier);

    // Add a few simple overlapping circles for a fluffy but minimal look
    fill(cloudColor[0], cloudColor[1], cloudColor[2], min(opacity + 20, 255));
    ellipse(-this.width/4 + this.offsetX1, -this.height/4 + this.offsetY1,
            this.width/2 * widthMultiplier, this.height/1.5 * heightMultiplier);
    ellipse(this.width/4 + this.offsetX2, -this.height/5 + this.offsetY2,
            this.width/2.5 * widthMultiplier, this.height/1.8 * heightMultiplier);

    // Subtle highlight on top for dimension
    fill(cloudColor[0], cloudColor[1], cloudColor[2], min(opacity + 40, 255));
    ellipse(0, -this.height/3, this.width/1.5 * widthMultiplier, this.height/2 * heightMultiplier);

    pop();
  }

  // Calculate cloud visibility based on time of day (0-1)
  getTimeVisibility() {
    // Dusk starts at 0.35, night is 0.4-0.6, dawn starts at 0.7
    if (dayTime >= 0.35 && dayTime < 0.4) {
      // Dusk - fade out (0.35-0.4)
      return map(dayTime, 0.35, 0.4, 1, 0);
    } else if (dayTime >= 0.4 && dayTime < 0.6) {
      // Night - invisible
      return 0;
    } else if (dayTime >= 0.6 && dayTime < 0.7) {
      // Dawn - fade in (0.6-0.7)
      return map(dayTime, 0.6, 0.7, 0, 1);
    } else {
      // Day - fully visible
      return 1;
    }
  }

  offscreen() {
    return this.x < -100;
  }
}

// Background layer for parallax effect
class BackgroundLayer {
  constructor(y, height, speed, baseColor) {
    this.y = y;
    this.height = height;
    this.speed = speed;
    this.baseColor = baseColor; // Store the original color
    this.color = baseColor;     // This will be adjusted based on time of day
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

    // Update color based on time of day
    this.updateLighting();
  }

  // Adjust color based on time of day
  updateLighting() {
    let r = red(this.baseColor);
    let g = green(this.baseColor);
    let b = blue(this.baseColor);
    let lightFactor = 1.0;

    // Adjust lighting based on time of day
    if (dayTime < 0.2 || dayTime > 0.8) {
      // Daytime - normal to slightly brighter
      lightFactor = map(
        min(abs(dayTime - 0), abs(dayTime - 1)),
        0, 0.2,
        1.1, 1.0 // Brightest at noon (0.0/1.0)
      );
    } else if (dayTime < 0.3) {
      // Late afternoon to sunset
      lightFactor = map(dayTime, 0.2, 0.3, 1.0, 0.9);
    } else if (dayTime < 0.4) {
      // Sunset to dusk to night
      lightFactor = map(dayTime, 0.3, 0.4, 0.9, 0.6);
    } else if (dayTime < 0.6) {
      // Night to midnight and back
      lightFactor = 0.6; // Darkest at night
    } else if (dayTime < 0.7) {
      // Early morning to dawn
      lightFactor = map(dayTime, 0.6, 0.7, 0.6, 0.9);
    } else if (dayTime < 0.8) {
      // Dawn to morning
      lightFactor = map(dayTime, 0.7, 0.8, 0.9, 1.0);
    }

    // Apply lighting factor
    this.color = color(
      constrain(r * lightFactor, 0, 255),
      constrain(g * lightFactor, 0, 255),
      constrain(b * lightFactor, 0, 255)
    );
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

    // Button shadow - make it more pronounced
    fill(0, 150);
    noStroke();
    rect(-this.width/2 + 4, -this.height/2 + 4 + this.pressEffect, this.width, this.height, 10);

    // Button body - brighter colors
    if (this.hover) {
      // Brighter highlight color when hovering
      fill(255, 230, 120);
      stroke(220, 150, 0);
    } else {
      // Brighter default color
      fill(250, 200, 80);
      stroke(220, 140, 0);
    }

    strokeWeight(3);
    rect(-this.width/2, -this.height/2 + this.pressEffect, this.width, this.height, 10);

    // Button text - darker for better contrast
    noStroke();
    fill(40, 20, 0);
    textAlign(CENTER, CENTER);
    useFont();
    textSize(this.height * 0.5);
    text(this.text, 0, this.pressEffect);

    // Remove the glow effect when hovering
    // No longer adding the extra outline

    pop();
  }

  click() {
    if (this.hover) {
      this.pressEffect = 5;
      sounds.button.play();

      // Call the action function
      if (this.action) {
        this.action();
      }

      return true;
    }
    return false;
  }
}

// Fullscreen button class
class FullscreenButton {
  constructor(size) {
    this.size = size;
    this.x = width - this.size - 10;
    this.y = 10 + this.size/2;
    this.hover = false;
    this.pressEffect = 0;
    this.isFullscreen = false;

    // Check if running on iOS (iPhone/iPad)
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  update() {
    // Skip if on iOS
    if (this.isIOS) return;

    // Update position if window is resized
    this.x = width - this.size - 10;

    // Check if mouse is over button
    this.hover = mouseX > this.x - this.size/2 &&
                 mouseX < this.x + this.size/2 &&
                 mouseY > this.y - this.size/2 &&
                 mouseY < this.y + this.size/2;

    // Press effect animation
    if (this.pressEffect > 0) {
      this.pressEffect -= 0.1;
    }

    // Update fullscreen state - check all possible browser implementations
    this.isFullscreen = !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  }

  show() {
    // Skip if on iOS
    if (this.isIOS) return;

    push();
    translate(this.x, this.y);

    // Button shadow
    fill(0, 100);
    noStroke();
    ellipse(2, 2 + this.pressEffect, this.size, this.size);

    // Button body
    if (this.hover) {
      fill(255, 230, 120);
      stroke(220, 150, 0);
    } else {
      fill(250, 200, 80);
      stroke(220, 140, 0);
    }

    strokeWeight(2);
    ellipse(0, this.pressEffect, this.size, this.size);

    // Fullscreen icon
    noFill();
    stroke(40, 20, 0);
    strokeWeight(2);

    let iconSize = this.size * 0.4;

    // Simple square bracket icon that doesn't change with mode
    rect(-iconSize/2, -iconSize/2, iconSize, iconSize, 2);

    // Show tooltip when hovering
    if (this.hover) {
      noStroke();
      fill(0, 150);
      rect(-80, this.size/2 + 10, 160, 30, 5);

      fill(255);
      textAlign(CENTER, CENTER);
      textSize(14);
      text(this.isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen", 0, this.size/2 + 25);
    }

    pop();
  }

  click() {
    // Skip if on iOS
    if (this.isIOS) return false;

    if (this.hover) {
      this.pressEffect = 5;
      sounds.button.play();

      toggleFullscreen();
      return true;
    }
    return false;
  }
}

// Function to toggle fullscreen mode
function toggleFullscreen() {
  // Check if running on iOS (iPhone/iPad)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // If on iOS, show a message about fullscreen limitations
  if (isIOS) {
    // Create a temporary message element
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    message.style.color = 'white';
    message.style.padding = '20px';
    message.style.borderRadius = '10px';
    message.style.zIndex = '1000';
    message.style.maxWidth = '80%';
    message.style.textAlign = 'center';
    message.innerHTML = 'Fullscreen mode is not supported in iOS Safari.<br>Please use landscape orientation for a better experience.';

    document.body.appendChild(message);

    // Remove the message after 3 seconds
    setTimeout(() => {
      document.body.removeChild(message);
    }, 3000);

    return;
  }

  if (!document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement) {
    // Enter fullscreen
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) { /* Safari */
      docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) { /* Firefox */
      docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) { /* IE/Edge */
      docEl.msRequestFullscreen();
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
  }
}

// UI elements
let restartButton;
let continueButton;

  // Setup function to initialize the game
  function setup() {
    createCanvas(windowWidth, windowHeight);
    imageMode(CORNER);

    // Create UI elements
    restartButton = new Button(width/2, height/2 + 40, 180, 50, "RESTART", resetGame);
    continueButton = new Button(width/2, height/2 + 100, 180, 50, "CONTINUE", watchAd);
    shareButton = new Button(width/2 - 95, height/2 + 160, 180, 50, "SHARE ON X", shareScore);
    challengeButton = new Button(width/2 + 95, height/2 + 160, 180, 50, "CHALLENGE", challengeFriend);

    // Create mode selection buttons - moved lower to avoid covering the SELECT GAME MODE text
    normalModeButton = new Button(width/2 - 130, height/2, 120, 40, "NORMAL", () => selectGameMode("normal"));
    tailwindModeButton = new Button(width/2, height/2, 120, 40, "TAILWIND", () => selectGameMode("tailwind"));
    stormyModeButton = new Button(width/2 + 130, height/2, 120, 40, "STORMY", () => selectGameMode("stormy"));

    // Create fullscreen button
    fullscreenButton = new FullscreenButton(40);

    // Create background layers for parallax effect
    let skyColor = color(135, 206, 235);
    let hillColor1 = color(100, 155, 100);
    let hillColor2 = color(70, 130, 70);
    let groundColor = color(210, 180, 140);

    bgLayers.push(new BackgroundLayer(height - 80, 80, 1, groundColor)); // Ground
    bgLayers.push(new BackgroundLayer(height - 120, 40, 0.5, hillColor2)); // Far hills
    bgLayers.push(new BackgroundLayer(height - 150, 70, 0.8, hillColor1)); // Near hills

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

  // Handle window resizing
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // Reposition UI elements
    restartButton.x = width/2;
    restartButton.y = height/2 + 40;

    continueButton.x = width/2;
    continueButton.y = height/2 + 100;

    shareButton.x = width/2 - 95;
    shareButton.y = height/2 + 160;

    challengeButton.x = width/2 + 95;
    challengeButton.y = height/2 + 160;

    normalModeButton.x = width/2 - 130;
    normalModeButton.y = height/2;

    tailwindModeButton.x = width/2;
    tailwindModeButton.y = height/2;

    stormyModeButton.x = width/2 + 130;
    stormyModeButton.y = height/2;

    // Update fullscreen button position
    fullscreenButton.x = width - fullscreenButton.size - 10;

    // Recreate background layers with new dimensions
    bgLayers = [];
    let hillColor1 = color(100, 155, 100);
    let hillColor2 = color(70, 130, 70);
    let groundColor = color(210, 180, 140);

    bgLayers.push(new BackgroundLayer(height - 80, 80, 1, groundColor)); // Ground
    bgLayers.push(new BackgroundLayer(height - 120, 40, 0.5, hillColor2)); // Far hills
    bgLayers.push(new BackgroundLayer(height - 150, 70, 0.8, hillColor1)); // Near hills
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

  // Update day-night cycle when playing
  if (gameState === 'playing') {
    dayTime = (dayTime + (1 / dayLength)) % 1;
  }

  // Draw sky background with gradual day-night cycle
  let skyColor;
  try {
    skyColor = getDaytimeSkyColor();
  } catch (e) {
    console.error("Error getting sky color:", e);
    skyColor = color(135, 206, 235); // Default to a safe blue color
  }
  background(skyColor);

  // Add stars at night
  try {
    if (dayTime > 0.4 && dayTime < 0.6) {
      drawStars(map(dayTime, 0.4, 0.5, 0, 1)); // Fade in
    } else if (dayTime >= 0.6 && dayTime < 0.9) {
      drawStars(map(dayTime, 0.6, 0.9, 1, 0)); // Fade out
    }
  } catch (e) {
    console.error("Error drawing stars:", e);
  }

  // Add sun or moon
  try {
    drawSunMoon();
  } catch (e) {
    console.error("Error drawing sun/moon:", e);
  }

  // Update and draw clouds
  for (let i = clouds.length - 1; i >= 0; i--) {
    clouds[i].update();
    clouds[i].show();
    if (clouds[i].offscreen()) {
      clouds.splice(i, 1);
    }
  }

  // Spawn new clouds
  if (frameCount % 100 === 0) {
    // Check if it's nighttime (no clouds should spawn)
    let isNighttime = dayTime >= 0.4 && dayTime < 0.6;

    if (!isNighttime) {
      // Adjust cloud frequency based on game mode
      let shouldSpawnCloud = false;

      if (gameMode === "normal") {
        // Reduce clouds by 80% in normal mode
        shouldSpawnCloud = random() < 0.2; // Only 20% chance to spawn
      } else {
        // Regular cloud spawning for other modes
        shouldSpawnCloud = true;
      }

      // Adjust spawn rate during dusk and dawn (transitional periods)
      if (shouldSpawnCloud) {
        if (dayTime >= 0.35 && dayTime < 0.4) {
          // Dusk - decreasing probability
          shouldSpawnCloud = random() < map(dayTime, 0.35, 0.4, 1, 0);
        } else if (dayTime >= 0.6 && dayTime < 0.7) {
          // Dawn - increasing probability
          shouldSpawnCloud = random() < map(dayTime, 0.6, 0.7, 0, 1);
        }
      }

      if (shouldSpawnCloud) {
        clouds.push(new Cloud());
      }
    }
  }

  // Ensure minimum number of clouds during daytime
  if (clouds.length < 1 && !(dayTime >= 0.4 && dayTime < 0.6)) {
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

  // Draw Fullscreen button
  fullscreenButton.update();
  fullscreenButton.show();
}

// Draw the start screen
function drawStartScreen() {
  // Title animation with rainbow effect if enabled
  let titleY = height/4 + sin(frameCount * 0.05) * 5;

  // Draw title
  textSize(min(50, width * 0.12)); // Responsive text size
  textAlign(CENTER);

  // Shadow
  fill(0, 100);
  text("FlyVibe", width/2 + 3, titleY + 3);

  // Title with gold color
  fill(255, 215, 0);
  stroke(200, 100, 0);
  strokeWeight(3);
  text("FlyVibe", width/2, titleY);

  // Viral tagline
  noStroke();
  textSize(min(16, width * 0.04)); // Responsive text size
  fill(255);
  text("", width/2, titleY + 30);

  // Game mode selection - now directly after the title - NO ANIMATION
  textSize(min(24, width * 0.06)); // Responsive text size
  fill(255, 255, 0);
  noStroke(); // Ensure no outline on the text
  // Fixed position for SELECT GAME MODE text, no animation
  text("SELECT GAME MODE:", width/2, height/2 - 30);

  // Update and show mode buttons
  normalModeButton.update();
  tailwindModeButton.update();
  stormyModeButton.update();

  // Draw button backgrounds with stronger colors
  normalModeButton.show();
  tailwindModeButton.show();
  stormyModeButton.show();

  // Only outline the selected mode button
  strokeWeight(4);
  noFill();

  // Only draw outline for the selected mode - updated positions
  switch(gameMode) {
    case "normal":
      stroke(100, 255, 100);
      rect(width/2 - 130 - 60, height/2 - 20, 120, 40, 10);
      break;
    case "tailwind":
      stroke(255, 200, 0);
      rect(width/2 - 60, height/2 - 20, 120, 40, 10);
      break;
    case "stormy":
      stroke(255, 50, 50);
      rect(width/2 + 130 - 60, height/2 - 20, 120, 40, 10);
      break;
  }

  // Add mode descriptions - no outlines - updated positions
  noStroke();
  textSize(min(14, width * 0.035)); // Responsive text size
  fill(255);
  textAlign(CENTER);

  text("Standard", width/2 - 130, height/2 + 30);
  text("1× Points", width/2 - 130, height/2 + 45);

  text("Wind Boost", width/2, height/2 + 30);
  text("2× Points", width/2, height/2 + 45);

  text("Turbulence", width/2 + 130, height/2 + 30);
  text("5× Points", width/2 + 130, height/2 + 45);

  // Instructions - moved to the bottom - no outlines
  noStroke();
  textSize(min(24, width * 0.06)); // Responsive text size
  fill(255);
  text("Click or Press Space to Start", width/2, height - 60);

  textSize(min(16, width * 0.04)); // Responsive text size
  text("Control with Mouse or Space Bar", width/2, height - 30);
}

// Update game during gameplay
function updateGameplay() {
  // Apply game mode modifiers
  let modifier = gameModifiers[gameMode];

  if (runwayMode) {
    // In runway mode, plane stays stationary in the middle of the screen
    vehicle.y = height / 2;
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
    return; // Exit early if game over
  }

  // Spawn new pipes
  framesSinceLastPipe++;
  if (framesSinceLastPipe >= pipeInterval) {
    pipes.push(new Pipe());
    framesSinceLastPipe = 0;

    // Gradually decrease pipe interval as score increases, but keep it higher than before
    pipeInterval = max(160, 200 - floor(score/10) * 2); // Doubled min from 80 to 160, base from 100 to 200
  }

  // Update pipes with modified speed
  for (let i = pipes.length - 1; i >= 0; i--) {
    // Make sure pipe exists
    if (!pipes[i]) continue;

    // Update pipe speed and position - increased by 20%
    let pipeSpeed = 2.4 * gameSpeed * modifier.speedMultiplier; // Increased from 2.0 to 2.4

    // Apply weather effects to pipe speed in stormy mode
    if (gameMode === 'stormy' && vehicle.weatherEffectType && !vehicle.weatherEffectWarning) {
      if (vehicle.weatherEffectType === 'headwind') {
        // Slow down pipes for headwind
        pipeSpeed *= (1 - vehicle.weatherEffectIntensity * 0.3); // Reduce by up to 30%
      } else if (vehicle.weatherEffectType === 'tailwind') {
        // Speed up pipes for tailwind
        pipeSpeed *= (1 + vehicle.weatherEffectIntensity * 0.5); // Increase by up to 50%
      }
    }

    pipes[i].speed = pipeSpeed;
    pipes[i].update();

    // Check for collision
    if (pipes[i].hits(vehicle)) {
      vehicle.die();
      gameState = 'gameover';
      return; // Exit early if game over
    }

    // Check if pipe was passed
    if (!pipes[i].passed && pipes[i].x + pipes[i].w < vehicle.x - vehicle.width/4) {
      pipes[i].passed = true;
      console.log("Pipe passed! Score: " + score);

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
      console.log("New score: " + score);

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
        // Gold for perfect pass, white for normal score
        let particleColor = perfectPass ? color(255, 215, 0) : color(255, 255, 255);

        particles.push(new Particle(
          vehicle.x + 20,
          vehicle.y,
          random(-2, -0.5),
          random(-1, 1),
          random(5, 10),
          particleColor
        ));
      }

      // Increase difficulty every 10 points
      if (score % 10 === 0) {
        // Increase difficulty level (capped at 8)
        difficultyLevel = min(8, 1 + floor(score / 15));

        // Gradually increase game speed (capped at 1.3)
        gameSpeed = min(1.3, 1 + (score / 150));

        // Day/night transition is now handled by the continuous cycle
      }
    }

    // Remove off-screen pipes
    if (pipes[i] && pipes[i].offscreen()) {
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
    for (let i = 0; i < width/100 + 1; i++) {
      rect(i * 100, height - bgLayers[0].height/2 + 18, 50, 4);
    }

    // Draw runway lights - fixed positions
    for (let i = 0; i < width/40 + 1; i++) {
      fill(255, 255, 0); // Yellow lights
      ellipse(i * 40, height - bgLayers[0].height/2 + 5, 5, 5);
      fill(255, 0, 0); // Red lights
      ellipse(i * 40 + 20, height - bgLayers[0].height/2 + 5, 5, 5);
    }

    // Show takeoff instructions
    fill(255);
    textSize(min(24, width * 0.06)); // Responsive text size
    textAlign(CENTER);
    text("Click or Press SPACE to take off!", width/2, height/2);
  }

  // Draw pipes
  for (let pipe of pipes) {
    pipe.show();
  }

  // Draw vehicle with rainbow effect if enabled
  vehicle.show();

  // Draw score with shadow
  textSize(min(40, width * 0.1)); // Responsive text size
  textAlign(CENTER);
  fill(0, 100);
  text(floor(scoreAnimation.value), width/2 + 2, 52);
  fill(255);
  text(floor(scoreAnimation.value), width/2, 50);

  // Draw game mode indicator
  textSize(min(16, width * 0.04)); // Responsive text size
  let modeColor;
  switch(gameMode) {
    case "normal":
      modeColor = color(100, 255, 100);
      break;
    case "tailwind":
      modeColor = color(255, 200, 0);
      break;
    case "stormy":
      modeColor = color(255, 50, 50);
      break;
  }
  fill(modeColor);
  text(gameMode.toUpperCase() + " MODE", width/2, 80);

  // Draw combo multiplier if active
  if (comboMultiplier > 1) {
    textSize(min(24, width * 0.06)); // Responsive text size
    fill(255, 215, 0);
    text("COMBO x" + comboMultiplier.toFixed(1), width/2, 110);
  }

  // Draw streak message if active
  if (messageAlpha > 0) {
    textSize(min(30, width * 0.075)); // Responsive text size
    fill(255, 255, 255, messageAlpha);
    text(currentMessage, width/2, height/2 - 100);

    if (streakCount > 2) {
      textSize(min(20, width * 0.05)); // Responsive text size
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
  let panelWidth = min(width * 0.8, 400); // Responsive width, max 400px
  let panelHeight = min(height * 0.5, 250); // Responsive height, max 250px
  let panelX = width/2 - panelWidth/2;
  let panelY = height/4 - panelHeight/2;

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
  textSize(min(36, width * 0.09)); // Responsive text size
  fill(200, 50, 50);
  noStroke();
  text("GAME OVER", width/2, panelY + panelHeight * 0.2);

  // Score text
  textSize(min(24, width * 0.06)); // Responsive text size
  fill(50);
  text("Score: " + score, width/2, panelY + panelHeight * 0.4);

  // Game mode text
  textSize(min(18, width * 0.045)); // Responsive text size
  let modeColor;
  switch(gameMode) {
    case "normal":
      modeColor = color(0, 150, 0);
      break;
    case "tailwind":
      modeColor = color(200, 150, 0);
      break;
    case "stormy":
      modeColor = color(200, 0, 0);
      break;
  }
  fill(modeColor);
  text(gameMode.toUpperCase() + " MODE", width/2, panelY + panelHeight * 0.55);

  // High score
  textSize(min(24, width * 0.06)); // Responsive text size
  fill(50);
  if (score > highScore) {
    highScore = score;
    text("NEW HIGH SCORE!", width/2, panelY + panelHeight * 0.7);

    // Update leaderboard with default player name
    let playerEntry = leaderboard.find(entry => entry.name === "Player");
    if (playerEntry) {
      if (score > playerEntry.score) {
        playerEntry.score = score;
        // Sort leaderboard
        leaderboard.sort((a, b) => b.score - a.score);
      }
    } else {
      // Add player to leaderboard
      leaderboard.push({name: "Player", score: score});
      // Sort leaderboard
      leaderboard.sort((a, b) => b.score - a.score);
      // Keep only top 5
      if (leaderboard.length > 5) {
        leaderboard = leaderboard.slice(0, 5);
      }
    }
  } else {
    text("Best: " + highScore, width/2, panelY + panelHeight * 0.7);
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
    let medalSize = min(50, width * 0.1); // Responsive medal size
    image(medalImg, panelX + medalSize, panelY + panelHeight * 0.4, medalSize, medalSize);
  }

  // Draw buttons
  restartButton.show();
  continueButton.show();
  shareButton.show();
  challengeButton.show();

  // Draw viral message
  textSize(min(18, width * 0.045)); // Responsive text size
  fill(255);
  text("SHARE YOUR SCORE!", width/2, height - 20);
}

// Draw the ad screen
function drawAdScreen() {
  background(0);

  // Calculate progress
  let progress = min(1, (millis() - adTimer) / adDuration);

  // Draw progress bar
  fill(50);
  rect(width * 0.1, height/2 + 40, width * 0.8, 20);
  fill(0, 200, 0);
  rect(width * 0.1, height/2 + 40, width * 0.8 * progress, 20);

  // Draw ad text
  textSize(32);
  textAlign(CENTER);
  fill(255);
  text("Watching Ad...", width/2, height/2);

  textSize(16);
  text(floor((adDuration - (millis() - adTimer))/1000) + " seconds remaining", width/2, height/2 + 30);

  // Check if ad is finished
  if (progress >= 1) {
    vehicle = new Vehicle(); // Create a new vehicle to ensure proper positioning
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
  // Check if fullscreen button was clicked
  if (fullscreenButton.click()) {
    return;
  }

  if (gameState === 'start') {
    // Check mode buttons first
    if (normalModeButton.click()) {
      selectGameMode("normal");
      return;
    }

    if (tailwindModeButton.click()) {
      selectGameMode("tailwind");
      return;
    }

    if (stormyModeButton.click()) {
      selectGameMode("stormy");
      return;
    }

    // If no button was clicked, start the game
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
    if (shareButton.click()) {
      shareScore();
      return;
    }

    if (challengeButton.click()) {
      challengeFriend();
      return;
    }

    if (restartButton.click()) {
      resetGame();
      return;
    }

    if (continueButton.click()) {
      watchAd();
      return;
    }
  }
}

// Handle keyboard input
function keyPressed() {
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
  // Don't reset the game here, just change the state
  // This preserves the selected game mode
  gameState = 'playing';

  // Ensure runway mode is active
  runwayMode = true;

  // Reset game elements
  vehicle = new Vehicle();
  pipes = [];
  score = 0;
  scoreAnimation = { value: 0, target: 0, speed: 0.1 };
  difficultyLevel = 1;
  gameSpeed = 1;
  framesSinceLastPipe = 0;
  pipeInterval = 240; // Doubled from 120 to 240
  streakCount = 0;
  comboMultiplier = 1;
  perfectPass = false;
  messageAlpha = 0;

  // Reset runway position
  runwayX = 0;

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

  // Reset any active weather effects
  vehicle.weatherEffectType = null;
  vehicle.weatherEffectTimer = 0;
  vehicle.weatherEffectWarning = false;
  vehicle.weatherEffectCooldown = floor(random(300, 600)); // Start with a random cooldown (5-10 seconds)

  pipes = [];
  score = 0;
  scoreAnimation = { value: 0, target: 0, speed: 0.1 };
  gameState = 'start';
  difficultyLevel = 1;
  gameSpeed = 1;
  framesSinceLastPipe = 0;
  // Increase initial pipe interval to give player more time between pipes
  pipeInterval = 240; // Doubled from 120 to 240
  streakCount = 0;
  comboMultiplier = 1;
  perfectPass = false;
  messageAlpha = 0;

  // Set day-night cycle to a safe time of day (afternoon)
  dayTime = 0.2;

  // Always start from runway mode when resetting
  runwayMode = true;

  // Reset runway position
  runwayX = 0;
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
    case "tailwind":
      particleColor = color(255, 200, 0);
      break;
    case "stormy":
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

// Share score on social media
function shareScore() {
  let shareText = "";

  if (score > 30) {
    shareText = `I just scored ${score} points in ${gameMode.toUpperCase()} mode! I'm unstoppable! Can you beat that? Play at flyvibe.com`;
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

// Get sky color based on time of day
function getDaytimeSkyColor() {
  // Safety check - ensure dayTime is a valid number between 0 and 1
  if (isNaN(dayTime) || dayTime < 0 || dayTime > 1) {
    console.log("Invalid dayTime value:", dayTime);
    dayTime = 0.2; // Reset to a safe value (afternoon)
  }

  // Map dayTime (0-1) to different times of day
  if (dayTime < 0.1) { // Noon to afternoon (0.0-0.1)
    return lerpColor(
      color(skyColors.noon[0], skyColors.noon[1], skyColors.noon[2]),
      color(skyColors.afternoon[0], skyColors.afternoon[1], skyColors.afternoon[2]),
      map(dayTime, 0, 0.1, 0, 1)
    );
  } else if (dayTime < 0.2) { // Afternoon to late afternoon (0.1-0.2)
    return lerpColor(
      color(skyColors.afternoon[0], skyColors.afternoon[1], skyColors.afternoon[2]),
      color(skyColors.lateAfternoon[0], skyColors.lateAfternoon[1], skyColors.lateAfternoon[2]),
      map(dayTime, 0.1, 0.2, 0, 1)
    );
  } else if (dayTime < 0.3) { // Late afternoon to sunset (0.2-0.3)
    return lerpColor(
      color(skyColors.lateAfternoon[0], skyColors.lateAfternoon[1], skyColors.lateAfternoon[2]),
      color(skyColors.sunset[0], skyColors.sunset[1], skyColors.sunset[2]),
      map(dayTime, 0.2, 0.3, 0, 1)
    );
  } else if (dayTime < 0.35) { // Sunset to dusk (0.3-0.35)
    return lerpColor(
      color(skyColors.sunset[0], skyColors.sunset[1], skyColors.sunset[2]),
      color(skyColors.dusk[0], skyColors.dusk[1], skyColors.dusk[2]),
      map(dayTime, 0.3, 0.35, 0, 1)
    );
  } else if (dayTime < 0.4) { // Dusk to night (0.35-0.4)
    return lerpColor(
      color(skyColors.dusk[0], skyColors.dusk[1], skyColors.dusk[2]),
      color(skyColors.night[0], skyColors.night[1], skyColors.night[2]),
      map(dayTime, 0.35, 0.4, 0, 1)
    );
  } else if (dayTime < 0.5) { // Night to midnight (0.4-0.5)
    return lerpColor(
      color(skyColors.night[0], skyColors.night[1], skyColors.night[2]),
      color(skyColors.midnight[0], skyColors.midnight[1], skyColors.midnight[2]),
      map(dayTime, 0.4, 0.5, 0, 1)
    );
  } else if (dayTime < 0.6) { // Midnight to early morning (0.5-0.6)
    return lerpColor(
      color(skyColors.midnight[0], skyColors.midnight[1], skyColors.midnight[2]),
      color(skyColors.earlyMorning[0], skyColors.earlyMorning[1], skyColors.earlyMorning[2]),
      map(dayTime, 0.5, 0.6, 0, 1)
    );
  } else if (dayTime < 0.7) { // Early morning to dawn (0.6-0.7)
    return lerpColor(
      color(skyColors.earlyMorning[0], skyColors.earlyMorning[1], skyColors.earlyMorning[2]),
      color(skyColors.dawn[0], skyColors.dawn[1], skyColors.dawn[2]),
      map(dayTime, 0.6, 0.7, 0, 1)
    );
  } else if (dayTime < 0.8) { // Dawn to morning (0.7-0.8)
    return lerpColor(
      color(skyColors.dawn[0], skyColors.dawn[1], skyColors.dawn[2]),
      color(skyColors.morning[0], skyColors.morning[1], skyColors.morning[2]),
      map(dayTime, 0.7, 0.8, 0, 1)
    );
  } else if (dayTime < 0.9) { // Morning to mid-morning (0.8-0.9)
    return lerpColor(
      color(skyColors.morning[0], skyColors.morning[1], skyColors.morning[2]),
      color(skyColors.midMorning[0], skyColors.midMorning[1], skyColors.midMorning[2]),
      map(dayTime, 0.8, 0.9, 0, 1)
    );
  } else { // Mid-morning to noon (0.9-1.0)
    return lerpColor(
      color(skyColors.midMorning[0], skyColors.midMorning[1], skyColors.midMorning[2]),
      color(skyColors.noon[0], skyColors.noon[1], skyColors.noon[2]),
      map(dayTime, 0.9, 1.0, 0, 1)
    );
  }
}

// Draw stars with opacity based on time of day
function drawStars(opacity) {
  // Safety checks
  if (isNaN(opacity) || opacity < 0) {
    opacity = 0;
  } else if (opacity > 1) {
    opacity = 1;
  }

  // Only draw stars if they're at least somewhat visible
  if (opacity <= 0) return;

  // Use a consistent seed for the stars so they don't change position
  randomSeed(42);

  // Draw stars with varying brightness
  fill(255, 255, 255, 255 * opacity);
  noStroke();

  for (let i = 0; i < 100; i++) {
    let starX = random(width);
    let starY = random(height/2); // Stars only in the upper half of the screen
    let starSize = random(1, 3);

    // Twinkle effect
    let twinkle = sin(frameCount * 0.05 + i * 0.4) * 0.3 + 0.7;

    ellipse(starX, starY, starSize * twinkle, starSize * twinkle);
  }

  // Reset the random seed
  randomSeed();
}

// Draw sun or moon based on time of day
function drawSunMoon() {
  // Safety check - ensure dayTime is valid
  if (isNaN(dayTime) || dayTime < 0 || dayTime > 1) {
    return; // Skip drawing if dayTime is invalid
  }

  try {
    let celestialX, celestialY, celestialSize, celestialColor, glowOpacity;

    // Calculate position based on time of day
    // Full arc from left horizon to right horizon
    let angle = map(dayTime, 0, 1, -PI, PI);
    let radius = height * 0.8;

    celestialX = width/2 + cos(angle) * radius;
    celestialY = height + sin(angle) * radius;

    // Determine if it's sun or moon and set appropriate size and color
    if (dayTime < 0.3 || dayTime > 0.7) {
      // Sun
      celestialSize = 60;

      // Sun color changes based on time of day
      if (dayTime < 0.3) { // Afternoon to sunset
        celestialColor = lerpColor(
          color(255, 255, 200), // Bright yellow
          color(255, 150, 50),  // Orange
          map(dayTime, 0, 0.3, 0, 1)
        );
      } else { // Dawn to noon
        celestialColor = lerpColor(
          color(255, 150, 50),  // Orange
          color(255, 255, 200), // Bright yellow
          map(dayTime, 0.7, 1, 0, 1)
        );
      }

      // Sun glow
      glowOpacity = 0.2;
      if (dayTime > 0.2 && dayTime < 0.3) { // Sunset glow
        glowOpacity = map(dayTime, 0.2, 0.3, 0.2, 0.5);
      } else if (dayTime > 0.7 && dayTime < 0.8) { // Dawn glow
        glowOpacity = map(dayTime, 0.7, 0.8, 0.5, 0.2);
      }

      // Draw sun glow
      for (let i = 5; i > 0; i--) {
        fill(red(celestialColor), green(celestialColor), blue(celestialColor), 255 * glowOpacity * (1 - i/5));
        ellipse(celestialX, celestialY, celestialSize * (1 + i/2));
      }

      // Draw sun
      fill(celestialColor);
      ellipse(celestialX, celestialY, celestialSize);

    } else {
      // Moon
      celestialSize = 40;

      // Draw moon
      fill(240, 240, 220);
      ellipse(celestialX, celestialY, celestialSize);

      // Draw moon craters
      fill(220, 220, 200);
      ellipse(celestialX - 10, celestialY - 5, 10);
      ellipse(celestialX + 8, celestialY + 10, 8);
      ellipse(celestialX + 5, celestialY - 8, 6);
    }
  } catch (e) {
    console.error("Error drawing sun or moon:", e);
  }
}
