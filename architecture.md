# FlyVibe Game Architecture

FlyVibe is a polished endless flyer game built with p5.js. This document outlines the architecture, components, and game mechanics.

## Overview

FlyVibe is a side-scrolling endless runner game where players control a flying vehicle, navigating through obstacles (pipes) to achieve the highest score possible. The game features:

- Day-night cycle with dynamic lighting
- Multiple game modes with different difficulty levels
- Particle effects and weather systems
- Parallax scrolling background
- Score and combo system
- Social sharing features

## Core Components

### Game Engine

The game is built using p5.js, a JavaScript library for creative coding. The main game loop follows p5.js conventions:

- `preload()`: Loads assets (sounds, images, fonts)
- `setup()`: Initializes game objects, UI elements, and settings
- `draw()`: Main game loop that runs continuously, handling rendering and updates

### Game States

The game has four main states managed by the `gameState` variable:

1. **Start** (`'start'`): The initial menu screen
2. **Playing** (`'playing'`): Active gameplay
3. **Game Over** (`'gameover'`): Displayed after player death
4. **Watching Ad** (`'watchingAd'`): Simulated ad screen for continue feature

Each state has dedicated update and render functions:
- `drawStartScreen()`: Renders the start menu
- `updateGameplay()` & `drawGameplay()`: Updates and renders the main gameplay
- `drawGameOverScreen()`: Renders the game over screen
- `drawAdScreen()`: Renders the ad screen

### Core Classes

#### Vehicle
The player-controlled entity with properties for:
- Position, velocity, and physics
- Animation frames
- Weather effect handling
- Visual effects (trail, rotation)

Key methods:
- `update()`: Updates physics and position
- `show()`: Renders the vehicle
- `flap()`: Applies upward force when player taps
- `die()`: Handles death state
- `startWeatherEffect()`: Applies weather modifiers in stormy mode

#### Pipe
Obstacles the player must avoid:
- Positioned with random gaps
- Move from right to left
- Detect collisions with the vehicle

Key methods:
- `update()`: Updates position
- `show()`: Renders the pipe
- `offscreen()`: Checks if pipe has left the screen
- `hits()`: Collision detection with vehicle

#### Particle
Visual effects for impacts, weather, etc.:
- Position, velocity, size, and color
- Lifetime management

Key methods:
- `update()`: Updates position and lifetime
- `show()`: Renders the particle
- `isDead()`: Checks if particle should be removed

#### Cloud
Decorative background elements:
- Random size, position, and speed
- Day/night visibility control

Key methods:
- `update()`: Updates position
- `show()`: Renders with time-of-day opacity
- `getTimeVisibility()`: Calculates visibility based on day/night cycle
- `offscreen()`: Checks if cloud has left the screen

#### BackgroundLayer
Parallax scrolling background layers:
- Different speeds for depth effect
- Dynamic lighting based on time of day

Key methods:
- `update()`: Updates position
- `updateLighting()`: Adjusts colors based on time of day
- `show()`: Renders the background layer

#### Button
UI elements for menus and interactions:
- Position, size, text, and action
- Hover and click effects

Key methods:
- `update()`: Checks for hover state
- `show()`: Renders the button
- `click()`: Executes the associated action

## Game Mechanics

### Physics System
- Gravity affects the vehicle
- Flapping provides upward force
- Momentum and rotation create realistic movement

### Day-Night Cycle
- Gradual color transitions in the sky
- Sun/moon positioning
- Star visibility at night
- Dynamic lighting on background elements

### Game Modes
Three difficulty levels:
1. **Normal**: Standard gameplay
2. **Tailwind**: Faster speed, higher points multiplier
3. **Stormy**: Weather effects, highest points multiplier

### Weather Effects (Stormy Mode)
- Air pockets: Sudden vertical displacement
- Headwind: Increased resistance
- Tailwind: Temporary speed boost
- Visual warnings before effects occur

### Scoring System
- Points for passing pipes
- Combo multiplier for consecutive successful passes
- Streak bonuses and visual feedback
- High score tracking

### Social Features
- Score sharing
- Friend challenges
- Leaderboard

## Asset Management

The game works with both placeholder and custom assets:
- Sprite sheets for animations
- Sound effects and background music
- Custom fonts
- Medal graphics

## User Input Handling

Input is processed through p5.js event handlers:
- `mousePressed()`: Handles clicks on buttons and flapping
- `keyPressed()`: Alternative controls for flapping and debugging

## Visual Effects

- Particle systems for impacts and weather
- Screen shake for impacts
- Flash effects for transitions
- Parallax scrolling for depth
- Color transitions for day/night cycle

## Optimization Techniques

- Object pooling for frequently created objects
- Offscreen element cleanup
- Error handling for robustness 
