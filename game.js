var gameport = document.getElementById("gameport");

// Create the renderer
var renderer = PIXI.autoDetectRenderer(1000, 1000);
renderer.backgroundColor = 0xFF4500
gameport.appendChild(renderer.view);

// Create the stage for the game
var stage = new PIXI.Container();

// Create list for tiles
var tiles = [];

// Preload in assests and sounds
// Load sprite sheet
PIXI.loader
    .add("assests.json")
    .load(ready);

// Tile Moving Sound
PIXI.sound.Sound.from({
    url: "clickSound.mp3",
    preload: true,
    volume: 0.01,
});

// Background music
PIXI.sound.Sound.from({
    url: "backgroundmusic.wav",
    preload: true,
    autoPlay: true,
    loop: true,
    volume: 0.03,
});

PIXI.sound.add('mover', "clickSound.mp3");

// Animate the screen
animate(stage);

// Functions

// Makes the gamestiles
function tileMaker(tileName, x, y) {
    // Reference sprite from sheet
    var tile = new PIXI.Sprite(PIXI.Texture.fromFrame(tileName));

    // Setup tile features
    tile.interactive = true;
    tile.buttonMode = true;
    tile.anchor.set(0.5);
    tile.scale.set(4);
    tile
        .on('mousedown', clickHold)
        .on('touchstart', clickHold)
        .on('mouseupoutside', clickStop)
        .on('mouseup', clickStop)
        .on('touchendoutside', clickStop)
        .on('touchend', clickStop)
        .on('mousemove', clickMove)
        .on('touchmove', clickMove);
    tile.position.x = x;
    tile.position.y = y;

    tiles.push(tile);

    // Add tile to the stage
    stage.addChild(tile);
}

// Renders the animation of the screen
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);

    for (var j in tiles) {
        var otherTile = tiles[j];
        if (otherTile.visible == false) continue;
        if ((bubble != other_bubble) && squareIntersection(tile, otherTile)) {
            otherTile.visible = false;
        }
    }

    // Change tile position
    tile.position.x += tile.vx
    tile.position.y += tile.vy
}

// Allows the tiels to be dragged when clicked
function clickHold(event) {
    this.data = event.data;
    this.dragging = true;
    PIXI.sound.play('mover');
}

// Makes the tiles no longer draggable after click
function clickStop(){
    this.dragging = false;
    this.data = null;
}

// Redraws the object as it is being dragged
function clickMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

// Loads in the tiles
function ready() {
    tileMaker("Sprite-1Tile.png", Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));
    tileMaker("Sprite-2Tile.png", Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));
    tileMaker("Sprite-3Tile.png", Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));
}

// Vector normalization for the past vy and vx properties
function normalize(obj) {
    var len = Math.sqrt((obj.vx * obj.vx) + obj.vy * obj.vy);
    obj.vx /= len;
    obj.vy /= len;
}

// Finds the intersection of 2 squares
function squareIntersection(s1, s2) {
    var s1x = s1.position.x + s1.radius;
    var s1y = s1.position.y + s1.radius;
    var s2x = s2.position.x + s2.radius;
    var s2y = s2.position.y + s2.radius;

    var sdx = s2x - s1x;
    var sdy = s2y = s1y;
    var d = s1.radius + s2.radius;
    var nd = (sdx * sdx) + (sdy * sdy);

    if (nd < d * d) {
        return true;
    }
    return false;
}

// Resets the game
function reset() {
    for (var i = 0; i < tiles.length; i++) {
        tile.visible = true;
        tile.position.x = Math.floor(Math.random() * 500), Math.floor(Math.random() * 500);
        tile.position.y = Math.floor(Math.random() * 500), Math.floor(Math.random() * 500);

        tile.radius = 500;
        tile.vx = Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)
        tile.vy = Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)
        normalize(tile);
    }
}