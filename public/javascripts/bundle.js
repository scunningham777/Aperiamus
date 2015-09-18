(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./verbLexList":2,"./verbs":3}],2:[function(require,module,exports){
'use strict';

var VerbList = [
    { "Conjugation":0,
        "PresStem":"laud",
        "PerfStem":"laudav",
        "PerfPassPart":"laudat",
        "EnglPres":"praise",
        "EnglPresConj":"praises",
        "EnglPresPart":"praising",
        "EnglPast":"praised",
        "EnglPastPart":"praised",
        "IsDepon":0,
        "IsSemiDepon":0,
        "HasNoPassive":0,
        "IsIrregular":0 },
    { "Conjugation":0,
        "PresStem":"port",
        "PerfStem":"portav",
        "PerfPassPart":"portat",
        "EnglPres":"carry",
        "EnglPresConj":"carries",
        "EnglPresPart":"carrying",
        "EnglPast":"carried",
        "EnglPastPart":"carried",
        "IsDepon":0,
        "IsSemiDepon":0,
        "HasNoPassive":0,
        "IsIrregular":0 },
    { "Conjugation":1,
        "PresStem":"mov",
        "PerfStem":"mov",
        "PerfPassPart":"mot",
        "EnglPres":"move",
        "EnglPresConj":"moves",
        "EnglPresPart":"moving",
        "EnglPast":"moved",
        "EnglPastPart":"moved",
        "IsDepon":0,
        "IsSemiDepon":0,
        "HasNoPassive":0,
        "IsIrregular":0 },
    { "Conjugation":2,
        "PresStem":"mitt",
        "PerfStem":"mis",
        "PerfPassPart":"miss",
        "EnglPres":"send",
        "EnglPresConj":"sends",
        "EnglPresPart":"sending",
        "EnglPast":"sent",
        "EnglPastPart":"sent",
        "IsDepon":0,
        "IsSemiDepon":0,
        "HasNoPassive":0,
        "IsIrregular":0 },
    { "Conjugation":3,
        "PresStem":"iac",
        "PerfStem":"iec",
        "PerfPassPart":"iact",
        "EnglPres":"throw",
        "EnglPresConj":"throws",
        "EnglPresPart":"throwing",
        "EnglPast":"threw",
        "EnglPastPart":"thrown",
        "IsDepon":0,
        "IsSemiDepon":0,
        "HasNoPassive":0,
        "IsIrregular":0 },
    { "Conjugation":4,
        "PresStem":"aud",
        "PerfStem":"audiv",
        "PerfPassPart":"audit",
        "EnglPres":"hear",
        "EnglPresConj":"hears",
        "EnglPresPart":"hearing",
        "EnglPast":"heard",
        "EnglPastPart":"heard",
        "IsDepon":0,
        "IsSemiDepon":0,
        "HasNoPassive":0,
        "IsIrregular":0 }
];

module.exports = VerbList;

},{}],3:[function(require,module,exports){
'use strict';

var verbGrammar = {};

var MoodList =
    ["indicative",
        "subjunctive",
        "infinitive",
        "imperative"];

var VoiceList =
    ["active",
        "passive"];

var TenseList =
    ["present",
        "imperfect",
        "future",
        "perfect",
        "pluperfect",
        "future perfect"];

var PersonList =
    ["1st person singular",
        "2nd person singular",
        "3rd person singular",
        "1st person plural",
        "2nd person plural",
        "3rd person plural"];

var Conjugations = [
    {
        "Mood":				//1st conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["o", "as", "at", "amus", "atis", "ant"]
                            },
                                {
                                    "Ending": ["abam", "abas", "abat", "abamus", "abatis", "abant"]
                                },
                                {
                                    "Ending": ["abo", "abis", "abit", "abimus", "abitis", "abunt"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["or", "aris", "atur", "amur", "amini", "antur"]
                                },
                                    {
                                        "Ending": ["abar", "abaris", "abatur", "abamur", "abamini", "abantur"]
                                    },
                                    {
                                        "Ending": ["abor", "aberis", "abitur", "abimur", "abimini", "abuntur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["em", "es", "et", "emus", "etis", "ent"]
                                },
                                    {
                                        "Ending": ["arem", "ares", "aret", "aremus", "aretis", "arent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["er", "eris", "etur", "emur", "emini", "entur"]
                                    },
                                        {
                                            "Ending": ["arer", "areris", "aretur", "aremur", "aremini", "arentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    },
    {
        "Mood":				//2nd conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["eo", "es", "et", "emus", "etis", "ent"]
                            },
                                {
                                    "Ending": ["ebam", "ebas", "ebat", "ebamus", "ebatis", "ebant"]
                                },
                                {
                                    "Ending": ["ebo", "ebis", "ebit", "ebimus", "ebitis", "ebunt"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["eor", "eris", "etur", "emur", "emini", "entur"]
                                },
                                    {
                                        "Ending": ["ebar", "ebaris", "ebatur", "ebamur", "ebamini", "ebantur"]
                                    },
                                    {
                                        "Ending": ["ebor", "eberis", "ebitur", "ebimur", "ebimini", "ebuntur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["eam", "eas", "eat", "eamus", "eatis", "eant"]
                                },
                                    {
                                        "Ending": ["erem", "eres", "eret", "eremus", "eretis", "erent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                    },
                                        {
                                            "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    },
    {
        "Mood":				//3rd conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["o", "is", "it", "imus", "itis", "unt"]
                            },
                                {
                                    "Ending": ["ebam", "ebas", "ebat", "ebamus", "ebatis", "ebant"]
                                },
                                {
                                    "Ending": ["am", "es", "et", "emus", "etis", "ent"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["or", "eris", "itur", "imur", "imini", "untur"]
                                },
                                    {
                                        "Ending": ["ebar", "ebaris", "ebatur", "ebamur", "ebamini", "ebantur"]
                                    },
                                    {
                                        "Ending": ["ar", "eris", "etur", "emur", "emini", "entur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["am", "as", "at", "amus", "atis", "ant"]
                                },
                                    {
                                        "Ending": ["erem", "eres", "eret", "eremus", "eretis", "erent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["ar", "aris", "atur", "amur", "amini", "antur"]
                                    },
                                        {
                                            "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    },
    {
        "Mood":				//3rd io conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["io", "is", "it", "imus", "itis", "iunt"]
                            },
                                {
                                    "Ending": ["iebam", "iebas", "iebat", "iebamus", "iebatis", "iebant"]
                                },
                                {
                                    "Ending": ["iam", "ies", "iet", "iemus", "ietis", "ient"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["ior", "ieris", "ietur", "iemur", "iemini", "iuntur"]
                                },
                                    {
                                        "Ending": ["iebar", "iebaris", "iebatur", "iebamur", "iebamini", "iebantur"]
                                    },
                                    {
                                        "Ending": ["iar", "ieris", "ietur", "iemur", "iemini", "ientur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["iam", "ias", "iat", "iamus", "iatis", "iant"]
                                },
                                    {
                                        "Ending": ["erem", "eres", "eret", "eremus", "eretis", "erent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["iar", "iaris", "iatur", "iamur", "iamini", "iantur"]
                                    },
                                        {
                                            "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    },
    {
        "Mood":				//4th conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["io", "is", "it", "imus", "itis", "iunt"]
                            },
                                {
                                    "Ending": ["iebam", "iebas", "iebat", "iebamus", "iebatis", "iebant"]
                                },
                                {
                                    "Ending": ["iam", "ies", "iet", "iemus", "ietis", "ient"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["ior", "ieris", "ietur", "iemur", "iemini", "iuntur"]
                                },
                                    {
                                        "Ending": ["iebar", "iebaris", "iebatur", "iebamur", "iebamini", "iebantur"]
                                    },
                                    {
                                        "Ending": ["iar", "ieris", "ietur", "iemur", "iemini", "ientur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["iam", "ias", "iat", "iamus", "iatis", "iant"]
                                },
                                    {
                                        "Ending": ["erem", "eres", "eret", "eremus", "eretis", "erent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["iar", "iaris", "iatur", "iamur", "iamini", "iantur"]
                                    },
                                        {
                                            "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    }
];

var PerfectEndings = {
    "Mood": [
        {
            "Tense":		//indicative
                [{
                    "Ending": ["i", "isti", "it", "imus", "istis", "erunt"]
                },
                    {
                        "Ending": ["eram", "eras", "erat", "eramus", "eratis", "erant"]
                    },
                    {
                        "Ending": ["ero", "eris", "erit", "erimus", "eritis", "erint"]
                    }
                ]
        },
        {
            "Tense":		//subjunctive
                [{
                    "Ending": ["erim", "eris", "erit", "erimus", "eritis", "erint"]
                },
                    {
                        "Ending": ["issem", "isses", "isset", "issemus", "issetis", "issent"]
                    }
                ]
        }
    ]
};

var InfinitiveEndings = {
    "Voice": [
        {
            "Conjugation":			//active
                ["are", "ere", "ere", "ere", "ire"]
        },
        {
            "Conjugation":			//passive
                ["ari", "ere", "i", "i", "iri"]
        }
    ]
};

var Esse = {
    "Mood": [
        {
            "Tense":		//indicative
                [{
                    "Ending": ["sum", "es", "est", "sumus", "estis", "sunt"]
                },
                    {
                        "Ending": ["eram", "eras", "erat", "eramus", "eratis", "erant"]
                    },
                    {
                        "Ending": ["ero", "eris", "erit", "erimus", "eritis", "erunt"]
                    }
                ]
        },
        {
            "Tense":		//subjunctive
                [{
                    "Ending": ["sim", "sis", "sit", "simus", "sitis", "sint"]
                },
                    {
                        "Ending": ["essem", "esses", "esset", "essemus", "essetis", "essent"]
                    }
                ]
        }
    ]
};

var EnglPronouns = {
    "Case": [
        {
            "Person":				//nominative
                ["I", "you", "he/she/it", "we", "you all", "they"]
        },
        {
            "Person":				//oblique
                ["me", "you", "him/her/it", "us", "you all", "them"]
        },
        {
            "Person":				//possessive adjective
                ["my", "your", "his/her/its", "our", "your", "their"]
        },
        {
            "Person":				//possessive pronoun
                ["mine", "yours", "his/hers/its", "ours", "yours", "theirs"]
        }
    ]
};

var EnglToBe = {
    "Mood": [
        {
            "Tense":				//indicative
                [{"Person": ["am", "are", "is", "are", "are", "are"]},		//present
                    {"Person": ["was", "were", "was", "were", "were", "were"]}	//past
                ]
        },
        {
            "Tense":				//subjunctive
                [{"Person": ["were", "were", "were", "were", "were", "were"]},
                    {"Person": ["had been", "had been", "had been", "had been", "had been", "had been"]},
                ]
        },
        {
            "Tense":				//infinitive
                [{"Form": "to be"},
                    {"Form": "to have been"}
                ]
        }
    ],
    "PresPart": "being",
    "PastPart": "been"
};

var EnglToHave = {
    "Pres": "have",
    "PresConj": "has",
    "PresPart": "having",
    "Past": "had",
    "PastPart": "had"
};

//public methods:
verbGrammar.tenseToAspect = tenseToAspect;
verbGrammar.aspectToTense = aspectToTense;
verbGrammar.getVerbForm = getVerbForm;
verbGrammar.validateVoid = validateVoice;
verbGrammar.Verb = Verb;

function tenseToAspect(tense) {
    var aspect;
    if (tense>=0&&tense<3)
        aspect=0;
    else if (tense>=3&&tense<6)
    {
        aspect=1;
        tense-=3;
    }

    return ({"tense":tense, "aspect":aspect});
}

function aspectToTense(aspect, tense) {
    if (aspect==0)
        return tense;
    else if (aspect==1)
        return tense+3;
    else
    {
        console.log("Invalid aspect (" + aspect + ") in aspectToTense()");
        return null;
    }
}

//forms a verb based on a lexical entry (passed as element, not index #) and proper aspect, mood, tense, voice, and person
function getVerbForm(newVerb) {
    var pppEnd;

    if (newVerb.mood == 0 || newVerb.mood == 1) {
        if (newVerb.aspect == 0)		//incomplete
        {
            return (newVerb.lexis.PresStem + Conjugations[newVerb.lexis.Conjugation].Mood[newVerb.mood].Voice[newVerb.voice].Tense[newVerb.tense].Ending[newVerb.person]);

        }
        else {
            if (newVerb.voice == 0)		//active
            {
                return (newVerb.lexis.PerfStem + PerfectEndings.Mood[newVerb.mood].Tense[newVerb.tense].Ending[newVerb.person]);
            }
            else {
                pppEnd = (newVerb.person < 3) ? "us" : "i";
                return (newVerb.lexis.PerfPassPart + pppEnd + " " + Esse.Mood[newVerb.mood].Tense[newVerb.tense].Ending[newVerb.person]);
            }
        }
    }

    else if (newVerb.mood == 2) {           //infinitive
        if (newVerb.voice == 0) {
            switch (newVerb.tense) {
                case 0:
                    return (newVerb.lexis.PresStem + InfinitiveEndings.Voice[0].Conjugation[newVerb.lexis.Conjugation]);
                    break;
                case 1:
                    return (newVerb.lexis.PerfStem + "isse");
                    break;
                default:				//only present and past active infins for now
                    console.log("Currently invalid tense!");
                    return null;
            }
        }
        else if (newVerb.voice == 1) {
            switch (newVerb.tense) {
                case 0:
                    return (newVerb.lexis.PresStem + InfinitiveEndings.Voice[1].Conjugation[newVerb.lexis.Conjugation]);
                    break;
                default:				//only present passive infins for now
                    console.log("Currently invalid tense!");
                    return null;
            }
        }
        else {
            console.log("Invalid voice (" + newVerb.voice + ") in getVerbForm()");
            return null;
        }
    }

    else {
        console.log("Currently invalid mood (" + newVerb.mood + ") in getVerbForm()");
        return null;
    }

}

function validateVoice(newVerb) {
    var wasChanged = 0;
    if (newVerb.lexis.IsDepon == true && newVerb.voice == 0) {
        newVerb.voice = 1;
        wasChanged = 1;
    }
    else if (newVerb.lexis.IsSemiDepon == true && newVerb.aspect == 1 && newVerb.voice == 0) {
        newVerb.voice = 1;
        wasChanged = 1;
    }
    else if (newVerb.lexis.HasNoPassive == true && newVerb.voice == 1) {
        newVerb.voice = 0;
        wasChanged = 1;
    }

    return wasChanged;
}

/////////////////////////////
//constructor for Verb object - must generate random properties ahead of time
/////////////////////////////
function Verb() {
    for (var n in arguments[0]) {
        this[n] = arguments[0][n];
    }

    if (this.lexis == undefined)
//        this.lexis = getRandomVerbLexis();
        this.lexis = VerbList[0];
    if (this.mood == undefined)
//        this.mood = getRandomMood();
        this.mood = 0;
    if (this.aspect == undefined)
//        this.aspect = getRandomAspect();
        this.aspect = 0;
    if (this.person == undefined)
//        this.person = getRandomPerson(this.mood);
        this.person = 0;

    if (this.tense == undefined)
//        this.tense = getRandomTense(this.mood);
        this.person = 0;
    if (this.voice == undefined)
//        this.voice = getRandomVoice(this.lexis, this.aspect);
        this.voice = 0;
    validateVoice(this);

    this.form = getVerbForm(this);			//even if "Verb.form" is given among arguments, this should be run
}

Verb.prototype.getForm = function () {
    return this.form;
};

//gives the english translation of the current Verb
//(using present continuous, standard imperfect, standard future - "I will carry", and simple past)
Verb.prototype.getTranslation = function () {
    //lazyload prevention of running all this crap again
    if (this.englTrans == undefined) {

        var pronoun;
        if (this.mood == 0 || this.mood == 1)		//indicative AND subjunctive -
        {						//for now we will translate the latter as if in a subordinate clause
            pronoun = EnglPronouns.Case[0].Person[this.person];
        }
        else {
            console.log("Currently invalid mood!");
        }

        //to avoid a triple conditional
        var tense = aspectToTense(this.aspect, this.tense);

        var verbPhrase;
        if (this.voice == 0)			//active
        {
            switch (tense) {
                case 0:
                    verbPhrase = EnglToBe.Mood[0].Tense[0].Person[this.person] + " " + this.lexis.EnglPresPart;
                    break;
                case 1:
                    verbPhrase = EnglToBe.Mood[0].Tense[1].Person[this.person] + " " + this.lexis.EnglPresPart;
                    break;
                case 2:
                    verbPhrase = "will " + this.lexis.EnglPres;
                    break;
                case 3:
                    verbPhrase = this.lexis.EnglPast;
                    break;
                case 4:
                    verbPhrase = "had " + this.lexis.EnglPastPart;
                    break;
                case 5:
                    verbPhrase = "will have " + this.lexis.EnglPastPart;
                    break;
                default:
                    console.log("Invalid tense!");
            }
        }
        else if (this.voice == 1)			//passive
        {
            switch (tense) {
                case 0:
                    verbPhrase = EnglToBe.Mood[0].Tense[0].Person[this.person] + " being " + this.lexis.EnglPastPart;
                    break;
                case 1:
                    verbPhrase = EnglToBe.Mood[0].Tense[1].Person[this.person] + " being " + this.lexis.EnglPastPart;
                    break;
                case 2:
                    verbPhrase = "will be " + this.lexis.EnglPastPart;
                    break;
                case 3:
                    verbPhrase = EnglToBe.Mood[0].Tense[1].Person[this.person] + " " + this.lexis.EnglPastPart;
                    break;
                case 4:
                    verbPhrase = "had been " + this.lexis.EnglPastPart;
                    break;
                case 5:
                    verbPhrase = "will have been " + this.lexis.EnglPastPart;
                    break;
                default:
                    console.log("Invalid tense!");
            }
        }

        this.englTrans = (pronoun + " " + verbPhrase);
    }

    return this.englTrans;
};

function getParsePersonString(person, number)
{
    if (number != undefined && person < 3)
        person = number?person+3:person;

    return PersonList[person];
}

function getParseTenseString(tense, aspect)
{
    if (aspect != undefined && tense < 3)
        tense = aspectToTense(aspect, tense);

    if (tense >= 0 && tense < 6)
        return TenseList[tense];
    else
        return "invalid tense (" + tense + ")";
}

function getParseVoiceString(voice)
{
    if (voice>=0 && voice < 2)
        return VoiceList[voice];
    else
        return "invalid voice (" + voice + ")";
}

function getParseMoodString(mood)
{
    if (mood >= 0 && mood < 4)
        return MoodList[mood];
    else
        return "invalid mood (" + mood + ")";
}

Verb.prototype.getParseInfo = function() {
    if (this.parseInfo == undefined)
    {

        var voice = getParseVoiceString(this.voice);

        var mood = getParseMoodString(this.mood);

        var person, tense;

        if (this.mood == 0 || this.mood == 1)
        {
            person = getParsePersonString(this.person);

            tense = getParseTenseString(this.tense, this.aspect);

            this.parseInfo = (person + " " + tense + " " + voice + " " + mood);
        }
        else if (this.mood == 2)		//infinitive
        {
            switch (this.tense)
            {
                case 0:
                    tense = "present";
                    break;
                case 1:
                    tense = "perfect";
                    break;
                case 2:
                    tense = "future";
                    break;
                default:
                    tense = "invalid tense";
            }

            this.parseInfo = (tense + " " + voice + " " + mood);
        }
        else
        {
            return ("Currently invalid mood (" + Verb.mood + ") for getParseInfo()");
        }

    }
    return this.parseInfo;
};

///////////////////
//end Verb class
///////////////////
module.exports = verbGrammar;

},{}]},{},[1]);
