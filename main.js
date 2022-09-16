let spriteSheetURL;
let spriteSheet;
let spriteSize;
let levelSize = {x:0,y:0};
let selected = {id: 1, fg: false, rotation: 0};
let bgLevelArray = [];
let fgLevelArray = [];

let drawSpace = {
    tileSize: null,
    spriteArray: []
};

let selector = {
    width: 400,
    tileSize: 25,
    spriteArray: []
};

class Tile {
    constructor (id, rotation){
        this.id = id;
        this.rotation = rotation;
        this.selected = "id"
    };
    toString() {
        return this[this.selected];
    }
};

const s = ( p ) => {

    p.setup = function() {
      p.createCanvas(p.displayWidth, p.displayHeight);
      p.angleMode(p.DEGREES);
      
      drawSpace.tileSize = ((p.displayWidth-selector.width-18)/levelSize.x);

      selector.spriteArray = loadSpriteArray(spriteSheet,selector.tileSize,255,255);
      drawSpace.spriteArray = loadSpriteArray(spriteSheet,drawSpace.tileSize,255,255);

    };
  
    p.draw = function() {
      p.background(120);
      p.fill(255);
      p.rect(0,0,selector.width,p.displayHeight);
      drawSelectTiles(p);
      drawSelectRect(p);
      editLevel(p);
      drawGrid(p);
      drawEditedLevel(p,bgLevelArray);
      drawEditedLevel(p,fgLevelArray);
      drawInfo(p);
    };

    p.preload = function() {
        spriteSheet = p.loadImage(spriteSheetURL);
    };
    p.o

    p.mouseClicked = function() {
        if (p.mouseX < selector.width){
            let tileX = Math.floor(p.mouseX / selector.tileSize);
            let tileY = Math.floor(p.mouseY / selector.tileSize);
            selected.id = tileY*16 + tileX;
            selected.fg = p.keyIsDown(p.SHIFT);
        }
    };
    p.keyPressed = function() {
        if (p.key === "s") exportFile();
        else if (p.key === "r") selected.rotation = (selected.rotation == 3 ? 0 : selected.rotation + 1);
        else if (p.key === "d") selected.id = -1
    };
};

function drawInfo(p){
    p.fill(0);
    p.text(`rotation: ${selected.rotation*90}`,5,500);
    p.text(`delete mode: ${selected.id == -1}`,5,515);
    p.text("keys:",5,540);
    p.text("r: rotate", 25,555);
    p.text("d: delete mode", 25,570);
    p.text("s: save", 25, 585);
    p.text("Shift: select foreground", 25, 600);
    p.fill(255);
};

function exportFile(){
    let parsedData = `${levelSize.x},${levelSize.y}`
    
    parsedData += encodeLine(bgLevelArray, "id");
    parsedData += encodeLine(bgLevelArray, "rotation");
    parsedData += encodeLine(fgLevelArray, "id");
    parsedData += encodeLine(fgLevelArray, "rotation");

    saveFile("level.ptlt", parsedData);
};

function encodeLine(levelArray, selected) {
    let parsedData = ""
    parsedData += "\n"
    levelArray.forEach((arr) => arr.forEach((obj) => obj.selected = selected));
    levelArray.forEach((arr) => {parsedData += arr.join(",") ; parsedData += ","});
    parsedData = parsedData.slice(0,-1);
    return parsedData;

};

function saveFile(filename, data) {
    const blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

function startEditor(){
    spriteSheetURL = loadImageURL("spriteSheet");
    levelSize.x = parseInt(document.getElementById("levelX").value);
    levelSize.y = parseInt(document.getElementById("levelY").value);
    spriteSize = parseInt(document.getElementById("spriteSize").value);
    bgLevelArray = initLevelArray();
    fgLevelArray = initLevelArray();
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
    for (let i=0; i<imageY; i+=spriteSize){
        for (let j=0; j<imageX; j+=spriteSize){
            arr.push(image.get(j,i,spriteSize,spriteSize));
        }
    }
    arr.forEach((tile) => tile.resize(tileSize,tileSize));
    return arr;
};

function initLevelArray(){
    let levelArray = [];
    for (let i=0; i<levelSize.x; i++){
        yArray = [];
        for (let j=0; j<levelSize.y; j++){
            yArray.push(new Tile(-1,0));
        }
        levelArray.push([...yArray]);
    };
    return levelArray;
};

function drawGrid(p){

    for (let i=0; i<=levelSize.y; i++){
        let y = i*(drawSpace.tileSize)
        p.line(selector.width,y,p.displayWidth,y);
    };
    for (let i=0; i<=levelSize.x; i++){
        let x = (i*(drawSpace.tileSize))+selector.width;
        p.line(x,0,x,p.displayHeight);
    };
    p.rect(selector.width,levelSize.y*drawSpace.tileSize,p.displayWidth,p.displayHeight);
};

function drawSelectTiles(p){
    let i=0;
    for (let y=0;y<(selector.spriteArray.length/16);y++){
        for (let x=0;x<16;x++){
            p.image(selector.spriteArray[i],x*selector.tileSize,y*selector.tileSize);
            i++;
        };
    };
};

function drawSelectRect(p){
    let y = (Math.floor(selected.id/16))*selector.tileSize;
    let x = (selected.id%16)*selector.tileSize;
    p.noFill();
    p.stroke(selected.fg?'red':'blue');
    p.strokeWeight(3);
    p.rect(x,y,25,25);
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(255);
}

function editLevel(p){
    if (!(p.mouseIsPressed) || (p.mouseX < selector.width)) return;
    let tileX = Math.floor((p.mouseX - selector.width) / drawSpace.tileSize);
    let tileY = Math.floor((p.mouseY) / drawSpace.tileSize);

    if (selected.id == -1){
        bgLevelArray[tileX][tileY].id = -1;
        bgLevelArray[tileX][tileY].rotation = 0;
        fgLevelArray[tileX][tileY].id = -1;
        fgLevelArray[tileX][tileY].rotation = 0;
        return
    }

    if (!selected.fg){
        bgLevelArray[tileX][tileY].id = selected.id;
        bgLevelArray[tileX][tileY].rotation = selected.rotation;
    } else {
        fgLevelArray[tileX][tileY].id = selected.id;
        fgLevelArray[tileX][tileY].rotation = selected.rotation;
    }
};

function drawEditedLevel(p,levelArray){
    p.imageMode(p.CENTER);
    for (let i=0; i<levelArray.length; i++){
        for (let j=0; j<levelArray[0].length; j++){
            if (levelArray[i][j].id != -1){
                let x = (i*drawSpace.tileSize)+selector.width+(drawSpace.tileSize/2);
                let y = j*drawSpace.tileSize+(drawSpace.tileSize/2);
                let rotate = levelArray[i][j].rotation*90;

                p.translate(x,y);
                p.rotate(rotate);
                p.image(drawSpace.spriteArray[(levelArray[i][j].id)],0,0,drawSpace.tileSize,drawSpace.tileSize);
                p.rotate(-1*rotate);
                p.translate(-1*x,-1*y);
            }
        }
    };
    p.rotate(0);
    p.imageMode(p.CORNER);
};