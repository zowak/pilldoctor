import Pill from './pill.js';
import PillFragment from './pillFragment.js';


const VECTORS = [
    [ 1, 0],
//    [-1, 0],
    [ 0, 1],
//    [ 0,-1],
]

export default class Raster{

    constructor(width, height, rastersize){
        this.width = width;
        this.height = height;
        this.rastersize = rastersize;
        this.tiles = [];

        this.init();
    }

    draw(ctx){

        ctx.fillStyle="black";
        ctx.fillRect(0,0,this.width * this.rastersize, this.height * this.rastersize);


        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){

                if(this.tiles[x][y] instanceof PillFragment ){
                    this.tiles[x][y].draw(ctx);
                }

            }
        }
    }

    init(){
        for(let x = 0; x < this.width; x++){

            this.tiles[x] = [];

            for(let y = 0; y < this.height; y++){
                this.tiles[x][y] = null;
            }
        }

    }

    pastePill(pill){
        this.tiles[pill.pillFragment1.position.x][pill.pillFragment1.position.y] = pill.pillFragment1;
        this.tiles[pill.pillFragment2.position.x][pill.pillFragment2.position.y] = pill.pillFragment2;

        console.log("Tiles to Remove: " + this.getTilesToRemove().length);

    }

    isInside(position){

        const result = (position.x >= 0 && position.y >= 0 && position.x < this.width && position.y < this.height);
        return result;

    }

    getTilesToRemove(){

        const tilesToRemove = [];

        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                
                if(this.tiles[x][y] != null){
                    let t = this.checkForCompleteRow(
                        {
                            x: x,
                            y: y
                        }
                    );
                    
                    t.forEach(e => tilesToRemove.push(e));
                }
      
            }
        }

        return tilesToRemove;
    }

    getFallingTiles(){
        const fallingTiles = [];

        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height - 1; y++){

                let pos = {x: x, y: y};

                if(this.isFallingTile(pos)){
                    fallingTiles.push(pos);
                }
            }
        }

        return fallingTiles;
    }
    

    isFallingTile(position){
        return( position.y < this.height -1  && 
                this.tiles[position.x][position.y] != null && 
                this.tiles[position.x][position.y+1] != null 
                );
    }

    checkForCompleteRow(position){


        const tiles = [];

        for(let v = 0; v < VECTORS.length; v++){

            let t = this.getSameTilesInARow(position, {x: VECTORS[v][0], y: VECTORS[v][1]});

          
            if(t.length >= 4) {
                t.forEach(e => tiles.push(e));
            }
        }
        
        return tiles;

    }


    moveTilesTowardsGround(tiles){

        tiles.forEach(t => {
            let color = this.tiles[t.x][t.y];
            this.tiles[t.x][t.y+1] = color;
            this.tiles[t.x][t.y] = null;

        });
    }


    getSameTilesInARow(position, vector){

        const tiles = [];

        let t = 0;
        let pos = position;
        let startColor = this.tiles[pos.x][pos.y];

        while(this.isInside(pos) && this.tiles[pos.x][pos.y] == startColor){
            
            tiles.push(pos);

            t++;
            pos = {
                x: position.x + (vector.x * t),
                y: position.y + (vector.y * t)
            }
        }

        return tiles;
    }

}