<template>
  <div class="reversi-container">
    <div class="game-status">
      <p v-if="gameOver" class="text-xl font-bold">Game Over!</p>
      <p v-else class="text-xl">Current Player: {{ currentPlayer === BLACK ? 'Black (You)' : 'White (AI)' }}</p>
    </div>
    
    <div class="game-board">
      <button
        v-for="(cell, index) in flattenedBoard"
        :key="index"
        class="cell"
        :class="{
          'cell-empty': cell === EMPTY,
          'cell-black': cell === BLACK,
          'cell-white': cell === WHITE,
          'cell-valid': currentPlayer === BLACK && isValidMove(Math.floor(index / 8), index % 8)
        }"
        @click="makeMove(Math.floor(index / 8), index % 8)"
        :disabled="gameOver || currentPlayer !== BLACK || !isValidMove(Math.floor(index / 8), index % 8)"
      />
    </div>

    <button @click="resetGame" class="reset-button">
      Reset Game
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const BOARD_SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const board = ref(createInitialBoard());
const currentPlayer = ref(BLACK);
const gameOver = ref(false);

const flattenedBoard = computed(() => board.value.flat());

function createInitialBoard() {
  const newBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
  const mid = BOARD_SIZE / 2;
  newBoard[mid-1][mid-1] = WHITE;
  newBoard[mid-1][mid] = BLACK;
  newBoard[mid][mid-1] = BLACK;
  newBoard[mid][mid] = WHITE;
  return newBoard;
}

function isValidMove(row, col) {
  if (board.value[row][col] !== EMPTY) return false;
  const opponent = currentPlayer.value === BLACK ? WHITE : BLACK;
  const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  
  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    let foundOpponent = false;
    
    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (board.value[x][y] === EMPTY) break;
      if (board.value[x][y] === opponent) {
        foundOpponent = true;
      } else if (board.value[x][y] === currentPlayer.value && foundOpponent) {
        return true;
      } else {
        break;
      }
      x += dx;
      y += dy;
    }
  }
  return false;
}

function makeMove(row, col) {
  if (gameOver.value || !isValidMove(row, col)) return;

  const newBoard = board.value.map(row => [...row]);
  newBoard[row][col] = currentPlayer.value;

  const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    const toFlip = [];
    
    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (newBoard[x][y] === EMPTY) break;
      if (newBoard[x][y] === currentPlayer.value) {
        for (const [fx, fy] of toFlip) {
          newBoard[fx][fy] = currentPlayer.value;
        }
        break;
      }
      toFlip.push([x, y]);
      x += dx;
      y += dy;
    }
  }

  board.value = newBoard;
  currentPlayer.value = currentPlayer.value === BLACK ? WHITE : BLACK;
}

function getValidMoves(player) {
  const moves = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (isValidMove(i, j)) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
}

function monteCarloMove(iterations = 1000) {
  const legalMoves = getValidMoves(WHITE);
  const movesScores = new Map();

  for (const move of legalMoves) {
    let wins = 0;
    for (let i = 0; i < iterations; i++) {
      const simBoard = JSON.parse(JSON.stringify(board.value));
      makeSimMove(simBoard, move[0], move[1], WHITE);
      const result = simulateRandomGame(simBoard, BLACK);
      if (result === WHITE) wins++;
    }
    movesScores.set(move, wins / iterations);
  }

  return Array.from(movesScores.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

function makeSimMove(simBoard, row, col, player) {
  simBoard[row][col] = player;
  const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    const toFlip = [];
    
    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (simBoard[x][y] === EMPTY) break;
      if (simBoard[x][y] === player) {
        for (const [fx, fy] of toFlip) {
          simBoard[fx][fy] = player;
        }
        break;
      }
      toFlip.push([x, y]);
      x += dx;
      y += dy;
    }
  }
}

function simulateRandomGame(simBoard, player) {
  while (true) {
    const moves = getSimValidMoves(simBoard, player);
    if (moves.length === 0) {
      if (getSimValidMoves(simBoard, player === BLACK ? WHITE : BLACK).length === 0) {
        return getWinner(simBoard);
      }
      player = player === BLACK ? WHITE : BLACK;
      continue;
    }
    const move = moves[Math.floor(Math.random() * moves.length)];
    makeSimMove(simBoard, move[0], move[1], player);
    player = player === BLACK ? WHITE : BLACK;
  }
}

function getSimValidMoves(simBoard, player) {
  const moves = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (isSimValidMove(simBoard, i, j, player)) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
}

function isSimValidMove(simBoard, row, col, player) {
  if (simBoard[row][col] !== EMPTY) return false;
  const opponent = player === BLACK ? WHITE : BLACK;
  const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  
  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    let foundOpponent = false;
    
    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (simBoard[x][y] === EMPTY) break;
      if (simBoard[x][y] === opponent) {
        foundOpponent = true;
      } else if (simBoard[x][y] === player && foundOpponent) {
        return true;
      } else {
        break;
      }
      x += dx;
      y += dy;
    }
  }
  return false;
}

function getWinner(simBoard) {
  let blackCount = 0;
  let whiteCount = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (simBoard[i][j] === BLACK) blackCount++;
      else if (simBoard[i][j] === WHITE) whiteCount++;
    }
  }
  return blackCount > whiteCount ? BLACK : (whiteCount > blackCount ? WHITE : EMPTY);
}

function resetGame() {
  board.value = createInitialBoard();
  currentPlayer.value = BLACK;
  gameOver.value = false;
}

watch(currentPlayer, (newPlayer) => {
  if (newPlayer === WHITE && !gameOver.value) {
    const aiMove = monteCarloMove();
    if (aiMove) {
      setTimeout(() => makeMove(aiMove[0], aiMove[1]), 500);
    } else {
      currentPlayer.value = BLACK;
    }
  }
  
  if (getValidMoves(BLACK).length === 0 && getValidMoves(WHITE).length === 0) {
    gameOver.value = true;
  }
});
</script>

<style scoped>
.reversi-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background-color: #383059;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.game-status {
  text-align: center;
  min-height: 2rem;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  background-color: #2c3e50;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cell {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cell-empty {
  background-color: #27ae60;
}

.cell-black {
  background-color: #2c3e50;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
}

.cell-white {
  background-color: #ecf0f1;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

.cell-valid {
  background-color: #27ae60;
  position: relative;
}

.cell-valid::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

.cell:disabled {
  cursor: not-allowed;
}

.reset-button {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.reset-button:hover {
  background-color: #2980b9;
}

@media (max-width: 640px) {
  .cell {
    width: 32px;
    height: 32px;
  }
  
  .game-board {
    gap: 2px;
    padding: 4px;
  }
}

@media (max-width: 480px) {
  .cell {
    width: 24px;
    height: 24px;
  }
}
</style>