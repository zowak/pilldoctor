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
        this.fallingPills = false;

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

        
       if(this.getTilesToRemove().length > 0){
            this.updateFloatingTiles();
       }

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

    updateFloatingTiles(){
        this.fallingPills = false;

        for(let x = 0; x < this.width; x++){
            for(let y = this.height -2; y >= 0; y--){
                let pos = {x: x,y: y};
                if(this.isFloatingTile(pos)){
                    const p = this.tiles[pos.x][pos.y];
                    this.tiles[x][y] = null;
                    p.move({x: 0, y: 1});
                    this.tiles[x][y+1] = p;

                    this.fallingPills = true;
                }
            }
        }
    }

    isFloatingTile(position){
        return( 
                (
                    position.y < this.height -1  && 
                    this.tiles[position.x][position.y] != null && 
                    this.tiles[position.x][position.y] instanceof PillFragment &&
                    !this.pillStickToOtherFragment(position) &&
                    this.tiles[position.x][position.y+1] == null 
                )
            );
    }

    pillStickToOtherFragment(position){

        const f = this.tiles[position.x][position.y];
        const posLeft = {x: position.x -1, y: position.y};
        const posRight = {x: position.x +1, y: position.y};

        if( this.isInside(posLeft) && 
            this.tiles[posLeft.x][posLeft.y] instanceof PillFragment &&
            this.tiles[posLeft.x][posLeft.y].pill == f.pill
        )
                return true;
        
        if( this.isInside(posRight) && 
            this.tiles[posRight.x][posRight.y] instanceof PillFragment &&
            this.tiles[posRight.x][posRight.y].pill == f.pill
        )
                    return true;

        return false;

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



    getSameTilesInARow(position, vector){

        const tiles = [];

        let t = 0;
        let pos = position;
        let startImage = this.tiles[pos.x][pos.y].image;

        while(  this.isInside(pos) && 
                this.tiles[pos.x][pos.y] != null &&
                this.tiles[pos.x][pos.y].image == startImage){
            
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