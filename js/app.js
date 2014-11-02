// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x ;
    this.y = y ;
    startx=-150;    
    this.speed=speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.   
        this.x = this.x + (1 * this.speed * dt * gemspeed);
        if (this.x >= 800) {this.x=startx;}    
};

var gameon=true;//var for pause and continue
var gemspeed=1;
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset=function(){
   this.x=startx;   
};

var Gem=function(x,y,speed){
  this.x=x;
  this.y=y;
  startx=-150;
  this.speed=speed;
  this.sprite=['images/Gem Blue.png','images/Gem Green.png','images/Gem Orange.png'];
};

var select=function(array){    
    return array[Math.floor(Math.random() * array.length)];
};


Gem.prototype.reset=function(){
  this.x=startx;
};

Gem.prototype.render=function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.update=function(){
    this.x = this.x + (1 * this.speed * dt * gemspeed);
        if (this.x >= 800) {this.x=startx;} 
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player=function(){
    this.sprite='images/char-boy.png';    
    this.x=700;
    this.y=60;
    this.lives=3;
};

Player.prototype.render=function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput=function(key){      
     if(gameon){ 
        switch(key){           
            case 'left':/*If statement sets boundaries to left movement*/
               if(!(this.x<20)){               
                this.x=this.x-101;
                };
            break;
        case 'right':/*Same as above*/
                if(!(this.x>690)){                
                this.x=this.x+101;
                };
            break;
        case 'up':
                this.y=this.y-84;               
            break;
        case 'down':
                this.y=this.y+84;                
            break;        
    case 'pause':
                gameon=false;
                alert("Game paused! to continue press OK!");
                gameon=true;
            break;
            ;}
        };
};
       
Player.prototype.reset = function() {
    this.x=700;
    this.y=60;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player




var allEnemies=[];
var createEnemies=function(){
    allEnemies.push(new Enemy(-150,60,23));
    allEnemies.push(new Enemy(-150,228,42));
    allEnemies.push(new Enemy(-150,144,37));
    allEnemies.push(new Enemy(-150,60,50));
    allEnemies.push(new Enemy(-150,312,88));
};

var gems=[];
var player=new Player();
var bluegems=0;



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'pause', /*added p for pause button*/        
    };
    player.handleInput(allowedKeys[e.keyCode]);
});