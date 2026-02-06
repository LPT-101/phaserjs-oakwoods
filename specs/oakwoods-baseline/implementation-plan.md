# Implementation Plan: Oak Woods Baseline Game

## Overview

Build a baseline Phaser 3 game with parallax backgrounds, tilemap ground, and an animated player character. The implementation follows the "go slow" approach - each phase is a minimal working increment.

---

## Phase 1: Project Setup

Set up the Phaser 3 project with TypeScript and Vite.

### Tasks

- [x] Initialize npm project with package.json
- [x] Install Phaser 3 and TypeScript dependencies
- [x] Create TypeScript configuration
- [x] Create vite-env.d.ts for Vite types
- [x] Create index.html with game container
- [x] Create main.ts with Phaser game configuration
- [x] Create BootScene.ts for asset loading (with scene transition)
- [x] Create empty GameScene.ts placeholder

### Technical Details

**package.json:**
```json
{
  "name": "oakwoods-baseline",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "phaser": "^3.90.0"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "vite": "^7.3.1"
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "lib": ["ES2022", "DOM"]
  },
  "include": ["src"]
}
```

**vite-env.d.ts:**
```typescript
/// <reference types="vite/client" />
```

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Oak Woods</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #1a1a1a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    #game-container {
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

**main.ts:**
```typescript
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 320,
  height: 180,
  parent: 'game-container',
  backgroundColor: '#1a1a1a',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 900 },
      debug: false,
    },
  },
  scene: [BootScene, GameScene],
};

new Phaser.Game(config);
```

**BootScene.ts (skeleton with scene transition):**
```typescript
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Assets loaded in Phase 2-4
  }

  create(): void {
    this.scene.start('GameScene');
  }
}
```

**GameScene.ts (placeholder):**
```typescript
import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Implemented in Phase 2-4
  }

  update(): void {
    // Implemented in Phase 2-4
  }
}
```

**File structure:**
```
src/
├── main.ts
├── vite-env.d.ts
└── scenes/
    ├── BootScene.ts
    └── GameScene.ts
```

---

## Phase 2: Background Layers

Add the three parallax background layers.

### Tasks

- [ ] Load background images in BootScene
- [ ] Create GameScene with background layer display
- [ ] Add TileSprite for seamless horizontal tiling
- [ ] Set explicit depth ordering for layers
- [ ] Configure parallax scrolling in update loop

### Technical Details

**Asset loading (add to BootScene.preload):**
```typescript
this.load.image('oakwoods-bg-layer1', 'assets/oakwoods/background/background_layer_1.png');
this.load.image('oakwoods-bg-layer2', 'assets/oakwoods/background/background_layer_2.png');
this.load.image('oakwoods-bg-layer3', 'assets/oakwoods/background/background_layer_3.png');
```

**GameScene class properties:**
```typescript
export class GameScene extends Phaser.Scene {
  private bgLayer1!: Phaser.GameObjects.TileSprite;
  private bgLayer2!: Phaser.GameObjects.TileSprite;
  private bgLayer3!: Phaser.GameObjects.TileSprite;
  // ...
}
```

**Background setup (GameScene.create):**
```typescript
// Create TileSprites for seamless horizontal repeat
// Position at (0, 0) with origin (0, 0) to fill from top-left
this.bgLayer1 = this.add.tileSprite(0, 0, 320, 180, 'oakwoods-bg-layer1');
this.bgLayer1.setOrigin(0, 0);
this.bgLayer1.setScrollFactor(0);  // Fixed position, we scroll the texture
this.bgLayer1.setDepth(0);         // Furthest back

this.bgLayer2 = this.add.tileSprite(0, 0, 320, 180, 'oakwoods-bg-layer2');
this.bgLayer2.setOrigin(0, 0);
this.bgLayer2.setScrollFactor(0);
this.bgLayer2.setDepth(1);         // Middle

this.bgLayer3 = this.add.tileSprite(0, 0, 320, 180, 'oakwoods-bg-layer3');
this.bgLayer3.setOrigin(0, 0);
this.bgLayer3.setScrollFactor(0);
this.bgLayer3.setDepth(2);         // Nearest background
```

