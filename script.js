let currentPlayer = 1;
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

const questions = [
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

// Shuffle questions
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
let shuffledQuestions = shuffle(questions.slice());

// ----- Coin Flip Logic -----
coinButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.choice;
    const coinResult = Math.random() < 0.5 ? "Heads" : "Tails";
    coinResultDisplay.innerText = `Coin shows: ${coinResult}`;
    currentPlayer = (choice === coinResult) ? 1 : 2;

    setTimeout(() => {
      coinSection.style.display = 'none';
      gameBoard.style.display = 'grid';
      playerDisplay.style.display = 'block';
      playerDisplay.innerText = `Current Player: ${currentPlayer}`;
    }, 1000);
  });
});

// ----- Tile Flip Logic -----
tiles.forEach(tile => {
  tile.addEventListener('click', () => {
    if(tile.classList.contains('flipped')) return;

    tile.style.setProperty('--player-color', currentPlayer === 1 ? '#add8e6' : '#ffb6c1');
    tile.classList.add('flipped');

    const question = shuffledQuestions.shift();
    if(question){
      questionText.innerText = `Player ${currentPlayer}: ${question}`;
      modal.style.display = 'block';
      tile.dataset.answered = "true";
    }
  });
});

// ----- Submit Answer Logic -----
submitBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  answerInput.value = '';
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  playerDisplay.innerText = `Current Player: ${currentPlayer}`;
});
