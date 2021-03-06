/**
 *
 * @Function
 */
var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        patterns = {},
        lastTime;

    canvas.width = 807;
    canvas.height = 700;
    doc.body.appendChild(canvas);

    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        //With gameon var I am pausing the game
        if(gameon){
            update(dt);
        };
        render();
        lastTime = now;
        win.requestAnimationFrame(main);
    };

    /**
     * Start  messages with instructions
     * @function
     */
    function start() {
        gameon = false;
        swal({
            title: "Welcome",
            text: "This is my version of Frogger. Press ENTER to Continue!",
            type: "info",
            showCancelButton: false,
            confirmButtonText: "Next!",
            closeOnConfirm: false},
            function() {
                swal({title:"Objectives",
                        text:"Collect as many Blue gems as you can.  \n\
                              Collect 4 Green and Earn an Extra Life.\n\
                              Orange gems are special! ",
                        confirmButtonText: "Next!",
                        closeOnConfirm: false},
                        function() {
                            swal({title:"Instructions",
                                text:"Use Arrow Keys for Movement. \n\
                                      Key P for Pausing.\n\
                                      Press Enter to Start the Game.",
                                confirmButtonText: "Start!"},
                                function() {gameon = true;});
                    });
            });
    };
    /**
     * Initialize the game by creating Entities
     *@function
     */
    function init() {
        lastTime = Date.now();
        start();
        main();
        createEnemies();
        createGems();
    };

    /**
     * In the update I check also for player boundaries on y axis with drown function
     * @function
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        pickGems();
        drown();
    };

    /**
     * Checks when stepping on water
     * @function
     */
    function drown() {
        y = player.y;
        if(y<60 | y>312){
            new Audio("audio/bubbling1.wav").play();
            gameon = false;
            swal({
                title: "You Just Drowned!",
                text: "Press Enter to Resume",
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Resume!",
                closeOnConfirm: true
                },function() {gameon = true;});
                reset();
        };
    };

    /**
     *
     * @function
     */
    function checkCollisions() {
        var y = player.y;
        var x = player.x;
        allEnemies.forEach(function(enemy) {
            if(enemy.y == y){
                if(enemy.x+50>x & x+50>enemy.x) {   //By checking the distance player x coordinate has from right and left we have collision
                    new Audio("audio/punch.mp3").play();
                    gameon = false;
                    swal({
                    title: "A Bug Just Ate You!",
                    text: "Press Enter to Resume",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Resume!",
                    closeOnConfirm: true
                    },function() {gameon = true;});
                    reset();
            };
           };
        });
    };

    /**
     *
     * @function
     */
    function pickGems() {
        gems.forEach(function (gem) {
        if (player.x<gem.x+50 && player.x>gem.x-50 && player.y === gem.y){
            if (gem.sprite == 'images/Gem Blue.png'){blueGems += 1;remove(gem,gems);}
            else if (gem.sprite == 'images/Gem Orange.png'){gemSpeed += 1;remove(gem,gems);}
            else if (gem.sprite == 'images/Gem Green.png'){greenGems += 1;remove(gem,gems);}
           };
        extraLives(); //Right after picking a gem checking if greengems reached 4
        createGems(); // Create missing gems from gameplay
        renderScore();
      });
    };

    /**
     *
     * @param {type} dt
     * @function
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {enemy.update(dt);});
        gems.forEach(function(gem) {gem.update(dt);});
    };

    /**
     * Draw game field
     * @function
     */
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

    /**
     * Place all elements on canvas
     * @function
     */
    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        gems.forEach(function(gem) {
            gem.render();
        });
        player.render();
        renderLives();
        renderScore();
    };

    /**
     * Draw lives
     * @function
     */
    function renderLives() {
        ctx.rect(10, 600, 200, 40);
        ctx.fillStyle = ('#81ccee');
        ctx.fill();
        var x = 10;
        var li = player.lives;
        for(i=0;i<li;i++){
            ctx.drawImage(Resources.get('images/rsheart.png'),x,600);
            x += 40;
        };
    };

    /**
     * For every 4 green gems you earn an extra life
     * @function
     */
    function extraLives() {
        if (greenGems === 4){
            new Audio("audio/Ta Da.mp3").play();
            player.lives += 1;
            renderLives();
            greenGems = 0;
        };
    };

    /**
     * Draws score
     * @function
     */
    function renderScore() {
        ctx.fillStyle = ('#81ccee');
        ctx.fillRect(15,2,180,45);
        ctx.drawImage(Resources.get('images/rsz_gem_blue.png'),15,2);
        ctx.fillStyle = ('black');
        ctx.font = ('20px Verdana');
        ctx.fillText(':'+blueGems,60,40);
        ctx.drawImage(Resources.get('images/rsz_gem_green.png'),110,2);
        ctx.fillText(':'+greenGems,155,40);
    };

    /**
     * Resets game on starting positions
     * @function
     */
    function reset() {
         allEnemies.forEach(function(enemy) {
            enemy.reset();
        });
        player.reset();
        player.lives -= 1;
        if(!player.lives){gameover();};
        renderLives();
    };

    /**
     * Game ends. Canvas freezes and needs restart
     * @function
     */
    function gameover() {
        ctx.rect(10, 600, 150, 40);
        ctx.fillStyle = ('#81ccee');
        ctx.fill();
        new Audio("audio/buzzer_x.wav").play();
        ctx.fillStyle = ('black');
        ctx.font = ('80px Verdana');
        ctx.fillText('GAME OVER...',150,400);
        canvas.freeze();
    };

    /**
     * Preloaded images neede for game
     */
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
        'images/Gem Orange.png',
        'images/Gem Blue.png',
        'images/rsz_gem_green.png'
    ]);
    Resources.onReady(init);

    /**
     * @public
     */
    global.ctx = ctx;
})(this);
