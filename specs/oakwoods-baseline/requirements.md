# Requirements: Oak Woods Baseline Game

## Overview

Create a baseline Phaser 3 game that replicates the visual style shown in the Oak Woods mockup image. This establishes the foundation for a 2D pixel art platformer using the Oak Woods asset pack.

## Goals

1. Display a parallax forest background with three layers
2. Create a flat ground platform using the tileset
3. Add a playable character with movement controls and animations

## Visual Reference

The mockup (`public/assets/oakwoods/mockup.png`) shows:
- Multi-layered forest background with depth (sky, distant trees, near trees)
- Stone/grass ground platform
- Blue character standing on the platform
- Pixel art style at 320x180 native resolution

## Acceptance Criteria

### Background Layers
- [ ] Three background layers displayed in correct depth order
- [ ] Layers have parallax scrolling effect when camera moves
- [ ] Background tiles seamlessly across the screen width

### Ground Tiles
- [ ] Flat ground platform spans the screen width
- [ ] Uses tiles from `oak_woods_tileset.png` (24x24 tiles)
- [ ] Ground has collision enabled for the player

### Character
- [ ] Blue character sprite displayed on the ground
- [ ] Idle animation plays when standing still
- [ ] Run animation plays when moving left/right
- [ ] Jump animation plays when jumping
- [ ] Character responds to arrow key controls (left, right, up for jump)
- [ ] Character has physics-based movement with gravity

## Assets Reference

All assets defined in `public/assets/oakwoods/assets.json`:

| Asset | Key | Dimensions |
|-------|-----|------------|
| Background Layer 1 (far) | `oakwoods-bg-layer1` | 320x180 |
| Background Layer 2 (mid) | `oakwoods-bg-layer2` | 320x180 |
| Background Layer 3 (near) | `oakwoods-bg-layer3` | 320x180 |
| Character Spritesheet | `oakwoods-char-blue` | 56x56 frames, 8 cols x 7 rows |
| Tileset | `oakwoods-tileset` | 24x24 tiles, 21 cols x 15 rows |

## Technical Constraints

- Native resolution: 320x180 (pixel art scale)
- Phaser 3 with TypeScript
- Arcade physics for character movement
- Vite as build tool
