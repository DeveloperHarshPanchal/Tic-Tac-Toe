const wrapper = document.querySelector(".wrapper");

const ticTacToe = document.querySelector(".tic-tac-toe");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".new-game");
const resetBtn = document.querySelector(".reset");
const muteBtn = document.querySelector(".mute-btn");

const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");
const bgMusic = document.getElementById("bg-music");

let currentPlayer;
let gameGrid = [];
let gameStarted = false;
let musicMuted = false;
let bgMusicStarted = false;
let dancingGif; // global reference to keep GIF persistent

const winningPositions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Create grid dynamically
function createGrid() {
  ticTacToe.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const box = document.createElement("div");
    box.classList.add("box");
    ticTacToe.appendChild(box);
  }
}

// Initialize game
function initGame() {
  // Remove dancing GIF if exists
  if (dancingGif) {
    dancingGif.remove();
    dancingGif = null;
  }

  createGrid();
  currentPlayer = "X";
  gameGrid = Array(9).fill("");
  const boxes = document.querySelectorAll(".box");
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => handleClick(index));
    box.classList.remove("x", "o", "win", "clicked");
    box.style.pointerEvents = "all";
  });
  gameInfo.innerText = `Current Player - ${currentPlayer}`;
  gameStarted = false;
  if (!musicMuted && bgMusicStarted)
    bgMusic.play().catch((e) => console.log("Autoplay blocked"));
}

// Handle box click
function handleClick(index) {
  const boxes = document.querySelectorAll(".box");

  // Start game & stop initial bgMusic if necessary
  if (!gameStarted) {
    gameStarted = true;
    if (!musicMuted && !bgMusicStarted) {
      bgMusic.play().catch((e) => console.log("Autoplay blocked"));
      bgMusicStarted = true;
    } else {
      bgMusic.pause();
    }
  }

  if (gameGrid[index] === "") {
    gameGrid[index] = currentPlayer;
    boxes[index].innerText = currentPlayer;
    boxes[index].classList.add(currentPlayer.toLowerCase(), "clicked");
    boxes[index].style.pointerEvents = "none";
    clickSound.play();
    setTimeout(() => boxes[index].classList.remove("clicked"), 200);
    if (checkWin()) return;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameInfo.innerText = `Current Player - ${currentPlayer}`;
  }
}

// Check win/tie
function checkWin() {
  const boxes = document.querySelectorAll(".box");
  let winner = "";
  winningPositions.forEach((pos) => {
    if (
      gameGrid[pos[0]] !== "" &&
      gameGrid[pos[0]] === gameGrid[pos[1]] &&
      gameGrid[pos[1]] === gameGrid[pos[2]]
    ) {
      winner = gameGrid[pos[0]];
      pos.forEach((i) => boxes[i].classList.add("win"));
      boxes.forEach((box) => (box.style.pointerEvents = "none"));
    }
  });
  if (winner !== "") {
    gameInfo.innerText = `Winner Player - ${winner} 🎉`;
    winSound.play();
    showDancingGif();
    return true;
  }
  if (gameGrid.filter((v) => v !== "").length === 9) {
    gameInfo.innerText = "Game Tied 😮";
    return true;
  }
  return false;
}

// Show dancing GIF that persists until reset/new game
function showDancingGif() {
  if (dancingGif) return; // Already exists

  dancingGif = document.createElement("img");
  dancingGif.src = "assets/excited.gif"; // replace with your GIF path
  dancingGif.style.position = "absolute";
  dancingGif.style.top = "50%";
  dancingGif.style.left = "50%";
  dancingGif.style.transform = "translate(-50%, -50%)";
  dancingGif.style.width = "150px";
  dancingGif.style.height = "150px";
  dancingGif.style.animation = "dance 1s infinite alternate";
  wrapper.appendChild(dancingGif);
}

// Mute/unmute background music
muteBtn.addEventListener("click", () => {
  musicMuted = !musicMuted;
  if (musicMuted) bgMusic.pause();
  else if (!gameStarted)
    bgMusic.play().catch((e) => console.log("Autoplay blocked"));
});

// Play background music on first click anywhere
window.addEventListener(
  "click",
  () => {
    if (!bgMusicStarted && !musicMuted) {
      bgMusic.play().catch((e) => console.log("Autoplay blocked"));
      bgMusicStarted = true;
    }
  },
  { once: true }
);

// Button events
newGameBtn.addEventListener("click", initGame);
resetBtn.addEventListener("click", initGame);

// Initialize game on page load
initGame();
