import PillFragment from './pillFragment.js';

const ROTATION_VECTORS = [
    {x:-1, y: 1},
    {x:-1, y:-1},
    {x: 1, y:-1},
    {x: 1, y: 1},
];
export default class Pill{

    constructor(position, image1, color1, image2, color2, raster){
        this.position = position;

        this.pillFragment1 =  new PillFragment(position,image1,raster, this, color1);
        let fragmet2Pos = {x: this.position.x + 1, y: this.position.y}
        this.pillFragment2 =  new PillFragment(fragmet2Pos,image2,raster, this, color2);

        this.raster = raster;
        this.rotation = 3; // 0..3
    }

    draw(ctx){

        if(this.pillFragment1 != null)this.pillFragment1.draw(ctx);
        if(this.pillFragment2 != null)this.pillFragment2.draw(ctx);   
       
    }

    destroyFragment(fragment){
        if(this.pillFragment1 === fragment) this.pillFragment1 = null;
        if(this.pillFragment2 === fragment) this.pillFragment2 = null;
    }

    
    move(vector){


        if (    (this.pillFragment1 == null || this.pillFragment1.checkMove(vector)) &&
                (this.pillFragment2 == null || this.pillFragment2.checkMove(vector))
            )
        {
                if(this.pillFragment1 != null)this.pillFragment1.move(vector);
                if(this.pillFragment2 != null)this.pillFragment2.move(vector);
                return true;
        }

        return false;

    } 


    rotate(){
        if(++this.rotation > ROTATION_VECTORS.length-1) this.rotation = 0;

        if(!this.pillFragment2.move(ROTATION_VECTORS[this.rotation])) this.rotation--;
    }
}





