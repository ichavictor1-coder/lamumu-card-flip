const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");
const muteBtn = document.getElementById("muteBtn");

const matchSound = document.getElementById("matchSound");
const failSound = document.getElementById("failSound");
const bgMusic = document.getElementById("bgMusic");
const bubbleSound = document.getElementById("bubbleSound");

const triesDisplay = document.getElementById("triesDisplay");
const winOverlay = document.getElementById("winOverlay");
const loseOverlay = document.getElementById("loseOverlay");
const restartBtn = document.getElementById("restartBtn"); // button inside loseOverlay
const restartBtnWin = document.getElementById("restartBtnWin"); // button inside winOverlay

let muted = false;
let tries = 10;
let lockBoard = false;

document.body.addEventListener(
  "click",
  () => {
    if (bgMusic.paused && !muted) {
      bgMusic.volume = 0.4;
      bgMusic.play();
    }
  },
  { once: true }
);

const lamumuImages = [
  "/images/kungfu.jpeg",
  "/images/cute.jpeg",
  "/images/Angel.jpeg",
  "/images/samurai.jpeg",
  "/images/vortex.jpeg",
  "/images/office.jpeg",
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;

function startGame() {
  gameBoard.innerHTML = "";
  message.textContent = "";
  flippedCards = [];
  matchedPairs = 0;
  tries = 10;
  triesDisplay.textContent = "Tries left: " + tries;
  winOverlay.classList.add("hidden");
  loseOverlay.classList.add("hidden");
  lockBoard = false;

  document.body.style.background =
    "url('/images/farm-bg.png') center/cover no-repeat fixed";

  cards = [...lamumuImages, ...lamumuImages];
  cards.sort(() => Math.random() - 0.5);

  cards.forEach((src) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    const frontImg = document.createElement("img");
    frontImg.src = "/images/cover.png";
    cardFront.appendChild(frontImg);

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    const img = document.createElement("img");
    img.src = src;
    cardBack.appendChild(img);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener("click", () => flipCard(card, src));
    gameBoard.appendChild(card);
  });

  introReveal();
}

function introReveal() {
  lockBoard = true;
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add("flipped");
      playSound(bubbleSound);
    }, i * 300);
  });
  setTimeout(() => {
    allCards.forEach((c) => c.classList.remove("flipped"));
    lockBoard = false;
  }, allCards.length * 300 + 1500);
}

function flipCard(card, src) {
  if (
    lockBoard ||
    flippedCards.length === 2 ||
    card.classList.contains("flipped")
  )
    return;

  card.classList.add("flipped");
  flippedCards.push({ card, src });

  if (flippedCards.length === 2) {
    lockBoard = true;
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.src === second.src) {
    // ✅ Matched
    first.card.classList.add("matched");
    second.card.classList.add("matched");
    playSound(matchSound);

    matchedPairs++;
    if (matchedPairs === lamumuImages.length) {
      // 🎉 Win
      winOverlay.classList.remove("hidden");
      message.textContent = "You Win! 🎉";
      launchConfetti();
      lockBoard = true;
    }
  } else {
    // ❌ Wrong → reduce tries
    tries--;
    triesDisplay.textContent = "Tries left: " + tries;

    playSound(failSound);
    first.card.classList.remove("flipped");
    second.card.classList.remove("flipped");

    if (tries <= 0) {
      // 🚨 Game Over
      loseOverlay.classList.remove("hidden");
      message.textContent = "Game Over! 😢";
      lockBoard = true;
    }
  }

  flippedCards = [];
  if (tries > 0 && matchedPairs < lamumuImages.length) {
    lockBoard = false;
  }
}

function launchConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.background = getRandomBrightColor();
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}

function getRandomBrightColor() {
  const colors = [
    "#ff6666",
    "#66ff66",
    "#ffff66",
    "#ff66ff",
    "#ffa500",
    "#ff1493",
    "#ff4500",
    "#ffd700",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function toggleMute() {
  muted = !muted;
  matchSound.muted = muted;
  failSound.muted = muted;
  bgMusic.muted = muted;
  bubbleSound.muted = muted;
  muteBtn.textContent = muted ? "🔇 Unmute" : "🔊 Mute";
}

function playSound(sound) {
  if (!muted) {
    sound.currentTime = 0;
    sound.play();
  }
}

// 🔄 Restart Buttons
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    startGame();
  });
}
if (restartBtnWin) {
  restartBtnWin.addEventListener("click", () => {
    startGame();
  });
}

startGame();
