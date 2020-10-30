const ROTATION_VECTORS = [
    {x:-1, y: 1},
    {x:-1, y:-1},
    {x: 1, y:-1},
    {x: 1, y: 1},
];
export default class Pill{

    constructor(position, color1, color2, fragmentSize, raster){
        this.position = position;

        this.pillFragment1 =  new PillFragment(position,color1,raster, fragmentSize);
        let fragmet2Pos = {x: this.position.x + 1, y: this.position.y}
        this.pillFragment2 =  new PillFragment(fragmet2Pos,color2,raster,fragmentSize);

        this.fragmentSize = fragmentSize;
        this.raster = raster;
        this.rotation = 3; // 0..3
    }

    draw(ctx){

        this.pillFragment1.draw(ctx);
        this.pillFragment2.draw(ctx);   
       
    }

    
    move(vector){

        let fragment1Postition = this.pillFragment1.position;
        let fragment2Postition = this.pillFragment2.position;

        if (    this.pillFragment1.move(vector) &&
                this.pillFragment2.move(vector)
            )
        {
                return true;
        }

        this.pillFragment1.position = fragment1Postition;
        this.pillFragment2.position = fragment2Postition;

        return false;

    } 


    rotate(){
        if(++this.rotation > ROTATION_VECTORS.length-1) this.rotation = 0;

        if(!this.pillFragment2.move(ROTATION_VECTORS[this.rotation])) this.rotation--;
    }
}

class PillFragment{
    constructor(position, color, raster, fragmentSize){
        this.position = position;
        this.color = color;
        this.raster = raster;
        this.fragmentSize = fragmentSize;
    }

    draw(ctx,){
        ctx.fillStyle = this.color; 
        ctx.fillRect(   this.position.x * this.fragmentSize, 
                        this.position.y * this.fragmentSize, 
                        this.fragmentSize, 
                        this.fragmentSize);
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