**Depth ordering reference:**
| Element | Depth | Notes |
|---------|-------|-------|
| bgLayer1 | 0 | Sky/distant (furthest) |
| bgLayer2 | 1 | Mid-distance forest |
| bgLayer3 | 2 | Near forest |
| groundLayer | 5 | Tilemap ground (Phase 3) |
| player | 10 | Character sprite (Phase 4) |

**Parallax scroll factors:**
| Layer | Multiplier | Effect |
|-------|------------|--------|
| Layer 1 | 0.1 | Slowest scroll (distant) |
| Layer 2 | 0.3 | Medium scroll |
| Layer 3 | 0.5 | Faster scroll (nearer) |

**Update loop for parallax (GameScene.update):**
```typescript
update(): void {
  // Scroll background textures based on camera position
  this.bgLayer1.tilePositionX = this.cameras.main.scrollX * 0.1;
  this.bgLayer2.tilePositionX = this.cameras.main.scrollX * 0.3;
  this.bgLayer3.tilePositionX = this.cameras.main.scrollX * 0.5;
}
```

---

## Phase 3: Ground Tiles

Create a flat ground platform using the tileset.

### Tasks

- [ ] Load tileset image in BootScene
- [ ] Create procedural tilemap for flat ground
- [ ] Place ground tiles across the world width
- [ ] Enable collision on ground tiles
- [ ] Set world and camera bounds

### Technical Details

**Asset loading (add to BootScene.preload):**
```typescript
this.load.image('oakwoods-tileset', 'assets/oakwoods/oak_woods_tileset.png');
```

**Tileset specs (from assets.json):**
- Key: `oakwoods-tileset`
- Path: `assets/oakwoods/oak_woods_tileset.png`
- Tile size: 24x24 pixels
- Total size: 504x360 (21 columns x 15 rows)
- Index formula: `index = row * 21 + column` (0-based)

**Tile indices for flat ground (identified from tileset image):**

Looking at the tileset, the usable tiles for flat ground are:

| Tile | Index | Location | Description |
|------|-------|----------|-------------|
| Grass top (center) | 22 | Row 1, Col 1 | Repeatable grass-topped stone |
| Stone fill | 43 | Row 2, Col 1 | Solid stone for below grass |

*Note: The tileset has multiple platform styles. Row 1 (indices 21-41) contains the main ground tiles. Index 22 is a center grass tile that can repeat horizontally.*

**GameScene class properties (add to existing):**
```typescript
export class GameScene extends Phaser.Scene {
  // ... existing bgLayer properties
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private map!: Phaser.Tilemaps.Tilemap;
}
```

**Tile constants:**
```typescript
// Tile indices from oak_woods_tileset.png (21 columns per row)
const TILE_GRASS_TOP = 22;    // Row 1, Col 1 - grass-topped center tile
const TILE_STONE_FILL = 43;   // Row 2, Col 1 - solid stone fill
```

**Procedural tilemap creation (GameScene.create):**
```typescript
// World dimensions
const WORLD_WIDTH_TILES = 50;  // 50 tiles = 1200px
const WORLD_HEIGHT_TILES = 8;  // 8 tiles = 192px (slightly taller than viewport)

// Create blank tilemap
this.map = this.make.tilemap({
  tileWidth: 24,
  tileHeight: 24,
  width: WORLD_WIDTH_TILES,
  height: WORLD_HEIGHT_TILES,
});

// Add tileset (first param must match the key used in load.image)
const tileset = this.map.addTilesetImage('oakwoods-tileset');
if (!tileset) {
  console.error('Failed to load tileset');
  return;
}

// Create ground layer
this.groundLayer = this.map.createBlankLayer('ground', tileset)!;
this.groundLayer.setDepth(5);  // Above backgrounds, below player

// Fill ground - surface at row 6 (y=144px from top)
const GROUND_ROW = 6;
for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
  // Top grass tile
  this.groundLayer.putTileAt(TILE_GRASS_TOP, x, GROUND_ROW);
  // Fill below with stone
  for (let y = GROUND_ROW + 1; y < WORLD_HEIGHT_TILES; y++) {
    this.groundLayer.putTileAt(TILE_STONE_FILL, x, y);
  }
}

// Enable collision on all placed tiles
this.groundLayer.setCollisionByExclusion([-1]);
```

