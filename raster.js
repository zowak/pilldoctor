import Pill from './pill.js';
import PillFragment from './pillFragment.js';
import Virus from './virus.js';
import ImageManager from './imageManager.js';
import { getRndInteger }  from './utils.js';

export const RASTER_SIZE = 25;
export const RASTER_WIDTH = 10;
export const RASTER_HEIGHT = 20;

const COLOR_RED = 0;
const COLOR_BLUE = 1;
const COLOR_YELLOW = 2;
const COLORS = [
    "red",
//    "blue",
//    "yellow"
];

const PILL_SPAWN_POSITION = {x: 4, y: 0};
const DOWN_VECTOR = {x: 0, y: 1};

export default class Raster{

    constructor(){
        this.fragmentGfx = [];
        this.virusGfx = [];
        this.effectGfx;
        this.tiles = [];

        this.currentPill;
        this.remainingViruses = 0;

        this.gameOver = false;

        this.fragmentsAreFalling = false;
        this.removedTiles = [];
        this.init();
    }

    load(callback){

        // Game Ressources
        const imageNames = [
            "T_virus",
            "C_virus",
            "Y_virus",
            "yellow_pill",
            "red_pill", 
            "blue_pill", 
            "fragment_effect"
        ];

        const images = new ImageManager(imageNames,() => {
            this.fragmentGfx[COLOR_RED]     = images.getImage("red_pill");
            this.fragmentGfx[COLOR_BLUE]    = images.getImage("blue_pill");
            this.fragmentGfx[COLOR_YELLOW]  = images.getImage("yellow_pill");

            this.virusGfx[COLOR_RED]     = images.getImage("C_virus");
            this.virusGfx[COLOR_BLUE]    = images.getImage("Y_virus");
            this.virusGfx[COLOR_YELLOW]  = images.getImage("T_virus");

            this.effectGfx =  images.getImage("fragment_effect");

            callback();
        });

        images.loadImages();
    }

    spawnViruses(count){
        for(let i = 0; i < count; i++){
            const colorIndex = getRndInteger(0, COLORS.length);
            const pos = {
                x: getRndInteger(0, RASTER_WIDTH - 1),
                y: getRndInteger(0, RASTER_HEIGHT - 1),
            };
    
            const virus = new Virus(    this.virusGfx[colorIndex],
                                        pos, 
                                        COLORS[colorIndex]);

            this.tiles[pos.x][pos.y] = virus;
            this.remainingViruses++;
        }
    }

    draw(ctx){
        ctx.fillStyle="black";
        ctx.fillRect(0, 0, RASTER_WIDTH * RASTER_SIZE, RASTER_HEIGHT * RASTER_SIZE);

        for(let x = 0; x < RASTER_WIDTH; x++){
            for(let y = 0; y < RASTER_HEIGHT; y++){

                if( this.tiles[x][y] instanceof PillFragment ||
                    this.tiles[x][y] instanceof Virus){
                    this.tiles[x][y].draw(ctx);
                }

            }
        }
        
        this.removedTiles.forEach(t => {
            ctx.drawImage(this.effectGfx, t.position.x * RASTER_SIZE, t.position.y * RASTER_SIZE );
        });
        this.removedTiles = [];
    }

    init(){
        for(let x = 0; x < RASTER_WIDTH; x++){

            this.tiles[x] = [];

            for(let y = 0; y < RASTER_HEIGHT; y++){
                this.tiles[x][y] = null;
            }
        }

    }

    checkForCompleteLinesByPill(pill){
        if(pill.pillFragment1)this.checkForCompleteLines(pill.pillFragment1.position);
        if(pill.pillFragment2)this.checkForCompleteLines(pill.pillFragment2.position);

    }

    checkForCompleteLines(position){
        const tilesToRemove = this.checkForCompleteLineHorizontal(position).concat(this.checkForCompleteLineVertical(position));
        this.removedTiles = tilesToRemove;
        this.clearTiles(tilesToRemove);
    }

    clearTiles(tiles){
        tiles.forEach(t => {
            this.tiles[t.position.x][t.position.y] = null;
            if(t instanceof PillFragment){
                t.pill.destroyFragment(t);
                this.fragmentsAreFalling = true;
            }else if(t instanceof Virus){
                this.remainingViruses--;
            }
        });
    }


    checkForCompleteLineHorizontal(position){

        const startTile = this.tiles[position.x][position.y];
        const tiles = [startTile];

        // look right 
        for(let x = position.x + 1; x < RASTER_WIDTH; x++){
            let t = this.tiles[x][position.y];
            if(t != null && startTile.color == t.color){
                tiles.push(t);
            }else{
                break;
            }
        }

        //look left 
        for(let x = position.x - 1; x >= 0; x--){
            let t = this.tiles[x][position.y];
            if(t != null && startTile.color == t.color){
                tiles.push(t);
            }else{
                break;
            }
        }

        if(tiles.length >= 4) return tiles;

        return [];

    }


    checkForCompleteLineVertical(position){

        const startTile = this.tiles[position.x][position.y];
        const tiles = [startTile];

        // look under 
        for(let y = position.y + 1; y < RASTER_HEIGHT; y++){
            let t = this.tiles[position.x][y];
            if(t != null && startTile.color == t.color){
                tiles.push(t);
            }else{
                break;
            }
        }

        //look above 
        for(let y = position.y - 1; y >= 0; y--){
            let t = this.tiles[position.x][y];
            if(t != null && startTile.color == t.color){
                tiles.push(t);
            }else{
                break;
            }
        }

        if(tiles.length >= 4) return tiles;

        return [];

    }


    isBusy(){
        return this.fragmentsAreFalling;
    }

    isInside(position){

        return (position.x >= 0 && position.y >= 0 && position.x < RASTER_WIDTH && position.y < RASTER_HEIGHT);
       //a return result;

    }

    update(){
        
       // update falling tiles
       this.fragmentsAreFalling = false;

       for(let x = 0; x < RASTER_WIDTH; x++){
           for(let y = RASTER_HEIGHT - 2; y >= 0; y--){
                
                const pos = {x: x, y: y};
                const fragment = this.tiles[x][y];

                if(this.isFloatingFragment(pos)){
                    if(fragment.pill.move(DOWN_VECTOR)){
                        this.fragmentsAreFalling = true;
                        this.checkForCompleteLinesByPill(fragment.pill);
                    } 
                }
           }
       }
    }


    isFloatingFragment(position){
        return( 
                (
                    position.y < RASTER_HEIGHT -1  && 
                    this.tiles[position.x][position.y] != null && 
                    this.tiles[position.x][position.y] instanceof PillFragment &&
                    this.tiles[position.x][position.y+1] == null 
                )
            );
    }

    spawnPill(){
        let fragmentIdx1 = getRndInteger(0, COLORS.length);
        let fragmentIdx2 = getRndInteger(0, COLORS.length);
    
        
        this.currentPill = new Pill(    PILL_SPAWN_POSITION, 
                            this.fragmentGfx[fragmentIdx1], 
                            COLORS[fragmentIdx1],
                            this.fragmentGfx[fragmentIdx2], 
                            COLORS[fragmentIdx2],
                            this);

        //check for game over
        if(!this.currentPill.move({x: 0, y: 0})) this.gameOver = true;
        console.log("game over: " + this.gameOver);
        
        return this.currentPill;
    
    }
    

 
}