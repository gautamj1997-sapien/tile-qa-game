// --- Elements ---
const playerDisplay = document.getElementById('player-display');
const gameBoard = document.getElementById('game-board');
const modal = document.getElementById('modal');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const coinSection = document.getElementById('coin-section');
const coinButtons = document.querySelectorAll('.coin-btn');
const coinResultDisplay = document.getElementById('coin-result');
const spinModal = document.getElementById('spin-modal');
const spinText = document.getElementById('spin-text');
const spinAnimation = document.getElementById('spin-animation');
const continueBtn = document.getElementById('continue-game');
const startBtn = document.getElementById('start-game');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');

// --- Players ---
let playerNames = ["Player 1","Player 2"];
let currentPlayer = 0;

// --- Questions ---
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
  "Do you prefer to express feelings through words 🎤, actions 🤝, or silence 🌙?",
  "If your love story was a Tamil movie, what would the title be? 🎬💕",
  "What’s the sweetest thing you think I've observed or told you that made you feel special, even a little bit🫣?",
  "If I was a character in your life’s movie, what role would I play? 😉",
  "Enna nenakringa, do you think soulmates are destined, or do we create them?",
  "What’s one thing you dream of doing with someone special someday? 🌌",
  "What kind of moment makes your heart race the most? 💣",
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

function shuffle(array) { return array.sort(() => Math.random() - 0.5); }
let shuffledOriginal = shuffle(originalQuestions.slice());
let shuffledBackup = shuffle(backupQuestions.slice());

function getNextQuestion(){
  if(shuffledOriginal.length > 0) return shuffledOriginal.shift();
  if(shuffledBackup.length > 0) return shuffledBackup.shift();
  return null;
}

// --- Start Game ---
startBtn.addEventListener('click', () => {
  if(player1Input.value) playerNames[0] = player1Input.value;
  if(player2Input.value) playerNames[1] = player2Input.value;

  document.getElementById('name-section').style.display = 'none';
  coinSection.style.display = 'block';
});

// --- Coin Toss ---
coinButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.choice;
    const coinResult = Math.random() < 0.5 ? "Heads" : "Tails";
    coinResultDisplay.innerText = `Coin shows: ${coinResult}`;
    currentPlayer = (choice === coinResult) ? 0 : 1;

    playerDisplay.style.display = 'block';
    playerDisplay.innerText = `${playerNames[currentPlayer]} has won the toss!`;

    setTimeout(() => {
      coinSection.style.display = 'none';
      gameBoard.style.display = 'grid';
      playerDisplay.innerText = `Current Player: ${playerNames[currentPlayer]}`;
      createTiles(16);
    }, 2000);
  });
});

// --- Create Tiles ---
let tiles = [];
function createTiles(num){
  for(let i=0;i<num;i++){
    let tile = document.createElement('div');
    tile.classList.add('tile');
    gameBoard.appendChild(tile);
    tiles.push(tile);
  }
}

// --- Game Logic ---
let turnCounter = 0;

tiles.forEach(tile => {
  tile.addEventListener('click', () => {
    if(tile.classList.contains('flipped')) return;

    // If it's a spin turn, ignore tile click
    if(turnCounter !== 0 && turnCounter % 4 === 0) return;

    // Normal tile flip
    tile.classList.add('flipped');
    tile.style.setProperty('--player-color', currentPlayer === 0 ? '#add8e6' : '#ffb6c1');
    tile.innerHTML = `<span>${playerNames[currentPlayer][0]}</span>`;

    const question = getNextQuestion();
    if(question){
      questionText.innerText = `${playerNames[currentPlayer]}: ${question}`;
      modal.style.display = 'block';
    }

    turnCounter++;
  });
});

// --- Submit Answer ---
submitBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  answerInput.value = '';

  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

  currentPlayer = currentPlayer === 0 ? 1 : 0;
  playerDisplay.innerText = `Current Player: ${playerNames[currentPlayer]}`;

  // Automatically show end message if all questions are answered
  if(shuffledOriginal.length === 0 && shuffledBackup.length === 0){
    setTimeout(showEndGameMessage, 500);
  }
});

// --- Continue after Spin ---
continueBtn.addEventListener('click', () => {
  spinModal.style.display = 'none';
  continueBtn.style.display = 'none';
  currentPlayer = currentPlayer === 0 ? 1 : 0;
  playerDisplay.innerText = `Current Player: ${playerNames[currentPlayer]}`;
});

// --- End Game Cheeky Message ---
function showEndGameMessage() {
  playerDisplay.innerText = "You are getting dangerously close! ❤️✨";
  playerDisplay.style.transition = "transform 0.5s";
  playerDisplay.style.transform = "scale(1.3)";
  setTimeout(() => { playerDisplay.style.transform = "scale(1)"; }, 500);

  let duration = 5000;
  let end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: Math.random(), y: Math.random()*0.6 } });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: Math.random(), y: Math.random()*0.6 } });
    if(Date.now() < end) requestAnimationFrame(frame);
  }());
}
