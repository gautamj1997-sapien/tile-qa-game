let currentPlayer = 1;
let playerNames = ["Player 1", "Player 2"];
playerNames[0] = prompt("Enter name for Player 1:", "Player 1") || "Player 1";
playerNames[1] = prompt("Enter name for Player 2:", "Player 2") || "Player 2";

const playerDisplay = document.getElementById('current-player');
const tiles = document.querySelectorAll('.tile');
const modal = document.getElementById('question-modal');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-answer');

const coinButtons = document.querySelectorAll('.coin-choice');
const coinResultDisplay = document.getElementById('coin-result');
const coinSection = document.getElementById('coin-flip-section');
const gameBoard = document.getElementById('game-board');
const coin = document.getElementById('coin');

// ----- Questions -----
const originalQuestions = [
  "Which Tamil comedy scene always makes you laugh? 🤣",
  "If you could only use three emojis for the rest of the week, what would they would be? 😎🥲🤣",
  "Would you rather have unlimited popcorn 🍿 or unlimited ice cream 🍦 forever? Biryani irundirda atha sollirpinga, theriyum adaa options le vekale🤣",
  "What's the silliest thing you're scared about? Yenaku... ipo nadakrdella oru dream, sudden ah oru naal reality ku endrichutu, maths exam ku chemistry prepare panni vandirpeno🤣",
  "If you had a pet parrot 🦜, what’s the funniest thing you’d teach it to say?",
  "Ungaluku Kamal Hassan oda fav movie and dialoge enna😉",
  "What’s the weirdest food combo you actually enjoy? Rasam rice le curds antu erkanave solirkinga, try panle🤣.... apdiye innonu solinga",
  "What’s the funniest nickname you’ve ever had, school le ila naa college le😋?",
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
  "What kind of moment makes your heart race the most? 💣 Mostly with excitement, Yenaku, when I'm try or plan something to make someone feel good, avangluku epdi urruku antu paakradu rmba exciting ah irrukum",
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

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

let shuffledOriginal = shuffle(originalQuestions.slice());
let shuffledBackup = shuffle(backupQuestions.slice());

function getNextQuestion(){
  if(shuffledOriginal.length > 0) return shuffledOriginal.shift();
  if(shuffledBackup.length > 0) return shuffledBackup.shift();
  return null;
}

// ----- Coin Flip -----
coinButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.choice;
    coin.classList.add('flip');

    setTimeout(() => {
      coin.classList.remove('flip');
      const coinResult = Math.random() < 0.5 ? "Heads" : "Tails";
      coinResultDisplay.innerText = `Coin shows: ${coinResult}`;
      currentPlayer = (choice === coinResult) ? 0 : 1;

      // Display winner text
      playerDisplay.style.display = 'block';
      playerDisplay.innerText = `${playerNames[currentPlayer]} has won the toss!`;

      setTimeout(() => {
        coinSection.style.display = 'none';
        gameBoard.style.display = 'grid';
        playerDisplay.innerText = `Current Player: ${playerNames[currentPlayer]}`;
      }, 2000);

    }, 2000);
  });
});

// ----- Tile Flip -----
tiles.forEach(tile => {
  tile.addEventListener('click', () => {
    if(tile.classList.contains('flipped')) return;

    tile.style.setProperty('--player-color', currentPlayer === 0 ? '#add8e6' : '#ffb6c1');
    tile.classList.add('flipped');

    const question = getNextQuestion();
    if(question){
      questionText.innerText = `${playerNames[currentPlayer]}: ${question}`;
      modal.style.display = 'block';
      tile.dataset.answered = "true";
      tile.innerText = playerNames[currentPlayer][0]; // show first initial
    } else {
      questionText.innerText = "No more questions left!";
      modal.style.display = 'block';
    }
  });
});

// ----- Submit Answer -----
submitBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  answerInput.value = '';

  // Trigger confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Switch player
  currentPlayer = currentPlayer === 0 ? 1 : 0;
  playerDisplay.innerText = `Current Player: ${playerNames[currentPlayer]}`;
});
