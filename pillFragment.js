export default class PillFragment{
    constructor(position, image, raster, fragmentSize){
        this.position = position;
        this.image = image;
        this.raster = raster;
        this.fragmentSize = fragmentSize;
    }

    draw(ctx){
        ctx.drawImage(  this.image, 
                        this.position.x * this.fragmentSize,
                        this.position.y * this.fragmentSize
                        )
    }

    move(vector){
        if( this.position.x + vector.x >= 0 &&
            this.position.y + vector.y >= 0 &&
            this.position.x + vector.x < this.raster.width &&
            this.position.y + vector.y < this.raster.height &&
            this.raster.tiles[ this.position.x + vector.x][this.position.y + vector.y] === null
            ){
                
            this.position ={
                x: this.position.x + vector.x,
                y: this.position.y + vector.y
            }

            return true;
        }
        
        return false;
    }

}