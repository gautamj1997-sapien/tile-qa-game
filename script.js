// Players
let playerNames = ["Player 1","Player 2"];
let currentPlayer = 0;

// Questions sample (replace with all 27 + 10 backup later)
const questions = [
  "Which Tamil comedy scene always makes you laugh? 🤣",
  "If you could only use three emojis for the rest of the week, what would they be? 😎🥲🤣",
  "Would you rather have unlimited popcorn 🍿 or unlimited ice cream 🍦?"
];

// State
let usedQuestions = [];
const totalTiles = 9;

const startBtn = document.getElementById("start-game");
const gameBoard = document.getElementById("game-board");
const nameSection = document.getElementById("name-section");
const playerDisplay = document.getElementById("player-display");
const modal = document.getElementById("modal");
const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const submitAnswerBtn = document.getElementById("submit-answer");
const playAgainBtn = document.getElementById("play-again");

// Start game
startBtn.addEventListener("click", ()=>{
    const n1 = document.getElementById("player1-name").value.trim();
    const n2 = document.getElementById("player2-name").value.trim();
    if(n1) playerNames[0] = n1;
    if(n2) playerNames[1] = n2;

    nameSection.classList.add("hidden");
    gameBoard.classList.remove("hidden");
    playerDisplay.classList.remove("hidden");
    playerDisplay.innerText = `${playerNames[currentPlayer]}'s turn`;
    createTiles(totalTiles);
});

// Create tiles
function createTiles(count){
    gameBoard.innerHTML = "";
    for(let i=0;i<count;i++){
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.index = i;
        tile.addEventListener("click", onTileClick);
        gameBoard.appendChild(tile);
    }
}

// Tile click
function onTileClick(e){
    const tile = e.currentTarget;
    if(tile.classList.contains("flipped")) return;

    tile.classList.add("flipped");
    tile.style.background = currentPlayer===0? "var(--p1)" : "var(--p2)";
    tile.innerHTML = playerNames[currentPlayer][0].toUpperCase();

    const q = questions.find(q=> !usedQuestions.includes(q));
    if(q){
        usedQuestions.push(q);
        questionText.innerText = `${playerNames[currentPlayer]}: ${q}`;
        modal.classList.remove("hidden");
    } else {
        alert("No more questions!");
    }
}

// Submit answer
submitAnswerBtn.addEventListener("click", ()=>{
    modal.classList.add("hidden");
    currentPlayer = currentPlayer===0?1:0;
    playerDisplay.innerText = `${playerNames[currentPlayer]}'s turn`;
});

// Play again
playAgainBtn.addEventListener("click", ()=>{
    location.reload();
});
