var GamePlay = new Kiwi.State('Gameplay');
var tileWidth = 48
var mapWidth = 16
var tileMapData = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 2, 2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0, 1,
    1, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 1,
    1, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 0, 2, 0, 1,
    1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 1,
    1, 0, 2, 0, 2, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1,
    1, 0, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 2, 0, 1,
    1, 0, 2, 2, 0, 2, 2, 2, 0, 0, 0, 2, 0, 2, 0, 1,
    1, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 1,
    1, 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 0, 1,
    1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 1,
    1, 0, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, 0, 2, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];
var stall = false;
var startingTimeLength = 30;
var startingTimeBonus = 5;
var minimumTimeBonus = 2;
var cherriesPerStage = 3;

GamePlay.preload = function() {
    this.addSpriteSheet('tiles', 'game/assets/img/tileset.png', tileWidth, tileWidth);
}

GamePlay.randomInt = function(max) {
    return Math.floor(Math.random() * max);
}

GamePlay.create = function() {
    this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this);
    this.tilemap.setTo(tileWidth, tileWidth, mapWidth, mapWidth);
    this.tilemap.createTileType(0);
    this.tilemap.createTileTypesByRange(1, 20);

    this.timeText = new Kiwi.GameObjects.Textfield(this, "Time Left", 800, 0, "#000", 32, 'normal', 'Impact');
    this.addChild(this.timeText);

    this.countdownTimer = new Kiwi.HUD.Widget.Time(this.game, '', 840, 35);
    this.countdownTimer.time.countDown = true;
    this.countdownTimer.time.addTime(startingTimeLength);
    this.game.huds.defaultHUD.addWidget(this.countdownTimer);
    this.countdownTimer.style.color = 'black';
    this.countdownTimer.start();
    this.timerStopped = false;

    this.scoreText = new Kiwi.GameObjects.Textfield(this, "Score", 820, 70, "#00aeae", 32, 'normal', 'Impact');
    this.addChild(this.scoreText);

    this.score = new Kiwi.HUD.Widget.BasicScore(this.game, 852, 105, 0);
    this.game.huds.defaultHUD.addWidget(this.score);


    //Create a new GamePlayLayer
    this.tilemap.createNewLayer('Ground', this.textures.tiles, tileMapData);

    //Add the Layer to the State to be Rendered.
    this.addChild(this.tilemap.layers[0]);

    this.left = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
    this.right = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
    this.up = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
    this.down = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
    this.a = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
    this.d = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
    this.w = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
    this.s = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);

    this.player = 0
    this.numCherries = cherriesPerStage;

    this.loadPlayer();
    this.loadCherries();
    this.loadTimeBonus();
}

GamePlay.loadPlayer = function() {
    while (tileMapData[this.player] != 0) {
        newIndex = this.randomInt(mapWidth * mapWidth);
        if (tileMapData[newIndex] == 0) {
            this.player = newIndex
        }
    }
    tileMapData[this.player] = 17
}

GamePlay.loadCherries = function() {
    this.numCherries = cherriesPerStage
    i = 0
    for (_ = 0; _ < cherriesPerStage; _++) {
        while (tileMapData[i] != 0) {
            newIndex = this.randomInt(mapWidth * mapWidth);
            if (tileMapData[newIndex] == 0) {
                i = newIndex
            }
        }
        tileMapData[i] = 3
    }
}

GamePlay.loadTimeBonus = function() {
    i = 0
    while (tileMapData[i] != 0) {
        newIndex = this.randomInt(mapWidth * mapWidth);
        if (tileMapData[newIndex] == 0) {
            i = newIndex
        }
    }
    tileMapData[i] = 9
}

GamePlay.oneDtotwoD = function(index) {
    return [index % mapWidth, Math.floor(index / mapWidth)]
}

GamePlay.twoDtooneD = function(xIndex, yIndex) {
    return xIndex + mapWidth * yIndex;
}

GamePlay.update = function() {
    if (!this.timerStopped) {
        if (this.countdownTimer.time.currentTime < 0) {
            this.countdownTimer.stop();
            this.timerStopped = true;
            this.countdownTimer.text = "0.00"
        }
    }
    if (!stall) {
        this.processKeyboardInput();
    }
}

GamePlay.processKeyboardInput = function() {
    oldPlayer = this.player;

    // act at key-down. because of the animation check this doesn't trigger multiple moves
    if (this.left.isDown || this.a.isDown) {
        this.player = this.moveTo(this.player, {
            x: -1,
            y: 0
        }, "l");
    } else if (this.right.isDown || this.d.isDown) {
        this.player = this.moveTo(this.player, {
            x: 1,
            y: 0
        }, "r");
    } else if (this.up.isDown || this.w.isDown) {
        this.player = this.moveTo(this.player, {
            x: 0,
            y: -1
        }, "u");
    } else if (this.down.isDown || this.s.isDown) {
        this.player = this.moveTo(this.player, {
            x: 0,
            y: 1
        }, "d");
    }
    stall = true;

    setTimeout(function() {
        stall = false
    }, 80)

    return !(this.player == oldPlayer);
}

GamePlay.moveTo = function(index, move, dir) {
    targetIndex = this.twoDtooneD(this.oneDtotwoD(index)[0] + move.x, this.oneDtotwoD(index)[1] + move.y)
    if (tileMapData[targetIndex] == 9) {
        this.countdownTimer.time.addTime(startingTimeBonus);
        this.loadTimeBonus();
        if (startingTimeBonus > minimumTimeBonus) {
            startingTimeBonus -= 1;
        }
    } else if (tileMapData[targetIndex] == 3) {
        this.score.counter.current += 10;
        this.numCherries -= 1
    }

    if (this.numCherries == 0) {
        this.loadCherries();
    }

    if (tileMapData[targetIndex] == 1 || tileMapData[targetIndex] == 2) {
        return index;
    } else {
        if (dir == "l") {
            tileMapData[targetIndex] = 17;
        } else if (dir == "r") {
            tileMapData[targetIndex] = 19;
        } else if (dir == "u") {
            tileMapData[targetIndex] = 18;
        } else if (dir == "d") {
            tileMapData[targetIndex] = 20;
        }
        tileMapData[index] = 0;
        return targetIndex
    }
}
