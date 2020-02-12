export default class Player {

    private player: Phaser.GameObjects.Sprite;
    private scene: Phaser.Scene;
    private x: number;
    private y: number;
    private controls;
    private touchStartX: number = null;
    private doubleTouch = false;

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
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1,
            yoyo: true,
        });

        this.scene.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('roman', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    initKeyHandlers() {
        this.controls.up.on('down', () => {
            this.player.setFrame(1)
        });
        this.controls.right.on('down', () => {
            this.player.setFrame(4)
        });
        this.controls.down.on('down', () => {
            this.player.setFrame(7)
        });
        this.controls.left.on('down', () => {
            this.player.setFrame(10)
        });
        // TODO: set up swipe handlers
        // TODO: set up "confirm choice" handlers: space bar, double-tap
    }

    update(): void {
    }
}