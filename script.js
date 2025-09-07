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
let currentPlayer = 0;

///// Questions /////
const originalQuestions = [
  "Which Tamil comedy scene always makes you laugh? 🤣",
  "If you could only use three emojis for the rest of the week, what would they would be? 😎🥲🤣",
  "Would you rather have unlimited popcorn 🍿 or unlimited ice cream 🍦 forever? Biryani irundirda atha sollirpinga, theriyum adaa options le vekale🤣",
  "What's the silliest thing you're scared about? Yenaku... ipo nadakrdella oru dream, sudden ah oru naal reality ku endrichutu, maths exam ku chemistry prepare panni vandirpeno🤣",
  "If you had a pet parrot 🦜, what’s the funniest thing you’d teach it to say?",
  "Ungaluku Kamal hassan oda fav movie and dialoge enna😉",
  "What’s the weirdest food combo you actually enjoy? Rasam rice le curds antu erkanave solirkinga, try panle🤣.... apdiye innonu solinga",
  "What’s the funniest nickname you’ve ever had, school le ila naa college le😋 ?",
  "What song do you ALWAYS sing when no one’s listening? Pudicha song antu vechikla, something you'd sing or go back to listening when you're bored🎤",
  "Would you rather pick midnight bike/car ride 🚲 or a beach walk 🌊? I love both, suprha irukum. You can only choose one",
  "If you could swap lives with a Tamil movie character for one day, who would it be and why? Ideyu solirkinga, innoru thadave sollunga, why is more important",
  "What’s the most random talent or trick you have? 🤹 Inda train station le announcements ila phone le engaged/not reachable/not answering messages la nallu theriyum😅",
  "What’s the most adventurous thing you’ve done? River rafting tha🤧, yen katha anniki mudinchi antu nenache",
  "If you were in Bigg Boss house, how long would you survive?",
  "What’s one childhood memory that shaped who you are today? Neenga rmba feel panra oru moment, could happy or sad",
  "Neenga past ku poy oru naal marbdyu re-live panra vaypu kadacha, which day would it be?",
  "What instantly makes you feel calm and safe? 🌸 specifically that i need to know",
  "What’s something small that gives you big happiness? Chinna chinna vishyangal tha but makes you happy / just smile😍",
  "Who in your life has inspired you the most, and why? Idu yenaku theriyum nenkre, let's see if you'll surprise😁",
  "If you could go back in time and meet your younger self, avangluku enna solla virbvinga?",
  "Do you prefer to express feelings through words 🎤, actions 🤝, or silence 🌙? Idaa rmba suspence ah iruku",
  "If your love story was a Tamil movie, what would the title be? 🎬💕",
  "What’s the sweetest thing you think I've observed or told you that made you feel special, even a little bit🫣?",
  "If I was a character in your life’s movie, what role would I play? 😉 Now this could be one of the questions I don't think I'm ready for the answer ana solunga plsss 🙏",
  "Enna nenakringa, do you think soulmates are destined, or do we create them?",
  "What’s one thing you dream of doing with someone special someday? 🌌, ungloda special moment with your person",
  "What kind of moment makes your heart race the most? 💣Mostly with excitement, Yenaku, when I'm try or plan something to make someone feel good, avangluku epdi urruku antu paakradu rmba exciting ah irrukum",
  "If the emotions you're feeling right now had a color, what color would yours be right now?"
];

const backupQuestions = [
  "What was your most mischievous act as a kid that you never got caught for? 😏",
  "Which cartoon or show could you watch endlessly as a child?",
  "Did you ever try to invent a “superpower” or a crazy gadget when you were little?",
  "What’s the funniest excuse you gave to avoid homework? 📚😂",
  "Which childhood snack do you secretly still miss?",
  "Would you rather plan a surprise adventure for someone or just let it happen naturally? 🗺️",
  "What’s your go-to move to make someone laugh instantly? 🤪",
  "If you were a romantic comedy character, what would be your quirkiest trait?",
  "Do you prefer long walks and talks or fun, spontaneous mini-adventures on a first hangout? 🚶‍♀️🎢",
  "Which emoji best represents your flirting style? 😎🥰🤭"
];

///// Helpers /////
function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }

const STORAGE_KEY = 'lastSessionQuestions_v1';
function readLastSessionQuestions(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch(e){ return []; }
}
function saveThisSessionQuestions(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const lastSession = readLastSessionQuestions();
const availableOriginals = originalQuestions.filter(q => !lastSession.includes(q));
let shuffledOriginal = shuffle(availableOriginals.slice());
let shuffledBackup = shuffle(backupQuestions.slice());
let usedThisSession = [];

let tiles = [];
let turnCount = 0;

///// Create 3×3 grid /////
function createTiles(){
  const count = 9;
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
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 60,
      origin: { x: Math.random(), y: Math.random() * 0.6 }
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 60,
      origin: { x: Math.random(), y: Math.random() * 0.6 }
    });
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
  if(q){ showModalWithQuestion(`${playerNames[currentPlayer]}: ${q}`); }
  else { showModalWithQuestion('No more questions left!'); }
}

///// Answer submit /////
submitAnswerBtn.addEventListener('click', ()=>{
  hideModal();
  confettiBurst();
  turnCount++;
  currentPlayer = (currentPlayer === 0) ? 1 : 0;
  playerDisplay.style.display = 'block';
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
        createTiles();
      }, 2000);
    }, 2000);
  }, 100);
}

///// Start button /////
startBtn.addEventListener('click', ()=>{
  const n1 = player1Input.value.trim();
  const n2 = player2Input.value.trim();
  if(n1) playerNames[0] = n1;
  if(n2) playerNames[1] = n2;
  document.getElementById('name-section').style.display = 'none';
  coinSection.style.display = 'block';
});

coinBtns.forEach(btn => {
  btn.addEventListener('click', ()=>{
    const choice = btn.dataset.choice;
    performCoinFlip(choice);
  });
});
