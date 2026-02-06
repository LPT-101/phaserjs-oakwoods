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
