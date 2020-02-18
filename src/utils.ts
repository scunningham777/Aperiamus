export function someUtilityFunction() {
    return "something";
}

export enum Cardinal_Direction {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
    UP = 'UP',
    DOWN = 'DOWN',
};

export function multiplierFromDirection(dir: Cardinal_Direction): Phaser.Types.Math.Vector2Like {
    let xMultiplier = 0;
    let yMultiplier = 0;

    switch (dir) {
        case Cardinal_Direction.UP:
            yMultiplier = -1;
            break;
        case Cardinal_Direction.RIGHT:
            xMultiplier = 1;
            break;
        case Cardinal_Direction.DOWN:
            yMultiplier = 1;
            break;
        case Cardinal_Direction.LEFT:
            xMultiplier = -1;
            break;
    }

    return {x: xMultiplier, y: yMultiplier};
}