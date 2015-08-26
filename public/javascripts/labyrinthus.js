window.onload = function() {

    var game = new Phaser.Game(320, 384, Phaser.AUTO, 'Labyrinthus', { preload: preload, create: create, update: update, render: render });

    function preload () {

        game.load.tilemap('map', '/maps/maze01.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('terrain', '/images/terrain.png');

        game.load.spritesheet('player', '/images/romanCharacters.png', 32, 32);
    }

    var map;
    var curRoomLayer;
    var nextRoomLayer;
    var player;
    var cursors;
    var curDirectionInspected;
    var isRoomTransitionActive = false;

    var questionBackground;
    var scoreBackground;
    var answerBackgrounds = {};

    var curQuestion;
    var curAnswers = {};

    function create () {

        map = game.add.tilemap('map');
        map.addTilesetImage('terrain');

        curRoomLayer = map.createLayer('Tile Layer 1');

        curRoomLayer.resizeWorld();
        curRoomLayer.fixedToCamera = false;
        curRoomLayer.x = curRoomLayer.width/2 - map.widthInPixels/2;
        curRoomLayer.y = curRoomLayer.height/2 - map.heightInPixels/2;

        //player
        player = game.add.sprite(curRoomLayer.width/2, curRoomLayer.height/2, 'player', 7);
        player.anchor.set(0.5, 0.5);
        player.animations.add('walk_right', [3, 4, 5], 6, true);
        player.animations.add('walk_left', [9, 10, 11], 6, true);
        player.animations.add('walk_up', [0, 1, 2], 6, true);
        player.animations.add('walk_down', [6, 7, 8], 6, true);
        player.animations.add('stand_right', [4], 10, false);
        player.animations.add('stand_left', [10], 10, false);
        player.animations.add('stand_up', [1], 10, false);
        player.animations.add('stand_down', [7], 10, false);

        curDirectionInspected = "DOWN";

        game.camera.follow(player);

//        player.body.setSize(30, 14, 2, 1);

        //  Allow cursors to turn the player
        cursors = game.input.keyboard.createCursorKeys();

        initUIElements();

        generateQAndAs();

    }

    function update() {
        if (!isRoomTransitionActive) {
            if (cursors.left.isDown) {
                player.play('stand_left');
                curDirectionInspected = "LEFT";
            }
            else if (cursors.right.isDown) {
                player.play('stand_right');
                curDirectionInspected = "RIGHT";
            }
            else if (cursors.up.isDown) {
                player.play('stand_up');
                curDirectionInspected = "UP";
            }
            else if (cursors.down.isDown) {
                player.play('stand_down');
                curDirectionInspected = "DOWN";
            }
            else {
            }

            curAnswers.UP.visible = false;
            curAnswers.RIGHT.visible = false;
            curAnswers.DOWN.visible = false;
            curAnswers.LEFT.visible = false;

            curAnswers[curDirectionInspected].visible = true;

            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                answerSelected(curDirectionInspected);
            }
        }
    }

    function render() {
    }

    function initUIElements() {
        questionBackground = new Phaser.Rectangle(0, 0, 320, 32);
        scoreBackground = new Phaser.Rectangle(0, 32+16+288+16, 320, 32);
        answerBackgrounds.UP = new Phaser.Rectangle(0, 32, 320, 16);
        answerBackgrounds.RIGHT = new Phaser.Rectangle(16+288, 32+16, 16, 288);
        answerBackgrounds.DOWN = new Phaser.Rectangle(0, 32+16+288, 320, 16);
        answerBackgrounds.LEFT = new Phaser.Rectangle(0, 32+16, 16, 288);

        var uiBackground = game.add.graphics();

        uiBackground.beginFill(0x004747, 1);
        uiBackground.drawRect(questionBackground.x, questionBackground.y, questionBackground.width, questionBackground.height);
        uiBackground.drawRect(scoreBackground.x, scoreBackground.y, scoreBackground.width, scoreBackground.height);

        uiBackground.beginFill(0x132020, 1);
        uiBackground.drawRect(answerBackgrounds.UP.x, answerBackgrounds.UP.y, answerBackgrounds.UP.width, answerBackgrounds.UP.height);
        uiBackground.drawRect(answerBackgrounds.RIGHT.x, answerBackgrounds.RIGHT.y, answerBackgrounds.RIGHT.width, answerBackgrounds.RIGHT.height);
        uiBackground.drawRect(answerBackgrounds.DOWN.x, answerBackgrounds.DOWN.y, answerBackgrounds.DOWN.width, answerBackgrounds.DOWN.height);
        uiBackground.drawRect(answerBackgrounds.LEFT.x, answerBackgrounds.LEFT.y, answerBackgrounds.LEFT.width, answerBackgrounds.LEFT.height);


/*        game.debug.geom(questionBackground, '#004747');
        game.debug.geom(scoreBackground, '#004747');
        game.debug.geom(answerBackgrounds.UP, '#132020');
        game.debug.geom(answerBackgrounds.RIGHT, '#132020');
        game.debug.geom(answerBackgrounds.DOWN, '#132020');
        game.debug.geom(answerBackgrounds.LEFT, '#132020');
 */

        var headerStyle = { font: "24px Arial", fill: '#B0C4DE', boundsAlignH: "center", boundsAlignV: "middle"};
        var answerStyle = { font: "12px Arial", fill: '#ADFF2F', boundsAlignH: "center", boundsAlignV: "middle"};
        curQuestion = game.add.text(questionBackground.centerX, questionBackground.centerY, "", headerStyle);
        curQuestion.anchor.setTo(0.5);
        curAnswers.UP = game.add.text(answerBackgrounds.UP.centerX, answerBackgrounds.UP.centerY, "", answerStyle);
        curAnswers.UP.anchor.setTo(0.5);
        curAnswers.UP.visible = false;
        curAnswers.RIGHT = game.add.text(answerBackgrounds.RIGHT.centerX, answerBackgrounds.RIGHT.centerY, "", answerStyle);
        curAnswers.RIGHT.anchor.setTo(0.5);
        curAnswers.RIGHT.angle = 90;
        curAnswers.RIGHT.visible = false;
        curAnswers.DOWN = game.add.text(answerBackgrounds.DOWN.centerX, answerBackgrounds.DOWN.centerY, "", answerStyle);
        curAnswers.DOWN.anchor.setTo(0.5);
        curAnswers.DOWN.visible = false;
        curAnswers.LEFT = game.add.text(answerBackgrounds.LEFT.centerX, answerBackgrounds.LEFT.centerY, "", answerStyle);
        curAnswers.LEFT.anchor.setTo(0.5);
        curAnswers.LEFT.angle = -90;
        curAnswers.LEFT.visible = false;
    }

    function clearQAndAs() {
        curQuestion.text = "";
        curAnswers.UP.text = "";
        curAnswers.RIGHT.text = "";
        curAnswers.DOWN.text = "";
        curAnswers.LEFT.text = "";
    }

    var roomIncrement = 0;

    function generateQAndAs() {
        roomIncrement += 1;

        curQuestion.text = "test " + roomIncrement;
        curAnswers.UP.text = "up test" + roomIncrement;
        curAnswers.RIGHT.text = "right test" + roomIncrement;
        curAnswers.DOWN.text = "down test" + roomIncrement;
        curAnswers.LEFT.text = "left test" + roomIncrement;
    }

    function answerSelected(selectedDirection) {
        //Todo: check result of answer
        //Todo: take action on the result

        //assuming there will be a next room:
        isRoomTransitionActive = true;

        clearQAndAs();

        nextRoomLayer = map.createLayer('Tile Layer 1');
        nextRoomLayer.resizeWorld();
        nextRoomLayer.fixedToCamera = false;
        nextRoomLayer.sendToBack();

        setNewRoomStartingPosition(nextRoomLayer, selectedDirection);

        switchRoomAnimation(curRoomLayer, nextRoomLayer, selectedDirection, roomSwitchCompleted);

    }

    function setNewRoomStartingPosition(newRoomLayer, selectedDirection) {
        newRoomLayer.x = newRoomLayer.width/2 - map.widthInPixels/2;
        newRoomLayer.y = newRoomLayer.height/2 - map.heightInPixels/2;

        switch (selectedDirection) {
            case 'LEFT':
                newRoomLayer.x -= map.widthInPixels;
                break;
            case 'RIGHT':
                newRoomLayer.x += map.widthInPixels;
                break;
            case 'UP':
                newRoomLayer.y -= map.heightInPixels;
                break;
            case 'DOWN':
                newRoomLayer.y += map.heightInPixels;
                break;
        }
    }

    function switchRoomAnimation(oldRoomLayer, newRoomLayer, selectedDirection, callback) {
        player.play("walk_" + selectedDirection.toLowerCase());

        var oldRoomDestProp;

        switch(selectedDirection) {
            case 'LEFT':
                oldRoomDestProp = {x: oldRoomLayer.x+map.widthInPixels};
                break;
            case 'RIGHT':
                oldRoomDestProp = {x: oldRoomLayer.x-map.widthInPixels};
                break;
            case 'UP':
                oldRoomDestProp = {y: oldRoomLayer.y+map.widthInPixels};
                break;
            case 'DOWN':
                oldRoomDestProp = {y: oldRoomLayer.y-map.widthInPixels};
                break;
        }

        var outTween = game.add.tween(oldRoomLayer).to(oldRoomDestProp, 2000, Phaser.Easing.Linear.None, true);
        var inTween = game.add.tween(newRoomLayer).to({x : (newRoomLayer.width/2 - map.widthInPixels/2), y : newRoomLayer.height/2 - map.heightInPixels/2}, 2000, Phaser.Easing.Linear.None, true);

        inTween.onComplete.add(callback, this);


    }

    function roomSwitchCompleted() {
        player.animations.play('stand_' + curDirectionInspected.toLowerCase());

        curRoomLayer.destroy();
        curRoomLayer = nextRoomLayer;

        generateQAndAs();

        isRoomTransitionActive = false;
    }

};
