import Pill from './pill.js';
import Raster from './raster.js';
import ImageManager from './imageManager.js';
import Virus from './virus.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const RASTER_SIZE = 25;

// time vars
var lastUpdate = Date.now();
var gameSpeed = 600;
var game_started = false;

// Game Objects
var raster = null;
var pill =  null;
const spawnPosition = {x: 4, y: 0};


// init Image Load
let allPillsLoaded = false;
let allVirusesLoaded = false;
let allEffectsLoaded = false;

const colorIndex = [
    "yellow",
    "red",
    "blue"
];

const virusImageNames = [
    "T_virus",
    "C_virus",
    "Y_virus",
];
const pillImageNames = [
    "yellow_pill",
    "red_pill", 
    "blue_pill", 
];


let pillImages = [];
let virusImages = [];
let effectImages = [];

const pillImageManager = new ImageManager(pillImageNames, () => {
    pillImages = pillImageManager.getImageArray();
    allPillsLoaded = true;
});
pillImageManager.loadImages();


const virusImageManager = new ImageManager(virusImageNames, () => {
    virusImages = virusImageManager.getImageArray();
    allVirusesLoaded = true;
});
virusImageManager.loadImages();


const effectImageManager = new ImageManager(["fragment_effect"], () => {
    effectImages = effectImageManager.images;
    allEffectsLoaded = true;

});
effectImageManager.loadImages();




// test variables

// game variables

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
setInterval(draw,60);

function draw(){
    if(allResLoaded()){
        update();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        raster.draw(ctx);
        if(pill != null)pill.draw(ctx);
    }else{
        ctx.fillStyle = 'black';
        ctx.font = '20px Courier';
        ctx.fillText("loading images",  25, 25);
    }
}

function start(){
    game_started = true;
    raster = new Raster(10,20,RASTER_SIZE, effectImages["fragment_effect"]);
    settleViruses(5);
}

function allResLoaded(){
    return allPillsLoaded && allVirusesLoaded && allEffectsLoaded;
}
function update(){

    var now = Date.now();
    var dt = now - lastUpdate;

    if(allResLoaded() && game_started){

        if(!raster.isBusy()){
            if (pill == null) spawnPill();

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
    }else{
        start();
    }
}


function settlePill(){    

    pill.move({x: 0, y: 0});

    raster.checkForCompleteLinesByPill(pill);
    pill = null;
}

function spawnPill(){
    let imageIdx1 = getRndInteger(0, pillImages.length);
    let imageIdx2 = getRndInteger(0, pillImages.length);

    pill = new Pill(    spawnPosition, 
                        pillImages[imageIdx1], 
                        colorIndex[imageIdx1],
                        pillImages[imageIdx2], 
                        colorIndex[imageIdx2],
                        RASTER_SIZE, 
                        raster);

}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function settleViruses(count){
    for(let i = 0; i < count; i++){
        const imageIndex = getRndInteger(0, virusImages.length);
        const pos = {
            x: getRndInteger(0, raster.width - 1),
            y: getRndInteger(0, raster.height - 1),
        };

        const virus = new Virus(    virusImages[imageIndex],
                                    pos, 
                                    RASTER_SIZE, 
                                    colorIndex[imageIndex]);
        raster.tiles[pos.x][pos.y] = virus;
    }
}

