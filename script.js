///// Elements /////
const startBtn = document.getElementById('start-game');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');
const coinSection = document.getElementById('coin-section');
const coinBtns = document.querySelectorAll('.coin-btn');
const coinAnim = document.getElementById('coin-anim');
const coinResult = document.getElementById('coin-result');
const playerDisplay = document.getElementById('player-display');
const gameBoard = document.getElementById('game-board');
const modal = document.getElementById('modal');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitAnswerBtn = document.getElementById('submit-answer');

///// Players /////
let playerNames = ['Player 1','Player 2'];
let currentPlayer = 0; // 0 or 1

///// Questions (shortened for demo – replace with full set) /////
const originalQuestions = [
  "Which Tamil comedy scene always makes you laugh? 🤣",
  "If you could only use three emojis for the rest of the week, what would they be? 😎🥲🤣",
  "Would you rather have unlimited popcorn 🍿 or unlimited ice cream 🍦 forever?",
  "What’s the silliest thing you’re scared about?",
  "If you had a pet parrot 🦜, what’s the funniest thing you’d teach it to say?",
  "Ungaluku Kamal hassan oda fav movie and dialoge enna😉",
  "What’s the weirdest food combo you actually enjoy?",
  "What’s the funniest nickname you’ve ever had?",
  "What song do you ALWAYS sing when no one’s listening? 🎤"
];

const backupQuestions = [
  "What was your most mischievous act as a kid? 😏",
  "Which cartoon did you watch endlessly?",
  "Funniest excuse to avoid homework? 📚😂",
  "Which childhood snack do you still miss?",
  "Would you rather plan surprises or go with the flow?",
  "What’s your go-to move to make someone laugh?",
  "If you were in a rom-com, what would be your quirkiest trait?",
  "Long walks & talks or spontaneous mini-adventures? 🚶‍♀️🎢",
  "Which emoji best represents your flirting style? 😎🥰🤭",
  "What silly dream did you believe as a kid?"
];

function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }

///// Session storage to avoid repeats across sessions /////
const STORAGE_KEY = 'lastSessionQuestions_v1';
function readLastSessionQuestions(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    return JSON.parse(raw);
  }catch(e){ return []; }
}
function saveThisSessionQuestions(list){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  catch(e){ /* ignore */ }
}

const lastSession = readLastSessionQuestions();
const availableOriginals = originalQuestions.filter(q => !lastSession.includes(q));
let shuffledOriginal = shuffle(availableOriginals.slice());
let shuffledBackup = shuffle(backupQuestions.slice());
let usedThisSession = [];

///// Game state /////
let tiles = [];
let turnCount = 0;

///// Create 3×3 grid /////
function createTiles(count=9){
  gameBoard.innerHTML = '';
  tiles = [];
  for(let i=0;i<count;i++){
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.index = i;
    tiles.push(tile);
    gameBoard.appendChild(tile);
  }
  tiles.forEach(tile => tile.addEventListener('click', onTileClick));
}

///// Get next question /////
function getNextQuestion(){
  if(shuffledOriginal.length > 0){
    const q = shuffledOriginal.shift();
    usedThisSession.push(q);
    return q;
  }
  if(shuffledBackup.length > 0){
    const q = shuffledBackup.shift();
    usedThisSession.push(q);
    return q;
  }
  return null;
}

function showModalWithQuestion(text){
  questionText.innerText = text;
  answerInput.value = '';
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
  answerInput.focus();
}
function hideModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
}

function confettiBurst(){
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }});
}
function fireworks(duration = 4500){
  const end = Date.now() + duration;
  (function frame(){
    confetti({ particleCount: 7, angle: 60, spread: 60, origin: { x: Math.random(), y: Math.random()*0.6 }});
    confetti({ particleCount: 7, angle: 120, spread: 60, origin: { x: Math.random(), y: Math.random()*0.6 }});
    if(Date.now() < end) requestAnimationFrame(frame);
  })();
}
function showEndGame(){
  playerDisplay.innerText = `You are getting dangerously close! ✨`;
  fireworks(5000);
  saveThisSessionQuestions(usedThisSession.slice());
}

///// Tile click /////
function onTileClick(e){
  const tile = e.currentTarget;
  if(tile.classList.contains('flipped')) return;

  tile.classList.add('flipped','pop');
  tile.style.background = (currentPlayer === 0) ? 'var(--player1)' : 'var(--player2)';
  const initial = (playerNames[currentPlayer] && playerNames[currentPlayer].trim().length>0)
    ? playerNames[currentPlayer].trim()[0].toUpperCase()
    : (currentPlayer===0 ? 'P' : 'Q');
  tile.innerHTML = `<span class="initial">${initial}</span>`;
  setTimeout(()=> tile.classList.remove('pop'), 450);

  const q = getNextQuestion();
  if(q){
    showModalWithQuestion(`${playerNames[currentPlayer]}: ${q}`);
  } else {
    showModalWithQuestion('No more questions left!');
  }
}

///// Submit answer /////
submitAnswerBtn.addEventListener('click', ()=>{
  hideModal();
  confettiBurst();
  turnCount++;
  currentPlayer = (currentPlayer === 0) ? 1 : 0;
  playerDisplay.innerText = `Current Player: ${playerNames[currentPlayer]}`;
  if(shuffledOriginal.length === 0 && shuffledBackup.length === 0){
    setTimeout(showEndGame, 500);
  }
});

///// Coin toss /////
function performCoinFlip(choice){
  coinAnim.style.opacity = '1';
  coinAnim.style.transform = 'rotate(0deg)';
  coinResult.innerText = 'Flipping the coin...';
  setTimeout(()=>{
    const rand = 720 + Math.floor(Math.random()*360);
    coinAnim.style.transform = `rotate(${rand}deg)`;
    setTimeout(()=>{
      const coinResultSide = (Math.random() < 0.5) ? 'Heads' : 'Tails';
      const winnerIndex = (choice === coinResultSide) ? 0 : 1;
      currentPlayer = winnerIndex;
      coinResult.innerText = `Coin shows: ${coinResultSide}\n${playerNames[currentPlayer]} won the toss!`;
      setTimeout(()=>{
        coinSection.style.display = 'none';
        gameBoard.style.display = 'grid';
        playerDisplay.style.display = 'block';
        playerDisplay.innerText = `Current Player: ${playerNames[currentPlayer]}`;
        createTiles(9);
      }, 2000);
    }, 2000);
  }, 100);
}

startBtn.addEventListener('click', ()=>{
  const n1 = player1Input.value.trim();
  const n2 = player2Input.value.trim();
  if(n1) playerNames[0] = n1;
  if(n2) playerNames[1] = n2;
  document.getElementById('name-section').style.display = 'none';
  coinSection.style.display = 'block';
});
coinBtns.forEach(btn => {
  btn.addEventListener('click', ()=> performCoinFlip(btn.dataset.choice));
});

(function initOnLoad(){
  const last = readLastSessionQuestions();
  if(last && last.length>0){
    console.info(`Excluded ${last.length} questions from last session.`);
  }
})();
