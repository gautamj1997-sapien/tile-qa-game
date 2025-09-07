/* script.js
 Full implementation:
 - 27 original questions (from the user's list)
 - 10 backup questions (5 childhood + 5 platonic/romantic)
 - 3x3 grid (9 tiles)
 - mirrored initials (works on mobile)
 - pop + flip animation
 - coin flip (2s animation) + 2s reveal
 - confetti on submit, fireworks at end
 - no repeats within session; exclude previous session via localStorage
 - Play Again button
*/

// -------------------- Elements --------------------
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-game');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');

const coinSection = document.getElementById('coin-section');
const coinBtns = document.querySelectorAll('.coin-btn');
const coinAnim = document.getElementById('coin-anim');
const coinResult = document.getElementById('coin-result');

const gameSection = document.getElementById('game-section');
const playerDisplay = document.getElementById('player-display');
const gameBoard = document.getElementById('game-board');

const modal = document.getElementById('modal');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitAnswerBtn = document.getElementById('submit-answer');

const endScreen = document.getElementById('end-screen');
const endMessage = document.getElementById('end-message');
const playAgainBtn = document.getElementById('play-again');
const fireworksCanvas = document.getElementById('fireworks');

// -------------------- Game data --------------------
let playerNames = ['Player 1', 'Player 2'];
let currentPlayer = 0;
let tiles = [];
let questionsThisSession = []; // the 9 chosen questions for the board
let usedThisSession = []; // track which questions have been shown (and saved at end)
const STORAGE_KEY = 'lastSessionQuestions_v1';

// Full 27 original questions (verbatim from user)
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

// 10 backups (5 childhood + 5 platonic/romantic)
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

// -------------------- Helpers --------------------
function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }
function readLastSession(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e){ return []; } }
function saveLastSession(list){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch(e){} }

// -------------------- Flow --------------------
// Start button: read names, hide start, show coin toss
startBtn.addEventListener('click', () => {
  const p1 = player1Input.value.trim();
  const p2 = player2Input.value.trim();
  if(p1) playerNames[0] = p1;
  if(p2) playerNames[1] = p2;
  startScreen.classList.add('hidden');
  coinSection.classList.remove('hidden');
});

// coin buttons handler (players pick heads/tails)
coinBtns.forEach(btn=>{
  btn.addEventListener('click', () => {
    const pick = btn.dataset.choice;
    // show coin spin animation for 2s
    coinAnim.style.transform = 'rotate(0deg)';
    coinAnim.style.opacity = '1';
    coinAnim.style.transition = 'transform 2s ease-in-out';
    setTimeout(()=> {
      const angle = 720 + Math.floor(Math.random()*360);
      coinAnim.style.transform = `rotate(${angle}deg)`;
    }, 50);

    // after 2s reveal result and winner for 2s
    setTimeout(()=>{
      const flip = Math.random() < 0.5 ? 'Heads' : 'Tails';
      currentPlayer = (pick === flip) ? 0 : 1;
      coinResult.textContent = `Coin shows: ${flip} — ${playerNames[currentPlayer]} won the toss!`;
      // 2 second reveal then move to board
      setTimeout(()=>{
        coinSection.classList.add('hidden');
        openGameBoard();
      }, 2000);
    }, 2000);
  });
});

// Build the 3x3 board and choose questions
function openGameBoard(){
  gameSection.classList.remove('hidden');
  playerDisplay.textContent = `Current Player: ${playerNames[currentPlayer]}`;
  // Build question pool excluding last session's questions
  const last = readLastSession();
  let pool = originalQuestions.filter(q => !last.includes(q));
  // If pool smaller than 9, top up with backups (we do not include last-session originals)
  pool = shuffle(pool);
  let chosen = pool.slice(0,9);
  if(chosen.length < 9){
    const extra = shuffle(backupQuestions.filter(q => !chosen.includes(q)));
    chosen = chosen.concat(extra.slice(0, 9 - chosen.length));
  }
  // final shuffle for board randomness
  questionsThisSession = shuffle(chosen.slice(0,9));
  usedThisSession = [];

  // Render 9 tiles
  gameBoard.innerHTML = '';
  tiles = [];
  for(let i=0;i<9;i++){
    const tile = document.createElement('div');
    tile.className = 'tile';
    // inner structure for 3D flip
    const inner = document.createElement('div');
    inner.className = 'tile-inner';
    const front = document.createElement('div');
    front.className = 'tile-face tile-front';
    front.textContent = i+1;
    const back = document.createElement('div');
    back.className = 'tile-face tile-back';
    back.innerHTML = '?';
    inner.appendChild(front);
    inner.appendChild(back);
    tile.appendChild(inner);
    gameBoard.appendChild(tile);
    tiles.push({tile, inner, front, back, question: questionsThisSession[i], flipped:false});
    // click handler
    tile.addEventListener('click', ()=> onTileClick(i));
  }
}

