var verbGrammar = require('./verbs');
var verbList = require('./verbLexList');

window.onload = function() {

    var game = new Phaser.Game(320, 384, Phaser.AUTO, 'Labyrinthus', { preload: preload, create: create, update: update, render: render });

    function preload () {

        game.load.tilemap('maps', '/maps/labyrinthus_maps.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('terrain', '/images/terrain.png');

        game.load.spritesheet('player', '/images/romanCharacters.png', 32, 32);
    }

    var map;
    var curMazeLength;
    var availableLayerTypes = [];
    var curRoomLayer;
    var nextRoomLayer;
    var player;
    var cursors;
    var curDirectionInspected;
    var isRoomTransitionActive = false;

    var questionBackground;
    var scoreBackground;
    var answerBackgrounds = {};

    var curQuestion = {};
    var curAnswers = {};
    var answerInfoType;
    var scoreBoard;

    var totalScore = 0;
    var numWrong;
    var curSteps;
    var consecutiveRight;
    var maxConsecutiveRight;

    //Text strings - maybe these should go elsewhere?
    var introMessage =
        "Cave cavum! Oh dear, it seems you have fallen through a hole in the rustic Roman country-side into a diabolical, millenia-old maze. Lucky for you, your understanding of Latin verb-endings should make it easy to escape. Use the arrow keys (or the more \"traditional\" gamer directional keys) to inspect the four exits of your room; then press enter or space to select the exit that grammatically matches the verb listed at the top of the screen. Every right answer brings you closer to the exit - but every wrong answer is, well, a step in the wrong direction. And beware! Only your Latin skills can move you through this labyrinth, for the maze shifts itself with every step, making it impossible to backtrack! Press any key to begin! [ps - if viewed in FireFox, you will need to click the screen once when starting all mazes after the first :( ]";

    var iDeviceMessage =
        "Cave cavum! Oh dear, it seems you have fallen through a hole in the rustic Roman country-side into a diabolical, millenia-old maze. Lucky for you, your understanding of Latin verb-endings should make it easy to escape. Swipe the screen in different directions to inspect the four exits of your room; then double-tap the screen to select the exit that grammatically matches the verb listed at the top of the screen. Every right answer brings you closer to the exit - but every wrong answer is, well, a step in the wrong direction. And beware! Only your Latin skills can move you through this labyrinth, for the maze shifts itself with every step, making it impossible to backtrack! Double-tap the screen to begin!";

    var iDeviceBrowserMsg =
        "Attention iPhone users! This site is best viewed when run from your home screen. Click the middle button on the toolbar at the bottom of your screen, and then select \"Add to Home Screen.\" This will allow the webpage to run like a native app! Or just double-tap the screen to continue in ugly mode.";

    var winMessage =
        "Congrats! You have escaped the maze!";

    var iDeviceWinMessage =
        "Congrats! You have escaped the maze! (double-tap the screen to continue)";

    var newMazeMessage =
        "...only to stumble into another one...";

    function create () {

        initUIElements();
        constructNewMaze();

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

        updateScoreText();
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

        var headerStyle = { font: "24px Arial", fill: '#B0C4DE', boundsAlignH: "center", boundsAlignV: "middle"};
        var answerStyle = { font: "12px Arial", fill: '#ADFF2F', boundsAlignH: "center", boundsAlignV: "middle"};
        curQuestion.ui = game.add.text(questionBackground.centerX, questionBackground.centerY, "", headerStyle);
        curQuestion.ui.anchor.setTo(0.5);
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

        scoreBoard = game.add.text(scoreBackground.centerX, scoreBackground.centerY, "", headerStyle);
        scoreBoard.anchor.setTo(0.5);
    }

    function constructNewMaze() {
        map = game.add.tilemap('maps');
        map.addTilesetImage('terrain');

        curMazeLength = game.rnd.between(8, 12);
        curSteps = 0;

        if (availableLayerTypes.indexOf('Dark Marble' != -1)) {
            availableLayerTypes = ['Dark Marble'];
        } else {
            availableLayerTypes = ['Mossy Brick'];
        }

        curRoomLayer = constructNewRoom();
        curRoomLayer.x = curRoomLayer.width / 2 - map.widthInPixels / 2;
        curRoomLayer.y = curRoomLayer.height / 2 - map.heightInPixels / 2;
    }

    function hideQAndAs() {
        curQuestion.ui.text.visible = false;
        curAnswers.UP.text.visible = false;
        curAnswers.RIGHT.text.visible = false;
        curAnswers.DOWN.text.visible = false;
        curAnswers.LEFT.text.visible = false;
    }

    function showQAndAs() {
        curQuestion.ui.text.visible = true;
        curAnswers.UP.text.visible = true;
        curAnswers.RIGHT.text.visible = true;
        curAnswers.DOWN.text.visible = true;
        curAnswers.LEFT.text.visible = true;
    }

    function generateQAndAs() {
        curQuestion.value = generateRandomVerb();
        curQuestion.ui.text = curQuestion.value.getForm();

        var ans = game.rnd.between(0, 3);

        curAnswers.UP.text = ans === 0 ? answerInfoType.apply(curQuestion.value) : answerInfoType.apply(generateRandomVerb());
        curAnswers.RIGHT.text = ans === 1 ? answerInfoType.apply(curQuestion.value) : answerInfoType.apply(generateRandomVerb());
        curAnswers.DOWN.text = ans === 2 ? answerInfoType.apply(curQuestion.value) : answerInfoType.apply(generateRandomVerb());
        curAnswers.LEFT.text = ans === 3 ? answerInfoType.apply(curQuestion.value) : answerInfoType.apply(generateRandomVerb());
    }

    function answerSelected(selectedDirection) {
        var answerIsCorrect = tryAnswer(selectedDirection);

        if (answerIsCorrect) {
            if (++curSteps == curMazeLength) {
                changeScore(5);
                gameWon();
            } else {
                changeScore(1);
            }
        } else {
            changeScore(0);
        }

        moveToNextRoom(selectedDirection);
    }

    function moveToNextRoom(selectedDirection) {
        //assuming there will be a next room:
        isRoomTransitionActive = true;
        hideQAndAs();

        nextRoomLayer = constructNewRoom();

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

        showQAndAs();

        isRoomTransitionActive = false;
    }

    function constructNewRoom() {
        var newRoomLayer = map.createLayer(game.rnd.pick(availableLayerTypes));

        newRoomLayer.resizeWorld();
        newRoomLayer.fixedToCamera = false;
        newRoomLayer.sendToBack();

        answerInfoType = game.rnd.between(0,1) ? verbGrammar.Verb.prototype.getTranslation : verbGrammar.Verb.prototype.getParseInfo;

        generateQAndAs();

        return newRoomLayer;
    }

    function generateRandomVerb() {
        var newVerbProperties = {};
        newVerbProperties.lexis = getRandomVerbLexis();
        newVerbProperties.mood = getRandomMood();
        newVerbProperties.aspect = getRandomAspect();
        newVerbProperties.person = getRandomPerson(newVerbProperties.mood);
        newVerbProperties.tense = getRandomTense(newVerbProperties.mood);
        newVerbProperties.voice = getRandomVoice(newVerbProperties.lexis, newVerbProperties.aspect);

        return new verbGrammar.Verb(newVerbProperties);

        function getRandomVerbLexis() {
            return game.rnd.pick(verbList);
        }

        function getRandomAspect() {
            return game.rnd.between(0, 1);
        }

        function getRandomMood() {
            return game.rnd.between(0, 1);			//only indicative or subjunctive for now
        }

        function getRandomPerson(mood) {
            switch (mood) {
                case 0:
                case 1:
                    return game.rnd.between(0, 5);
                    break;
                case 2:				//infinitive
                    return null;
                    break;
                case 3:				//imperative
                    return (game.rnd.between(0, 1) ? 1 : 4);
                    break;
                default:
                    console.log("Invalid mood (" + mood + ") in generateRandomVerb!");
                    return null;
            }
        }

        function getRandomTense(mood) {
            if (mood == 0 || mood == 2) {
                return game.rnd.between(0, 2);
            }
            else if (mood == 1) {
                return 1;		//has to be imperfect/pluperfect for now
            }
            else {
                console.log("Currently incorrect mood!");
                return null;
            }
        }

        function getRandomVoice(lexis, aspect) {
            if (lexis.IsDepon == true)		//if verb is deponent, must have passive ending
            {
                return 1;
            }
            else if (lexis.IsSemiDepon == true) {
                if (aspect == undefined) {
                    console.log("Semi-Deponent verb created with no aspect check.");
                    return null;
                }
                else if (aspect == 0) {
                    return game.rnd.between(0, 1);
                }
                else if (aspect == 1) {
                    return 1;
                }
                else {
                    console.log("Incorrect aspect (" + aspect + ") in generateRandomVerb");
                    return null;
                }
            }
            else if (lexis.HasNoPassive == true)		//ok because mutually exclusive with first
            {
                return 0;
            }
            else {
                return game.rnd.between(0, 1);
            }
        }
    }

    function tryAnswer(direction) {
        return (curAnswers[direction].text === answerInfoType.apply(curQuestion.value));
    }

    function changeScore(score) {
        if (score == false) {
            numWrong++;
            consecutiveRight = 0;
            curSteps--;
            totalScore--;
        }
        else {
            consecutiveRight++;
            if (consecutiveRight > maxConsecutiveRight)
                maxConsecutiveRight = consecutiveRight;
            totalScore += score;
        }

        updateScoreText();
    }

    function updateScoreText() {
        scoreBoard.text = getScoreText();
    }

    function getScoreText() {
        return "Current Score: " + totalScore + " | Goal:" + (curMazeLength - curSteps);
    }

    function gameWon() {
        window.alert(winMessage);
        window.alert(newMazeMessage);
    }
};
