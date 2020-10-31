export default class PillFragment{
    constructor(position, image, raster, fragmentSize, pill, color){
        this.position = position;
        this.image = image;
        this.raster = raster;
        this.fragmentSize = fragmentSize;
        this.pill = pill;
        this.color = color;
    }

    draw(ctx){
        ctx.drawImage(  this.image, 
                        this.position.x * this.fragmentSize,
                        this.position.y * this.fragmentSize
                        )
    }

    checkMove(vector){
        const newPos = {x: this.position.x + vector.x, y: this.position.y + vector.y};

        if( this.raster.isInside(newPos) ){
   
            const tile = this.raster.tiles[newPos.x][newPos.y];

            if(tile == null  || (tile instanceof PillFragment && tile.pill === this.pill)){

                return true;
            }
    
        }
        
        return false;

    }

    move(vector){

        if(this.checkMove(vector)){


            const newPos = {x: this.position.x + vector.x, y: this.position.y + vector.y};

            // update raster
            this.raster.tiles[this.position.x][this.position.y] = null;
            this.raster.tiles[newPos.x][newPos.y] = this

            // update position
            this.position = newPos;
            return true;
        }
        
        return false;
    }



}