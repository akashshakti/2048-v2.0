/* ===================================== */
/* 2048 ULTIMATE V2.0 */
/* ===================================== */

let size = 4;
let mode = "Single";

let board = [];
let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;

let previousBoard = [];
let previousScore = 0;

let gameWon = false;

let startX = 0;
let startY = 0;

/* ========================= */
/* ELEMENTS */
/* ========================= */

const gameArea = document.getElementById("gameArea");

const scoreDisplay =
document.getElementById("score");

const highScoreDisplay =
document.getElementById("highScore");

const highTileDisplay =
document.getElementById("highTile");

const modeText =
document.getElementById("modeText");

const winModal =
document.getElementById("winModal");

const gameOverModal =
document.getElementById("gameOverModal");

/* ========================= */
/* AUDIO */
/* ========================= */

function playSound(id){

const sound =
document.getElementById(id);

if(!sound) return;

sound.currentTime = 0;

sound.play().catch(()=>{});

}

/* ========================= */
/* CREATE BOARD */
/* ========================= */

function createBoard(){

gameArea.innerHTML = "";

const boardElement =
document.createElement("div");

boardElement.className = "board";

for(let i=0;i<16;i++){

const tile =
document.createElement("div");

tile.className = "tile";

boardElement.appendChild(tile);

}

gameArea.appendChild(boardElement);

}

/* ========================= */
/* NEW GAME */
/* ========================= */

function newGame(){

localStorage.removeItem("board");
localStorage.removeItem("score");

gameWon = false;

winModal.classList.add("hidden");
gameOverModal.classList.add("hidden");

board =
new Array(16).fill(0);

score = 0;

addRandomTile();
addRandomTile();

updateBoard();

saveGame();

}

/* ========================= */
/* RANDOM TILE */
/* ========================= */

function addRandomTile(){

const empty = [];

for(let i=0;i<board.length;i++){

if(board[i]===0){

empty.push(i);

}

}

if(empty.length===0) return;

const randomIndex =
empty[Math.floor(
Math.random()*empty.length
)];

board[randomIndex] =
Math.random()<0.9 ? 2 : 4;

}

/* ========================= */
/* TILE COLORS */
/* ========================= */

function updateTile(tile,value){

tile.innerText =
value===0 ? "" : value;

tile.setAttribute(
"data-value",
value
);

}

/* ========================= */
/* UPDATE UI */
/* ========================= */

function updateBoard(){

const tiles =
document.querySelectorAll(".tile");

board.forEach((value,index)=>{

updateTile(
tiles[index],
value
);

tiles[index]
.classList.add("move");

setTimeout(()=>{

tiles[index]
.classList.remove("move");

},120);

});

scoreDisplay.innerText =
score;

highScoreDisplay.innerText =
highScore;

highTileDisplay.innerText =
Math.max(...board);

saveGame();

checkWin();
checkGameOver();

}

/* ========================= */
/* SAVE */
/* ========================= */

function saveGame(){

localStorage.setItem(
"board",
JSON.stringify(board)
);

localStorage.setItem(
"score",
score
);

localStorage.setItem(
"highScore",
highScore
);

}

/* ========================= */
/* LOAD */
/* ========================= */

function loadGame(){

const savedBoard =
localStorage.getItem("board");

const savedScore =
localStorage.getItem("score");

if(savedBoard){

board =
JSON.parse(savedBoard);

score =
Number(savedScore)||0;

createBoard();

updateBoard();

}else{

createBoard();

newGame();

}

}

/* ========================= */
/* SCORE */
/* ========================= */

function updateHighScore(){

if(score>highScore){

highScore = score;

}

}

/* ========================= */
/* SLIDE LOGIC */
/* ========================= */

function slide(row){

row =
row.filter(v=>v!==0);

for(let i=0;i<row.length-1;i++){

if(row[i]===row[i+1]){

row[i] *= 2;

score += row[i];

playSound(
"mergeSound"
);

row[i+1] = 0;

}

}

row =
row.filter(v=>v!==0);

while(row.length<4){

row.push(0);

}

updateHighScore();

return row;

}

/* ========================= */
/* UNDO */
/* ========================= */

function saveUndo(){

previousBoard =
[...board];

previousScore =
score;

}

function undoMove(){

if(
previousBoard.length===0
) return;

board =
[...previousBoard];

score =
previousScore;

updateBoard();

}

/* ========================= */
/* ROTATE BOARD */
/* ========================= */

function rotateBoard(){

let newBoard=[];

for(let i=0;i<4;i++){

for(let j=3;j>=0;j--){

newBoard.push(
board[j*4+i]
);

}

}

board=newBoard;

}

