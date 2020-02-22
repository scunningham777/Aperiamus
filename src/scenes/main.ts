import Player from '../objects/player';
import { WORLD_WIDTH, WORLD_HEIGHT, GAME_SCALE } from '../constants';
import { Cardinal_Direction, multiplierFromDirection } from '../utils';

export class MainScene extends Phaser.Scene {
    private player: Player;
    private map: Phaser.Tilemaps.Tilemap;
    private availableTilesetNames = ['Dark Marble', 'Mossy Brick'];
    private curTilesetName = '';
    private curTilesetData: number[][];
    private tileset: Phaser.Tilemaps.Tileset;
    private curRoomLayer: Phaser.Tilemaps.DynamicTilemapLayer;
    private nextRoomLayer: Phaser.Tilemaps.DynamicTilemapLayer;
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
        this.initMapAndLayers();
        this.determineTileset();

        this.generateNewRoomOnLayer(this.curRoomLayer, {x: 0, y: 0});
    }
    
    initMapAndLayers() {
        this.map = this.make.tilemap({
            tileWidth: 32,
            tileHeight: 32,
            width: 9,
            height: 9,
            key: 'labyrinthus-map',
        });
        this.tileset = this.map.addTilesetImage('terrain', 'terrain', 32, 32);
        this.curRoomLayer = this.map.createBlankDynamicLayer('curRoom', this.tileset);
        this.nextRoomLayer = this.map.createBlankDynamicLayer('nextRoom', this.tileset);
    }

    determineTileset() {
        this.curTilesetName = Phaser.Math.RND.pick(this.availableTilesetNames);
        const curTileset = this.map.layers.find(l => l.name === this.curTilesetName);
        this.curTilesetData = (curTileset.data as unknown) as number[][];
        console.log(this.curTilesetName);
    }

    generateNewRoomOnLayer(layer: Phaser.Tilemaps.DynamicTilemapLayer, positionOffsetMultiplier: Phaser.Types.Math.Vector2Like) {
        const roomX = (WORLD_WIDTH / 2) - layer.width + (positionOffsetMultiplier.x * layer.width * GAME_SCALE);
        const roomY = (WORLD_HEIGHT / 2) - layer.height + (positionOffsetMultiplier.y * layer.height * GAME_SCALE);
        layer.putTilesAt(this.curTilesetData, 0, 0);
        layer.setPosition(roomX, roomY);
        layer.setScale(GAME_SCALE);
    }



    initDrillManagement() {
        this.events.on('answerSelected', this.startRoomTransition.bind(this));
    }

    startRoomTransition(direction: Cardinal_Direction) {
        const newRoomPositionMultiplier = multiplierFromDirection(direction);
        this.generateNewRoomOnLayer(this.nextRoomLayer, newRoomPositionMultiplier);
        const mapDimension = this.curRoomLayer.width * GAME_SCALE;
        const directionMultiplierCoords = multiplierFromDirection(direction);
        this.tweens.add({
            targets: this.curRoomLayer,
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
