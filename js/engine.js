var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        patterns = {},
        lastTime;

    canvas.width = 807;
    canvas.height = 800;
    doc.body.appendChild(canvas);

    
    function main() {         
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;       
        if(gameon){             
           update(dt);
        };
        render();        
        lastTime = now;
        win.requestAnimationFrame(main);        
    };
    
    
    function start(){        
       gameon=false;
       $('#dialog').dialog();
       $('html').click(function() {
        gameon=true;
       });
    };
           
    
    function init() {       
        lastTime = Date.now();
        start();        
        main();     
        createEnemies();        
    }

    function update(dt) {        
       updateEntities(dt);
       checkCollisions(dt);
       drown();      
    };    
    
    function drown(){
        y=player.y;
        if(y<60 | y>312){
            new Audio("bubbling1.wav").play();
            alert('You cannot swim! Ok?');
            reset()};    
    };
    
    function checkCollisions(){
        var y=player.y;
        var x=player.x;        
        allEnemies.forEach(function(enemy) {
           if(enemy.y==y){ 
             if(enemy.x+50>x & x+50>enemy.x){                             
               reset();
            };            
           ;}       
        });        
    };
    
    function pickgems(){
      greengems.forEach(function(gem) {
            if(gem.x==player.x&&gem.y==player.y){
              gemspeed*=2;  
            };            
        });
    };

    function updateEntities(dt) {       
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });   
               
    };

    function render() {
        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/grass-block.png',                
                'images/grass-block.png',                
                'images/stone-block.png',
                'images/water-block.png'
            ],
            numRows = 6,
            numCols = 8,
            row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {                 
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            };
        };
        renderEntities();
    };

    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();            
        });        
        player.render(); 
        renderlives();
        renderdiamonds();
        
    };
        
    function renderlives(){       
        ctx.rect(10, 600, 150, 40);
        ctx.fillStyle=('#81ccee');
        ctx.fill();
        var x=10;
        var li=player.lives;        
        for(i=0;i<li;i++){           
            ctx.drawImage(Resources.get('images/rsheart.png'),x,600);
            x+=40;
        };      
    };
    
    function renderdiamonds(){
        ctx.drawImage(Resources.get('images/rsz_gem_blue.png'),15,2);        
        ctx.fillStyle=('black');
        ctx.font=('20px Verdana');        
        ctx.fillText(':'+bluegems,60,40);
    };

    function reset() {        
         allEnemies.forEach(function(enemy) {
            enemy.reset();
        });       
        player.reset();
        player.lives-=1;
        if(!player.lives){gameover();};
        renderlives();
    };
    
    function gameover(){  
        new Audio("buzzer_x.wav").play();
        ctx.fillStyle=('black');
        ctx.font=('80px Verdana');        
        ctx.fillText('GAME OVER...',200,500);
        canvas.freeze();        
    };
    
    
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/rsheart.png',
        'images/Star.png',
        'images/rsz_gem_blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