**World and camera bounds:**
```typescript
// Set physics world bounds to tilemap size
const worldWidth = this.map.widthInPixels;   // 1200px
const worldHeight = this.map.heightInPixels; // 192px
this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

// Set camera bounds (prevents seeing beyond the world)
this.cameras.main.setBounds(0, 0, worldWidth, 180);  // Use viewport height
```

**Ground position calculation:**
- Game viewport height: 180px
- Ground surface at y = 144px (24px * 6 tiles from top)
- Ground thickness: 2 tiles (48px)
- This leaves 144px above ground for character and scenery

---

## Phase 4: Player Character

Add the animated player with movement controls.

### Tasks

- [ ] Load character spritesheet in BootScene
- [ ] Create character animations (idle, run, jump, fall)
- [ ] Add player physics sprite to GameScene
- [ ] Implement keyboard input handling
- [ ] Connect animations to movement states (including airborne states)
- [ ] Add collision between player and ground
- [ ] Configure camera to follow player

### Technical Details

**Asset loading (add to BootScene.preload):**
```typescript
this.load.spritesheet('oakwoods-char-blue',
  'assets/oakwoods/character/char_blue.png',
  { frameWidth: 56, frameHeight: 56 }
);
```

**Spritesheet layout (verified: 448x392px = 8 cols x 7 rows = 56 frames):**
| Animation | Frames | Frame Rate | Repeat | Notes |
|-----------|--------|------------|--------|-------|
| idle | 0-5 | 8 fps | -1 (loop) | Frames 6-7 blank |
| attack | 8-13 | 12 fps | 0 (once) | Frames 14-15 blank |
| run | 16-23 | 10 fps | -1 (loop) | Full row |
| jump (rising) | 24-27 | 10 fps | 0 (once) | First 4 frames of jump |
| fall | 32-35 | 10 fps | -1 (loop) | Mid-jump frames for falling |
| death | 40-51 | 8 fps | 0 (once) | Frames 52-55 blank |

**GameScene complete class properties:**
```typescript
export class GameScene extends Phaser.Scene {
  // Background layers
  private bgLayer1!: Phaser.GameObjects.TileSprite;
  private bgLayer2!: Phaser.GameObjects.TileSprite;
  private bgLayer3!: Phaser.GameObjects.TileSprite;

  // Tilemap
  private map!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;

  // Player
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  // Constants
  private readonly PLAYER_SPEED = 100;
  private readonly JUMP_VELOCITY = -250;

  constructor() {
    super({ key: 'GameScene' });
  }
  // ...
}
```

**Animation creation (in GameScene.create, before player creation):**
```typescript
// Idle animation
this.anims.create({
  key: 'char-blue-idle',
  frames: this.anims.generateFrameNumbers('oakwoods-char-blue', { start: 0, end: 5 }),
  frameRate: 8,
  repeat: -1,
});

// Run animation
this.anims.create({
  key: 'char-blue-run',
  frames: this.anims.generateFrameNumbers('oakwoods-char-blue', { start: 16, end: 23 }),
  frameRate: 10,
  repeat: -1,
});

// Jump animation (rising portion)
this.anims.create({
  key: 'char-blue-jump',
  frames: this.anims.generateFrameNumbers('oakwoods-char-blue', { start: 24, end: 27 }),
  frameRate: 10,
  repeat: 0,
});

// Fall animation (descending/airborne)
this.anims.create({
  key: 'char-blue-fall',
  frames: this.anims.generateFrameNumbers('oakwoods-char-blue', { start: 32, end: 35 }),
  frameRate: 10,
  repeat: -1,
});
```

