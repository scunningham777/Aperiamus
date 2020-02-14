enum Direction {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
    UP = 'UP',
    DOWN = 'DOWN',
};

const ANIM_FRAME_RATE = 6;

export default class Player {

    private player: Phaser.GameObjects.Sprite;
    private scene: Phaser.Scene;
    private x: number;
    private y: number;
    private direction = Direction.DOWN;
    private controls;

    constructor(x: number, y: number, scene: Phaser.Scene) {

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.controls = this.scene.input.keyboard.createCursorKeys();

        this.addToScene();
        this.addAnimations();
        this.initKeyHandlers();

        console.log('player created');
    }

    get entity() {
        return this.player;
    }

    addToScene(): void {
        this.player = this.scene.add.sprite(this.x, this.y, 'roman');
        this.player.setScale(2);
        this.player.setFrame(7);
    }

    addAnimations(): void {
        this.scene.anims.create({
            key: Direction.UP,
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 0, end: 2 }),
            frameRate: ANIM_FRAME_RATE,
            repeat: -1,
            yoyo: true,
        });
        this.scene.anims.create({
            key: Direction.RIGHT,
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 3, end: 5 }),
            frameRate: ANIM_FRAME_RATE,
            repeat: -1,
            yoyo: true,
        });
        this.scene.anims.create({
            key: Direction.DOWN,
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 6, end: 8 }),
            frameRate: ANIM_FRAME_RATE,
            repeat: -1,
            yoyo: true,
        });
        this.scene.anims.create({
            key: Direction.LEFT,
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 9, end: 11 }),
            frameRate: ANIM_FRAME_RATE,
            repeat: -1,
            yoyo: true,
        });
    }

    setDirection(newDirection: Direction) {
        switch(newDirection) {
            case Direction.UP:
                this.player.setFrame(1);
                this.direction = Direction.UP;
                break;
            case Direction.RIGHT:
                this.player.setFrame(4);
                this.direction = Direction.RIGHT;
                break;
            case Direction.LEFT:
                this.player.setFrame(10);
                this.direction = Direction.LEFT;
                break;
            case Direction.DOWN:
            default: 
                this.player.setFrame(7);
                this.direction = Direction.DOWN;
        }
    }

    initKeyHandlers() {
        this.controls.up.on('down', () => {
            this.setDirection(Direction.UP);
        });
        this.controls.right.on('down', () => {
            this.setDirection(Direction.RIGHT);
        });
        this.controls.down.on('down', () => {
            this.setDirection(Direction.DOWN);
        });
        this.controls.left.on('down', () => {
            this.setDirection(Direction.LEFT);
        });
        // TODO: set up swipe handlers
        // TODO: set up "confirm choice" handlers: space bar, double-tap
        this.controls.space.on('down', () => {
            this.scene.events.emit('answerSelected', this.direction);
            this.player.anims.play(this.direction, true);
            setTimeout(() => {
                console.log('here')
                this.player.anims.stop();
                this.setDirection(this.direction);
            }, 2000);
        });
    }

    update(): void {
    }
}