import Pill from './pill.js';
import PillFragment from './pillFragment.js';
import Virus from './virus.js';



const DOWN_VECTOR = {x: 0, y: 1};

export default class Raster{

    constructor(width, height, rastersize, fragement_effect_image){
        this.width = width;
        this.height = height;
        this.rastersize = rastersize;

        this.fragement_effect_image = fragement_effect_image;

        this.tiles = [];

        this.fragmentsAreFalling = false;
        this.removedTiles = [];

        this.init();
    }


    draw(ctx){

        ctx.fillStyle="black";
        ctx.fillRect(0,0,this.width * this.rastersize, this.height * this.rastersize);


        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){

                if( this.tiles[x][y] instanceof PillFragment ||
                    this.tiles[x][y] instanceof Virus){
                    this.tiles[x][y].draw(ctx);
                }

            }
        }
        
        this.removedTiles.forEach(t => {
            ctx.drawImage(  this.fragement_effect_image, t.position.x * this.rastersize,t.position.y * this.rastersize );
        });
        this.removedTiles = [];
    }

    init(){
        for(let x = 0; x < this.width; x++){

            this.tiles[x] = [];

            for(let y = 0; y < this.height; y++){
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
            }
        });
    }

    /*
    movePillDown(pill){

        if(pill.move(DOWN_VECTOR))
    }
    */

    checkForCompleteLineHorizontal(position){

        const startTile = this.tiles[position.x][position.y];
        const tiles = [startTile];

        // look right 
        for(let x = position.x + 1; x < this.width; x++){
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
        for(let y = position.y + 1; y < this.height; y++){
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

        const result = (position.x >= 0 && position.y >= 0 && position.x < this.width && position.y < this.height);
        return result;

    }

    update(){
        
       // update falling tiles
       this.fragmentsAreFalling = false;

       for(let x = 0; x < this.width; x++){
           for(let y = this.height - 2; y >= 0; y--){
                
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
                    position.y < this.height -1  && 
                    this.tiles[position.x][position.y] != null && 
                    this.tiles[position.x][position.y] instanceof PillFragment &&
                    this.tiles[position.x][position.y+1] == null 
                )
            );
    }
    

 
}