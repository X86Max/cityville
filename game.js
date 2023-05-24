var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var cursors;
var map;
var mapScale = 1;
var mapBounds = {
    x: 0,
    y: 0,
    width: 2300,
    height: 1600
};
var lastPointerPosition;
var isDragging = false;
var zoomInButton;
var zoomOutButton;

function preload() {
    this.load.image('map', 'background.png');
    this.load.image('zoomIn', 'plusbutton.png');
    this.load.image('zoomOut', 'minusbutton.png');
}

function create() {
    map = this.add.image(0, 0, 'map');
    map.setOrigin(0, 0);
    map.setScale(mapScale);

    cursors = this.input.keyboard.createCursorKeys();
    this.input.mouse.disableContextMenu();

    this.input.on('pointerdown', function (pointer) {
        lastPointerPosition = { x: pointer.x, y: pointer.y };
        isDragging = true;
    }, this);

    this.input.on('pointermove', function (pointer) {
        if (isDragging && lastPointerPosition) {
            var deltaX = pointer.x - lastPointerPosition.x;
            var deltaY = pointer.y - lastPointerPosition.y;
            map.x += deltaX;
            map.y += deltaY;
            lastPointerPosition = { x: pointer.x, y: pointer.y };
            limitMapBounds();
        }
    }, this);

    this.input.on('pointerup', function () {
        lastPointerPosition = null;
        isDragging = false;
    }, this);

    this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
        var zoomAmount = deltaZ * 0.001;
        mapScale += zoomAmount;
        mapScale = Phaser.Math.Clamp(mapScale, 0.5, 2); // Define os limites do zoom
        map.setScale(mapScale);
        limitMapBounds();
    }, this);

    limitMapBounds();

    // Cria o botão de zoom in
    zoomInButton = this.add.image(config.width - 40, 40, 'zoomIn')
        .setInteractive()
        .setScrollFactor(0)
        .setScale(0.8)
        .setDepth(1);
    zoomInButton.on('pointerdown', function () {
        zoomMap(0.1);
    }, this);

    // Cria o botão de zoom out
    zoomOutButton = this.add.image(config.width - 40, 90, 'zoomOut')
        .setInteractive()
        .setScrollFactor(0)
        .setScale(0.8)
        .setDepth(1);
    zoomOutButton.on('pointerdown', function () {
        zoomMap(-0.1);
    }, this);
}

function update() {
    if (cursors.left.isDown && map.x < mapBounds.x) {
        map.x += 5;
        limitMapBounds();
    }
    else if (cursors.right.isDown && map.x > mapBounds.x - map.width) {
        map.x -= 5;
        limitMapBounds();
    }

    if (cursors.up.isDown && map.y < mapBounds.y) {
        map.y += 5;
        limitMapBounds();
    }
    else if (cursors.down.isDown && map.y > mapBounds.y - map.height) {
        map.y -= 5;
        limitMapBounds();
    }
}

function limitMapBounds() {
    var maxMapX = mapBounds.x;
    var maxMapY = mapBounds.y;
    var minMapX = mapBounds.x - (map.width * mapScale - config.width);
    var minMapY = mapBounds.y - (map.height * mapScale - config.height);

    map.x = Phaser.Math.Clamp(map.x, minMapX, maxMapX);
    map.y = Phaser.Math.Clamp(map.y, minMapY, maxMapY);
}

function zoomMap(zoomAmount) {
    mapScale += zoomAmount;
    mapScale = Phaser.Math.Clamp(mapScale, 0.5, 2);
    map.setScale(mapScale);
    limitMapBounds();
}
