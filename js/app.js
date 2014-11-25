// Enemies our player must avoid
//random speed and starting point with select()
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = select([-140, -120, -220, -200]);
    this.y = select([60,144,228,312]);
    this.speed = select([13,25,44,55,36,42]);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //!I added gemspeed. Increases by picking orange gems
    this.x = this.x + (this.speed * dt + gemSpeed);
    if (this.x >= 800){remove(this,allEnemies);createEnemies();}    
};

var gameon = true; //var for pause and continue
var gemSpeed = 1;

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//When a bug resets either by player loss or by reaching end of canvas
//is destroyed and recreated at random starting point
Enemy.prototype.reset = function() {
    allEnemies.forEach(function(enemy){remove(enemy,allEnemies);});
    createEnemies();
};

//Destroying from gameplay picked up Gems and Enemies
var remove = function (entity, array) {
    var index = array.indexOf(entity);
            if (index !== -1) {
            array.splice(index, 1);
            };
};

var Gem = function() {
    this.x = select([-150, -180, -200]);
    this.y = select([60,144,228,312]);
    startx = -150;
    this.speed = select([10,20,30,40,12,55,23,38,15]);
    this.sprite = select(['images/Gem Blue.png','images/Gem Orange.png','images/Gem Green.png']);
};

var select = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};

//Gems return to start x position. Not destroyed until picked up!
Gem.prototype.reset = function() {
    this.x = startx;
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.update = function(dt) {
    this.x = this.x + (this.speed * dt * gemSpeed);
        if (this.x >= 800){this.x = startx;}
};

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 700; //fixed x axis posotion
    this.y = 60;  //fixed y axis position
    this.lives = 3;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if(gameon){ /**disables key response if game paused*/
        switch(key) {
            case 'left':/**If statement sets boundaries to left movement*/
               if(!(this.x<20)){
                this.x = this.x-101;
                };
            break;
        case 'right':/**Same as above*/
                if(!(this.x>690)){
                this.x = this.x+101;
                };
            break;
        case 'up':
                this.y = this.y-84;
            break;
        case 'down':
                this.y = this.y+84;
            break;
        case 'pause':
                gameon = false;
                swal({
                title: "Game Paused",
                text: "Press Enter to Resume",
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Resume!",
                closeOnConfirm: true
                },function() {
                gameon = true;});
            break;
            ;}
        };
};

Player.prototype.reset = function() {
    this.x = 700;
    this.y = 60;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Place Gems in gems array
// bluegems and greengems are for score and lives respectively
var allEnemies =[];
var createEnemies = function() {
    while(allEnemies.length<3){allEnemies.push(new Enemy());};
};

var gems =[];
var createGems = function() {
    while(gems.length<2){gems.push(new Gem());};
};
var player = new Player();
var blueGems = 0;
var greenGems = 0;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'pause' /*added p for pause button*/
    };
    player.handleInput(allowedKeys[e.keyCode]);
});