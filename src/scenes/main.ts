import Player from '../objects/player';
import { WORLD_WIDTH, WORLD_HEIGHT } from '../constants';

export class MainScene extends Phaser.Scene {
    private player: Player;

    create(): void {
        this.player = new Player(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, this);
    }

    update(): void {
        this.player.update();
    }
}
