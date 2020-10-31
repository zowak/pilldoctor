export default class Virus{


    constructor(image, position, frameSize, color){
        this.image = image;
        this.position = position;
        this.frameSize = frameSize;
        this.color = color;

    }

    draw(ctx){
        ctx.drawImage(this.image, this.position.x *  this.frameSize, this.position.y * this.frameSize);
    }

}