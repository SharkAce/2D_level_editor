let spriteSheetURL;
let spriteSheet;
let spriteArray = [];
let drawSpriteArray = [];
let levelSize = {x:0,y:0};
let selected = 1;
let levelArray = [];
let tileSize;
const tileSelectorWidth = 400;

const s = ( p ) => {

    let x = 100; 
    let y = 100;
  
    p.setup = function() {
      p.createCanvas(p.displayWidth, p.displayHeight);
      spriteArray = loadSpriteArray(spriteSheet,16,255,255);
      
      tileSize = ((p.displayWidth-tileSelectorWidth-18)/levelSize.x);

      drawSpriteArray = loadSpriteArray(spriteSheet,16,255,255);
      drawSpriteArray.forEach((tile) => tile.resize(tileSize,tileSize));

    };
  
    p.draw = function() {
      p.background(120);
      p.fill(255);
      p.rect(0,0,tileSelectorWidth,p.displayHeight);
      drawSelectTiles(p);
      drawSelectRect(p);
      editLevel(p);
      drawGrid(p);
      drawEditedLevel(p);
    };

    p.preload = function() {
        spriteSheet = p.loadImage(spriteSheetURL);
    };
    p.o

    p.mouseClicked = function() {
        if (p.mouseX < tileSelectorWidth){
            let tileX = Math.floor(p.mouseX / 25);
            let tileY = Math.floor(p.mouseY / 25);
            selected = tileY*16 + tileX;
    }
  };
};

function startEditor(){
    spriteSheetURL = loadImageURL("spriteSheet");
    levelSize.x = document.getElementById("levelX").value;
    levelSize.y = document.getElementById("levelY").value;
    initLevelArray();
    let myp5 = new p5(s);
    document.getElementById("initForm").remove();
  
};

function loadImageURL(imageElementId){
    const selectedFile = document.getElementById(imageElementId);
    const myImageFile = selectedFile.files[0];
    return URL.createObjectURL(myImageFile);

};

function loadSpriteArray(image,tileSize,imageX,imageY){
    let arr = [];
    for (let i=0; i<imageY; i+=tileSize){
        for (let j=0; j<imageX; j+=tileSize){
            arr.push(image.get(j,i,tileSize,tileSize));
        }
    }
    arr.forEach((tile) => tile.resize(25,25));
    return arr;
};

function initLevelArray(){
    for (let i=0; i<levelSize.x; i++){
        yArray = [];
        for (let j=0; j<levelSize.y; j++){
            yArray.push(-1);
        }
        levelArray.push(yArray);
    };
};

function drawGrid(p){

    for (let i=0; i<=levelSize.y; i++){
        let y = i*(tileSize)
        p.line(tileSelectorWidth,y,p.displayWidth,y);
    };
    for (let i=0; i<=levelSize.x; i++){
        let x = (i*(tileSize))+tileSelectorWidth;
        p.line(x,0,x,p.displayHeight);
    };
    p.rect(tileSelectorWidth,levelSize.y*tileSize,p.displayWidth,p.displayHeight);
};

function drawSelectTiles(p){
    let i=0;
    for (let y=0;y<(spriteArray.length/16);y++){
        for (let x=0;x<16;x++){
            p.image(spriteArray[i],x*25,y*25);
            i++;
        };
    };
};

function drawSelectRect(p){
    let y = (Math.floor(selected/16))*25;
    let x = (selected%16)*25;
    p.noFill();
    p.stroke('blue');
    p.strokeWeight(3);
    p.rect(x,y,25,25);
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(255);
}

function editLevel(p){
    if (!(p.mouseIsPressed) || (p.mouseX < tileSelectorWidth)) return;
    console.log('clicking')
    let tileX = Math.floor((p.mouseX - tileSelectorWidth) / tileSize);
    let tileY = Math.floor((p.mouseY) / tileSize);
    console.log(tileX, tileY, selected)
    levelArray[tileX][tileY] = selected;
};

function drawEditedLevel(p){
    // for (let i=0; i<levelArray.length; i++){
    //     for (let j=0; j<levelArray[0].lenght; j++){
    //         if (levelArray[i][j] != -1){
    //             console.log("debug")
    //             p.image(drawSpriteArray[(i*16)+j],(i*tileSize)+tileSelectorWidth,j*tileSize);
    //         }
    //     }
    // };
};