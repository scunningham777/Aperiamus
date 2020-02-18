import { Cardinal_Direction } from '../utils';

const ANIM_FRAME_RATE = 6;

export default class Player {

    private player: Phaser.GameObjects.Sprite;
    private scene: Phaser.Scene;
    private x: number;
    private y: number;
    private direction = Cardinal_Direction.DOWN;
    private controls: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(x: number, y: number, scene: Phaser.Scene) {

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.controls = this.scene.input.keyboard.createCursorKeys();

        this.addToScene();
        this.addAnimations();
        this.initKeyHandlers();
    }

    get entity() {
        return this.player;
    }

    addToScene(): void {
        this.player = this.scene.add.sprite(this.x, this.y, 'roman');
        this.player.setScale(2);
        this.player.setFrame(7);
        this.player.setDepth(1);
    }

    addAnimations(): void {
        this.scene.anims.create({
            key: Cardinal_Direction.UP,
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 0, end: 2 }),
            frameRate: ANIM_FRAME_RATE,
            repeat: -1,
            yoyo: true,
        });
        this.scene.anims.create({
            key: Cardinal_Direction.RIGHT,
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 3, end: 5 }),
            frameRate: ANIM_FRAME_RATE,
            repeat: -1,
            yoyo: true,
        });
        this.scene.anims.create({
            key: Cardinal_Direction.DOWN,
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 6, end: 8 }),
            frameRate: ANIM_FRAME_RATE,
            repeat: -1,
            yoyo: true,
        });
        this.scene.anims.create({
            key: Cardinal_Direction.LEFT,
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 9, end: 11 }),
            frameRate: ANIM_FRAME_RATE,
            repeat: -1,
            yoyo: true,
        });
    }

    setDirection(newDirection: Cardinal_Direction) {
        switch(newDirection) {
            case Cardinal_Direction.UP:
                this.player.setFrame(1);
                this.direction = Cardinal_Direction.UP;
                break;
            case Cardinal_Direction.RIGHT:
                this.player.setFrame(4);
                this.direction = Cardinal_Direction.RIGHT;
                break;
            case Cardinal_Direction.LEFT:
                this.player.setFrame(10);
                this.direction = Cardinal_Direction.LEFT;
                break;
            case Cardinal_Direction.DOWN:
            default: 
                this.player.setFrame(7);
                this.direction = Cardinal_Direction.DOWN;
        }

        this.scene.events.emit('answerInspected', newDirection);
    }

    initKeyHandlers() {
        this.controls.up.on('down', () => {
            this.setDirection(Cardinal_Direction.UP);
        });
        this.controls.right.on('down', () => {
            this.setDirection(Cardinal_Direction.RIGHT);
        });
        this.controls.down.on('down', () => {
            this.setDirection(Cardinal_Direction.DOWN);
        });
        this.controls.left.on('down', () => {
            this.setDirection(Cardinal_Direction.LEFT);
        });
        // TODO: set up swipe handlers
        // TODO: set up "confirm choice" handlers: space bar, double-tap
        this.controls.space.on('down', () => {
            this.scene.events.emit('answerSelected', this.direction);
            this.player.anims.play(this.direction, true);
        });
    }
    
    stopMoving() {
        this.player.anims.stop();
        this.setDirection(this.direction);
    }

    update(): void {
    }
}