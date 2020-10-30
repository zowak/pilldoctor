import Pill from './pill.js';
import Raster from './raster.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const RASTER_SIZE = 25;

// time vars
var lastUpdate = Date.now();
var gameSpeed = 200;

// Game Objects
var raster = new Raster(10,20,RASTER_SIZE);
var pill =  null;

const spawnPosition = {x: 4, y: 0};
const pillColors = [
    '#F00',
    '#0F0',
//    '#00F',
 //   '#FF0',
//    '#F0F',
]

// init Image Load
const imageNames = ["blue_pill", "red_pill", "yellow_pill"];
const imageCollection = [];
let loadedImages = 0;

imageNames.forEach(n => {
    let img = new Image();
    img.src = "./img/" + n + ".png";
    img.onload = () => loadedImages++;
    imageCollection[n] = img;
});


var fallingTiles = [];



// Input Handle
var leftPressed = false;
var rightPressed = false;
var downPressed = false;
var upPressed   = false;

document.addEventListener('keyup', (e) => {

    if (e.code === "ArrowLeft"){
        leftPressed = false;
    }       
    else if (e.code === "ArrowRight"){
        rightPressed = false;
    } 
    else if (e.code === "ArrowDown"){
        downPressed = false;
    }  
    else if (e.code === "ArrowUp"){
        upPressed = false;
    } 
  
  });

  document.addEventListener('keydown', (e) => {

    if (e.code === "ArrowLeft"){
        leftPressed = true;
    }       
    else if (e.code === "ArrowRight"){
        rightPressed = true;
    } 
    else if (e.code === "ArrowDown"){
        downPressed = true;
    } 
    else if (e.code === "ArrowUp"){
        upPressed = true;
    } 
  
  });


setInterval(draw,60);

function imageLoaded(){
    loadedImages++;
}

function allImagesLoaded(){
    return(loadedImages == imageNames.length);
}


function draw(){
    if(allImagesLoaded()){
        update();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        raster.draw(ctx);
        pill.draw(ctx);
    }else{
        ctx.fillStyle = 'black';
        ctx.font = '20px Courier';
        ctx.fillText(loadedImages + ' of ' + imageNames.length + " loaded",  25, 25);
    }
}

function update(){

    var now = Date.now();
    var dt = now - lastUpdate;


    if (pill == null) spawnPill();

    if(dt >=gameSpeed){
        lastUpdate = now;

        if(fallingTiles.length > 0 ){
            raster.moveTilesTowardsGround(fallingTiles);
            fallingTiles = raster.getFallingTiles();
        }


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

}


function settlePill(){
    raster.pastePill(pill);

    const tilesToRemove = raster.getTilesToRemove();
    tilesToRemove.forEach(t => 
        raster.tiles[t.x][t.y] = null    
    );

    if(tilesToRemove.length > 0)  fallingTiles = raster.getFallingTiles();

    pill = null;

   
}

function spawnPill(){
    let colorIdx1 = getRndInteger(0, pillColors.length);
    let colorIdx2 = getRndInteger(0, pillColors.length);

    pill = new Pill(    spawnPosition, 
                        pillColors[colorIdx1], 
                        pillColors[colorIdx2], 
                        RASTER_SIZE, 
                        raster);

}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

