export default class ImageManager{

    constructor(filenames, callback){
        this.filenames = filenames;
        this.images = [];
        this.loadedImages = 0;
        this.callback = callback;
    }

    loadImages(){
        this.filenames.forEach(n => {
            let img = new Image();
            img.src = "./img/" + n + ".png";
            img.onload = () => this.imageLoaded();
            this.images[n] = img;
        });
        
    }

    getImage(name){
        return this.images[name];
    }

    imageLoaded(){
        this.loadedImages++;
        if(this.allImagesLoaded()){
            console.log("all files loaded");
            this.callback();
        } 
    }

    allImagesLoaded(){
        return(this.loadedImages == this.filenames.length)
    }

}