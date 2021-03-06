var show;

async function setup() {
    var canvas = createCanvas(600, 300);
    canvas.parent('game');
    var room = await getRoom(1);
    show = room.roo_topcard; 
}  
function draw() {
    background(220);
    textSize(20);
    fill(0,0,0);
    textAlign(CENTER, CENTER);
    text(show,width/2,height/2);
}
async function mouseClicked() {
    var room = await getRoom(1);
    show = room.roo_topcard;     
}
async function keyPressed() {
    let playCard = '';
    switch(key) {
        case 'r': playCard = "rock"; break;
        case 'p': playCard = "paper"; break;
        case 's': playCard = "scissors"; break;
    }
    if (play) {
        var result = await play(1,playCard);
        show = result.msg;    
    } 
}
const width = 1000;
const height = 400;
const room = 1;

var boardMan;

function preload() {
    BoardManager.preloadImages();
    boardMan = new BoardManager(width,height,0,0,room);
    boardMan.initBoard();
}

function setup() {
    var canvas = createCanvas(width, height);
    canvas.parent('game');
}
function draw() {
    background(220);
    boardMan.draw();
}
function mouseClicked() {
    boardMan.click(mouseX,mouseY);     
}