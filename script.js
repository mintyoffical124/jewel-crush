// script.js

// DOM Elements
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

// Game Settings
const GRID_SIZE = 8;
const jewelColors = ['red', 'green', 'blue', 'yellow', 'purple'];
let grid = [];
let score = 0;
let firstSelected = null;

// Create the grid and initialize jewels
function createGrid() {
  grid = [];
  gameBoard.innerHTML = '';

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const color = jewelColors[Math.floor(Math.random() * jewelColors.length)];
    const jewel = document.createElement('div');
    jewel.classList.add('jewel', color);
    jewel.dataset.id = i;

    jewel.addEventListener('click', () => selectJewel(jewel));
    gameBoard.appendChild(jewel);
    grid.push(color);
  }
}

// Swap two jewels
function swapJewels(id1, id2) {
  const temp = grid[id1];
  grid[id1] = grid[id2];
  grid[id2] = temp;

  const jewel1 = document.querySelector(`.jewel[data-id="${id1}"]`);
  const jewel2 = document.querySelector(`.jewel[data-id="${id2}"]`);
  jewel1.className = `jewel ${grid[id1]}`;
  jewel2.className = `jewel ${grid[id2]}`;
}

// Select and swap jewels
function selectJewel(jewel) {
  if (!firstSelected) {
    firstSelected = jewel;
    jewel.style.border = '2px solid #fff';
  } else {
    const id1 = parseInt(firstSelected.dataset.id);
    const id2 = parseInt(jewel.dataset.id);
    firstSelected.style.border = 'none';
    firstSelected = null;

    // Check if the jewels are adjacent
    if (isAdjacent(id1, id2)) {
      swapJewels(id1, id2);
      if (!checkMatches()) {
        // Swap back if no match is found
        setTimeout(() => swapJewels(id1, id2), 500);
      }
    }
  }
}

// Check if two jewels are adjacent
function isAdjacent(id1, id2) {
  const row1 = Math.floor(id1 / GRID_SIZE);
  const row2 = Math.floor(id2 / GRID_SIZE);
  const col1 = id1 % GRID_SIZE;
  const col2 = id2 % GRID_SIZE;

  return (
    (Math.abs(row1 - row2) === 1 && col1 === col2) ||
    (Math.abs(col1 - col2) === 1 && row1 === row2)
  );
}

// Check for matches
function checkMatches() {
  let matches = [];
  // Check rows
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - 2; col++) {
      const index = row * GRID_SIZE + col;
      if (
        grid[index] === grid[index + 1] &&
        grid[index] === grid[index + 2]
      ) {
        matches.push(index, index + 1, index + 2);
      }
    }
  }

  // Check columns
  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE - 2; row++) {
      const index = row * GRID_SIZE + col;
      if (
        grid[index] === grid[index + GRID_SIZE] &&
        grid[index] === grid[index + 2 * GRID_SIZE]
      ) {
        matches.push(index, index + GRID_SIZE, index + 2 * GRID_SIZE);
      }
    }
  }

  // Remove matches
  if (matches.length > 0) {
    removeMatches([...new Set(matches)]);
    return true;
  }
  return false;
}

// Remove matches and refill the grid
function removeMatches(matches) {
  matches.forEach(index => {
    grid[index] = null;
    const jewel = document.querySelector(`.jewel[data-id="${index}"]`);
    if (jewel) {
      jewel.className = 'jewel';
    }
  });

  // Increase score
  score += matches.length;
  scoreDisplay.textContent = score;

  setTimeout(refillGrid, 500);
}

// Refill the grid
function refillGrid() {
  for (let i = grid.length - 1; i >= 0; i--) {
    if (!grid[i]) {
      for (let j = i - GRID_SIZE; j >= 0; j -= GRID_SIZE) {
        if (grid[j]) {
          grid[i] = grid[j];
          grid[j] = null;
          const jewel = document.querySelector(`.jewel[data-id="${j}"]`);
          if (jewel) {
            jewel.dataset.id = i;
          }
          break;
        }
      }

      if (!grid[i]) {
        grid[i] = jewelColors[Math.floor(Math.random() * jewelColors.length)];
      }

      const jewel = document.querySelector(`.jewel[data-id="${i}"]`);
      if (jewel) {
        jewel.className = `jewel ${grid[i]}`;
      }
    }
  }

  setTimeout(() => {
    if (checkMatches()) {
      setTimeout(refillGrid, 500);
    }
  }, 500);
}

// Restart the game
restartBtn.addEventListener('click', () => {
  score = 0;
  scoreDisplay.textContent = score;
  createGrid();
});

// Initialize the game
createGrid();