// on tile click: flip, show mirrored initials, show question modal
function onTileClick(index){
  const t = tiles[index];
  if(t.flipped) return;
  t.flipped = true;
  // add flip & pop classes
  t.tile.classList.add('flipped');
  t.tile.classList.add('pop');
// set back face to mirrored initials (two mirrored glyphs for fun)
  const initial = (playerNames[currentPlayer]||'P').trim()[0].toUpperCase();
  // place two mirrored initials (one normal, one mirrored) so it looks mirrored across device sizes
  t.back.innerHTML = `<span class="initial">${initial}</span><span class="initial mirror">${initial}</span>`;


// assign color based on current player
  tile.style.background = (currentPlayer === 0) ? 'var(--p1)' : 'var(--p2)';
  // remove pop after short time so pop can re-trigger if needed visually
  setTimeout(()=> t.tile.classList.remove('pop'), 450);

  // Show modal with question after flip animation completes (600ms)
  setTimeout(()=>{
    showQuestionModal(t.question, index);
  }, 600);
}

function showQuestionModal(question, tileIndex){
  questionText.textContent = `${playerNames[currentPlayer]}: ${question}`;
  answerInput.value = '';
  modal.classList.remove('hidden');
  answerInput.focus();

  submitAnswerBtn.onclick = () => {
    // when submit pressed
    modal.classList.add('hidden');
    // confetti burst
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    usedThisSession.push(tiles[tileIndex].question);
    // switch player
    currentPlayer = (currentPlayer === 0) ? 1 : 0;
    playerDisplay.textContent = `Current Player: ${playerNames[currentPlayer]}`;
    // check end: if all tiles flipped or questions exhausted
    const allFlipped = tiles.every(t => t.flipped);
    const allQuestionsUsed = (usedThisSession.length >= 9) && (tiles.every(t=>t.flipped));
    if(allFlipped || usedThisSession.length >= 9){
      // small delay then show final
      setTimeout(showEndGame, 600);
    }
  };
}

// show end: fireworks + cheeky message + save usedThisSession to localStorage
function showEndGame(){
  gameSection.classList.add('hidden');
  endScreen.classList.remove('hidden');
  endMessage.textContent = `You are getting dangerously close! ✨`;
  // fireworks style bursts
  fireworksStart();
  // store the questions used this session into localStorage (so next session excludes them)
  saveLastSession(usedThisSession.slice(0,9));
}

// fireworks (simple repeated confetti bursts)
let fireworksInterval = null;
function fireworksStart(){
  // ensure canvas size
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
  // repeated bursts
  fireworksInterval = setInterval(() => {
    confetti({
      particleCount: 12,
      spread: 60,
      startVelocity: 30,
      origin: { x: Math.random(), y: Math.random()*0.5 },
      scalar: 1.0
    });
  }, 700);
  // stop after 5s
  setTimeout(()=> {
    if(fireworksInterval) clearInterval(fireworksInterval);
  }, 5000);
}

// Play again resets board but keeps player names; coin toss again
playAgainBtn.addEventListener('click', ()=>{
  // hide end screen
  endScreen.classList.add('hidden');
  // show coin toss again to decide starter
  coinSection.classList.remove('hidden');
  // hide game section until toss resolves
  gameSection.classList.add('hidden');
  // clear usedThisSession (we've already saved lastSession)
  usedThisSession = [];
  // reset tiles
  tiles = [];
});

// On page load: nothing fancy, read last session to console
(function init(){
  const last = readLastSession();
  if(last && last.length){
    console.info(`Excluding ${last.length} questions used in last session.`);
  }
})();