**Player physics setup:**
```typescript
// Create player sprite with physics
this.player = this.physics.add.sprite(100, 120, 'oakwoods-char-blue');
this.player.setDepth(10);  // Above ground layer

// Custom hitbox - the 56x56 sprite has padding around the character
// Actual character is roughly 20px wide, 38px tall
this.player.body.setSize(20, 38);
this.player.body.setOffset(18, 16);

// Don't let player leave world bounds horizontally
this.player.setCollideWorldBounds(true);

// Start with idle animation
this.player.anims.play('char-blue-idle');
```

**Input setup:**
```typescript
// Create cursor keys for input
this.cursors = this.input.keyboard!.createCursorKeys();
```

**Movement and animation state machine (GameScene.update):**
```typescript
update(): void {
  // Parallax scrolling (from Phase 2)
  this.bgLayer1.tilePositionX = this.cameras.main.scrollX * 0.1;
  this.bgLayer2.tilePositionX = this.cameras.main.scrollX * 0.3;
  this.bgLayer3.tilePositionX = this.cameras.main.scrollX * 0.5;

  // Player movement
  const onGround = this.player.body.onFloor();

  // Horizontal movement
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-this.PLAYER_SPEED);
    this.player.setFlipX(true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(this.PLAYER_SPEED);
    this.player.setFlipX(false);
  } else {
    this.player.setVelocityX(0);
  }

  // Jump
  if (this.cursors.up.isDown && onGround) {
    this.player.setVelocityY(this.JUMP_VELOCITY);
  }

  // Animation state machine
  if (onGround) {
    // On ground: idle or run
    if (this.player.body.velocity.x !== 0) {
      this.player.anims.play('char-blue-run', true);
    } else {
      this.player.anims.play('char-blue-idle', true);
    }
  } else {
    // In air: jump (rising) or fall (descending)
    if (this.player.body.velocity.y < 0) {
      this.player.anims.play('char-blue-jump', true);
    } else {
      this.player.anims.play('char-blue-fall', true);
    }
  }
}
```

**Collision setup:**
```typescript
// Add collision between player and ground tilemap layer
this.physics.add.collider(this.player, this.groundLayer);
```

**Camera follow:**
```typescript
// Camera follows player with smoothing
this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
this.cameras.main.setDeadzone(50, 50);
```

---

## Verification

After implementation, verify each requirement:

### Setup Verification
```bash
npm install
npm run dev
```
- [x] Dev server starts without errors
- [x] Game canvas appears centered in browser
- [x] No console errors

### Background Layers (Acceptance Criteria)
- [ ] Three background layers displayed in correct depth order (far to near)
- [ ] Layers have parallax scrolling effect when camera moves (move player right)
- [ ] Background tiles seamlessly across the screen width (no visible seams)

### Ground Tiles (Acceptance Criteria)
- [ ] Flat ground platform spans the screen width
- [ ] Uses tiles from `oak_woods_tileset.png` (24x24 tiles visible)
- [ ] Ground has collision enabled (player stands on it, doesn't fall through)

### Character (Acceptance Criteria)
- [ ] Blue character sprite displayed on the ground
- [ ] Idle animation plays when standing still (breathing/subtle movement)
- [ ] Run animation plays when moving left/right (leg movement)
- [ ] Jump animation plays when jumping (rising animation)
- [ ] Fall animation plays when descending (different from jump)
- [ ] Character responds to arrow key controls:
  - Left arrow: move left (sprite flips)
  - Right arrow: move right
  - Up arrow: jump (only when on ground)
- [ ] Character has physics-based movement with gravity (falls when jumping)

### Camera
- [ ] Camera follows player horizontally
- [ ] Camera stays within world bounds (stops at edges)
- [ ] Smooth following (lerp effect visible)

### Edge Cases
- [ ] Player cannot walk off left edge of world
- [ ] Player cannot walk off right edge of world
- [ ] Rapid direction changes don't break animations
- [ ] Holding jump doesn't allow infinite jumping
