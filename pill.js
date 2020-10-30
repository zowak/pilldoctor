import PillFragment from './pillFragment.js';

const ROTATION_VECTORS = [
    {x:-1, y: 1},
    {x:-1, y:-1},
    {x: 1, y:-1},
    {x: 1, y: 1},
];
export default class Pill{

    constructor(position, image1, image2, fragmentSize, raster){
        this.position = position;

        this.pillFragment1 =  new PillFragment(position,image1,raster, fragmentSize, this);
        let fragmet2Pos = {x: this.position.x + 1, y: this.position.y}
        this.pillFragment2 =  new PillFragment(fragmet2Pos,image2,raster,fragmentSize, this);

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





