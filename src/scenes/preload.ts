export class PreloadScene extends Phaser.Scene {

    preload(): void {

        this.load.crossOrigin = 'anonymous';
        this.load.maxParallelDownloads = Infinity;

        this.load.spritesheet('roman', 'assets/sprites/romanCharacters.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('terrain', 'assets/sprites/terrain.png', { frameWidth: 32, frameHeight: 32 });

        this.load.tilemapTiledJSON('labyrinthus-map', 'assets/maps/labyrinthus_maps.json');
    }

    create(): void {
        this.scene.start('Main');
    }

}
