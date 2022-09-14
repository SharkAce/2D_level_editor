let spriteSheetURL;
let spriteSheet;
let spriteSize;
let levelSize = {x:0,y:0};
let selected = {id: 1, fg: false};
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

const s = ( p ) => {

    p.setup = function() {
      p.createCanvas(p.displayWidth, p.displayHeight);
      
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
    };
};

function exportFile(){
    let parsedData = `${tileX},${tileY}\n`
    bgLevelArray.forEach((arr) => parsedData += arr.join(","))
    parsedData += "\n"
    fgLevelArray.forEach((arr) => parsedData += arr.join(","))

    saveFile("level.ptlt", parsedData);
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
    for (let i=0; i<imageY; i+=spriteSize){
        for (let j=0; j<imageX; j+=spriteSize){
            arr.push(image.get(j,i,spriteSize,spriteSize));
        }
    }
    arr.forEach((tile) => tile.resize(tileSize,tileSize));
    return arr;
};

function initLevelArray(){
    for (let i=0; i<levelSize.x; i++){
        yArray = [];
        for (let j=0; j<levelSize.y; j++){
            yArray.push(-1);
        }
        bgLevelArray.push([...yArray]);
        fgLevelArray.push([...yArray]);
    };
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
    if (!selected.fg){
        bgLevelArray[tileX][tileY] = selected.id;
    } else {
        fgLevelArray[tileX][tileY] = selected.id;
    }
};

function drawEditedLevel(p,levelArray){
    for (let i=0; i<levelArray.length; i++){
        for (let j=0; j<levelArray[0].length; j++){
            if (levelArray[i][j] != -1){
                p.image(drawSpace.spriteArray[(levelArray[i][j])],(i*drawSpace.tileSize)+selector.width,j*drawSpace.tileSize);
            }
        }
    };
};