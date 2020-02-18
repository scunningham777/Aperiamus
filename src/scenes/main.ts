import Player from '../objects/player';
import { WORLD_WIDTH, WORLD_HEIGHT, GAME_SCALE } from '../constants';
import { Cardinal_Direction, multiplierFromDirection } from '../utils';

export class MainScene extends Phaser.Scene {
    private player: Player;
    private map: Phaser.Tilemaps.Tilemap;
    private curTilesetName = 'Dark Marble';
    private tileset: Phaser.Tilemaps.Tileset;
    private curRoomMap: Phaser.Tilemaps.StaticTilemapLayer;
    private nextRoomMap: Phaser.Tilemaps.StaticTilemapLayer;
    private roomTransitionDurationMS = 2000;
    private isTransitioningRoom = false;
    private roomTransitionDirection: Cardinal_Direction = null;

    create(): void {
        this.createPlayer();

        this.createMap();

        this.initDrillManagement();
    }
    
    createPlayer() {
        this.player = new Player(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, this);
    }

    createMap() {
        this.map = this.make.tilemap({
            tileWidth: 32,
            tileHeight: 32,
            width: 9,       // rooms are 9 tiles, need to have room on top, bottom, and sides for next room
            height: 9,
            key: 'labyrinthus-map',
        })
        this.tileset = this.map.addTilesetImage('terrain', 'terrain', 32, 32);
        this.curRoomMap = this.map.createStaticLayer(this.curTilesetName, this.tileset);
        this.curRoomMap.setPosition(WORLD_WIDTH / 2 - this.curRoomMap.width, WORLD_HEIGHT / 2 - this.curRoomMap.height);
        this.curRoomMap.setScale(GAME_SCALE);
    }

    initDrillManagement() {
        this.events.on('answerSelected', this.startRoomTransition.bind(this));
    }

    startRoomTransition(direction: Cardinal_Direction) {
        // this.nextRoomMap = this.map.createStaticLayer(this.curTilesetName, this.tileset);
        const mapDimension = this.curRoomMap.width * GAME_SCALE;
        const directionMultiplierCoords = multiplierFromDirection(direction);
        this.tweens.add({
            targets: this.curRoomMap,
            x: '+=' + (directionMultiplierCoords.x * mapDimension * -1),    //reverse direction since the map it is the background moving
            y: '+=' + (directionMultiplierCoords.y * mapDimension * -1),
            duration: this.roomTransitionDurationMS,
            ease: 'Linear',
            repeat: 0,
            onComplete: this.roomTransitionCompleted.bind(this),
        });
    }

    roomTransitionCompleted(tween: Phaser.Tweens.Tween) {
        this.player.stopMoving();
        tween.remove();
    }

    update(): void {
        this.player.update();
    }
}
