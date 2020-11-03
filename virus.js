import { RASTER_SIZE } from './raster.js'

export default class Virus{


    constructor(image, position, color){
        this.image = image;
        this.position = position;
        this.color = color;

    }

    draw(ctx){
        ctx.drawImage(this.image, this.position.x * RASTER_SIZE , this.position.y * RASTER_SIZE);
    }

}