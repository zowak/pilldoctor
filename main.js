import Pill from './pill.js';
import Raster from './raster.js';
import ImageManager from './imageManager.js';
import Virus from './virus.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// time vars
var lastUpdate = Date.now();
var gameSpeed = 600;
var game_started = false;

// Game Objects
var raster = new Raster();
var pill;


// Input Handle
var leftPressed = false;
var rightPressed = false;
var downPressed = false;
var upPressed   = false;


document.addEventListener('keyup', (e) => {

    if (e.code === "ArrowLeft" || e.code === "KeyA"){
        leftPressed = false;
    }       
    else if (e.code === "ArrowRight" || e.code === "KeyD"){
        rightPressed = false;
    } 
    else if (e.code === "ArrowDown" || e.code === "KeyS"){
        downPressed = false;
    }  
    else if (e.code === "ArrowUp" || e.code === "KeyW"){
        upPressed = false;
    } 
  
  });

  document.addEventListener('keydown', (e) => {

    if (e.code === "ArrowLeft" || e.code === "KeyA"){
        leftPressed = true;
    }       
    else if (e.code === "ArrowRight" || e.code === "KeyD"){
        rightPressed = true;
    } 
    else if (e.code === "ArrowDown" || e.code === "KeyS"){
        downPressed = true;
    } 
    else if (e.code === "ArrowUp" || e.code === "KeyW"){
        upPressed = true;
    } 
  
  });

//init
raster.load(start);

function draw(){
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    raster.draw(ctx);
    if(pill != null)pill.draw(ctx);
}

function start(){
    game_started = true;
    raster.spawnViruses(5);
    pill = raster.spawnPill();
    setInterval(draw,60);
}


function update(){

    var now = Date.now();
    var dt = now - lastUpdate;

    if(!raster.isBusy()){
        if (pill == null) pill = raster.spawnPill();

        if(dt >=gameSpeed){
            lastUpdate = now;

            // move pill towards ground
            if(!pill.move({x: 0, y: 1})){
                settlePill();
            }

            
        }


        if(upPressed){
            pill.rotate();
            upPressed = false;
        }

        if(leftPressed) pill.move({x: -1, y: 0});
        if(rightPressed) pill.move({x: 1, y: 0});
        if(downPressed){
            if(!pill.move({x:  0, y: 1})){
                settlePill();
            }
        } 
    }else{
        raster.update();
    }

}


function settlePill(){    
    pill.move({x: 0, y: 0});
    raster.checkForCompleteLinesByPill(pill);
    pill = null;
}