/* ========================= */
/* MOVES */
/* ========================= */

function moveLeft(){

for(let i=0;i<4;i++){

let row=
board.slice(i*4,i*4+4);

row=slide(row);

board.splice(i*4,4,...row);

}

}

function moveRight(){

rotateBoard();
rotateBoard();

moveLeft();

rotateBoard();
rotateBoard();

}

function moveUp(){

rotateBoard();
rotateBoard();
rotateBoard();

moveLeft();

rotateBoard();

}

function moveDown(){

rotateBoard();

moveLeft();

rotateBoard();
rotateBoard();
rotateBoard();

}

/* ========================= */
/* HANDLE MOVE */
/* ========================= */

function handleMove(direction){

saveUndo();

const oldBoard=
JSON.stringify(board);

if(direction==="left")
moveLeft();

if(direction==="right")
moveRight();

if(direction==="up")
moveUp();

if(direction==="down")
moveDown();

if(
oldBoard!==JSON.stringify(board)
){

playSound(
"moveSound"
);

addRandomTile();

updateBoard();

}

}

/* ========================= */
/* KEYBOARD */
/* ========================= */

document.addEventListener(
"keydown",
(e)=>{

if(
gameOverModal.classList.contains("hidden")===false
)return;

switch(e.key){

case "ArrowLeft":
handleMove("left");
break;

case "ArrowRight":
handleMove("right");
break;

case "ArrowUp":
handleMove("up");
break;

case "ArrowDown":
handleMove("down");
break;

/* WASD */

case "a":
case "A":
handleMove("left");
break;

case "d":
case "D":
handleMove("right");
break;

case "w":
case "W":
handleMove("up");
break;

case "s":
case "S":
handleMove("down");
break;

}

}
);

/* ========================= */
/* MOBILE SWIPE */
/* ========================= */

gameArea.addEventListener(
"touchstart",
(e)=>{

startX=
e.touches[0].clientX;

startY=
e.touches[0].clientY;

},
{passive:true}
);

gameArea.addEventListener(
"touchend",
(e)=>{

let endX=
e.changedTouches[0].clientX;

let endY=
e.changedTouches[0].clientY;

let dx=endX-startX;
let dy=endY-startY;

let threshold=30;

if(
Math.abs(dx)>
Math.abs(dy)
){

if(dx>threshold)
handleMove("right");

else if(dx<-threshold)
handleMove("left");

}else{

if(dy>threshold)
handleMove("down");

else if(dy<-threshold)
handleMove("up");

}

},
{passive:true}
);

/* ========================= */
/* WIN CHECK */
/* ========================= */

function checkWin(){

if(gameWon) return;

if(board.includes(2048)){

gameWon=true;

playSound(
"winSound"
);

winModal
.classList
.remove("hidden");

}

}

function continueGame(){

winModal
.classList
.add("hidden");

}

/* ========================= */
/* GAME OVER CHECK */
/* ========================= */

function checkGameOver(){

if(board.includes(0))
return false;

/* horizontal */

for(let r=0;r<4;r++){

for(let c=0;c<3;c++){

let i=r*4+c;

if(
board[i]===
board[i+1]
){

return false;

}

}

}

/* vertical */

for(let c=0;c<4;c++){

for(let r=0;r<3;r++){

let i=r*4+c;

if(
board[i]===
board[i+4]
){

return false;

}

}

}

/* game over */

playSound(
"gameOverSound"
);

gameOverModal
.classList
.remove("hidden");

return true;

}

/* ========================= */
/* MODE SWITCH */
/* ========================= */

function switchMode(){

if(mode==="Single"){

mode="Multi";

}else{

mode="Single";

}

modeText.innerText=
mode;

/*
Multiplayer UI
future ready
*/

alert(
"⚡ Multiplayer UI Ready\n(Current build uses same board controls)"
);

}

/* ========================= */
/* DARK / LIGHT */
/* ========================= */

function toggleMode(){

document.body
.classList
.toggle("light-mode");

localStorage.setItem(
"theme",
document.body
.classList
.contains("light-mode")
?
"light"
:
"dark"
);

}

(function(){

const theme=
localStorage.getItem(
"theme"
);

if(theme==="light"){

document.body
.classList
.add("light-mode");

}

})();

/* ========================= */
/* PLAY AGAIN */
/* ========================= */

document
.querySelectorAll(
"#gameOverModal button"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

gameOverModal
.classList
.add("hidden");

}
);

});

/* ========================= */
/* START */
/* ========================= */

loadGame();
