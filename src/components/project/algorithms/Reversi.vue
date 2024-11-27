<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { NCard, NFlex, NCode, NImage, NTime, NText, NIcon, NAnchor, NAnchorLink, NStatistic } from 'naive-ui';
import ReversiGame from './reversi/ReversiGame.vue';

const isSmallScreen = ref(window.innerWidth <= 768);

const updateScreenSize = () => {
    isSmallScreen.value = window.innerWidth <= 768;
};

onMounted(() => {
    window.addEventListener('resize', updateScreenSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize);
});

const getBestMoveCode = `
std::pair<int, int> getBestMove(int player, int simulations = 1000) {
    std::vector<std::pair<int, int>> legalMoves = getLegalMoves(player);
    std::vector<int> scores(legalMoves.size(), 0);

    for (int i = 0; i < simulations; ++i) {
        for (size_t j = 0; j < legalMoves.size(); ++j) {
            std::vector<std::vector<int>> simBoard = board;
            makeMove(simBoard, legalMoves[j].first, legalMoves[j].second, player);
            int result = simulateRandomGame(simBoard, 3 - player);
            if (result == player) scores[j]++;
        }
    }

    auto bestMove = std::max_element(scores.begin(), scores.end());
    return legalMoves[std::distance(scores.begin(), bestMove)];
}
`;

const getLegalMovesCode = `
std::vector<std::pair<int, int>> getLegalMoves(int player) {
    std::vector<std::pair<int, int>> moves;
    for (int i = 0; i < BOARD_SIZE; ++i) {
        for (int j = 0; j < BOARD_SIZE; ++j) {
            if (isValidMove(board, i, j, player)) {
                moves.emplace_back(i, j);
            }
        }
    }
    return moves;
}
`;

const isValidMoveCode = `
bool isValidMove(const std::vector<std::vector<int>>& board, int row, int col, int player) {
    if (board[row][col] != EMPTY) return false;
    
    const int opponent = 3 - player;
    const int directions[8][2] = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
    
    for (const auto& dir : directions) {
        int x = row + dir[0], y = col + dir[1];
        bool foundOpponent = false;
        
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
            if (board[x][y] == EMPTY) break;
            if (board[x][y] == opponent) foundOpponent = true;
            else if (board[x][y] == player && foundOpponent) return true;
            else break;
            x += dir[0];
            y += dir[1];
        }
    }
    return false;
}
`;

const makeMoveCode = `
void makeMove(std::vector<std::vector<int>>& board, int row, int col, int player) {
    board[row][col] = player;
    const int directions[8][2] = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
    
    for (const auto& dir : directions) {
        int x = row + dir[0], y = col + dir[1];
        std::vector<std::pair<int, int>> toFlip;
        
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
            if (board[x][y] == EMPTY) break;
            if (board[x][y] == player) {
                for (const auto& pos : toFlip) {
                    board[pos.first][pos.second] = player;
                }
                break;
            }
            toFlip.emplace_back(x, y);
            x += dir[0];
            y += dir[1];
        }
    }
}
`;

const simulateRandomGameCode = `
int simulateRandomGame(std::vector<std::vector<int>> simBoard, int player) {
    while (true) {
        auto moves = getLegalMoves(player);
        if (moves.empty()) {
            if (getLegalMoves(3 - player).empty()) {
                return getWinner(simBoard);
            }
            player = 3 - player;
            continue;
        }
        std::uniform_int_distribution<> dis(0, moves.size() - 1);
        auto move = moves[dis(rng)];
        makeMove(simBoard, move.first, move.second, player);
        player = 3 - player;
    }
}
`;

const getWinnerCode = `
int getWinner(const std::vector<std::vector<int>>& board) {
    int blackCount = 0, whiteCount = 0;
    for (const auto& row : board) {
        for (int cell : row) {
            if (cell == BLACK) blackCount++;
            else if (cell == WHITE) whiteCount++;
        }
    }
    return blackCount > whiteCount ? BLACK : (whiteCount > blackCount ? WHITE : EMPTY);
}
`;
</script>

<template>
  <div class="flex">
    <n-anchor class="anchor-sidebar" target-offset="80" affix :trigger-top="88" :top="88" style="padding-left: 16px; margin-top: 52px;">
      <n-anchor-link href="#questionBriefing" title="Question Briefing" />
      <n-anchor-link href="#monteCarloSection" title="Monte Carlo Algorithm" />
      <n-anchor-link href="#reversiSection" title="Reversi Game" />
      <n-anchor-link href="#implementationSection" title="Implementation" />
      <n-anchor-link href="#interactiveSection" title="Interactive Demo" />
    </n-anchor>

    <div class="container mx-auto px-4 py-8 flex-1">
      <h1 class="text-4xl font-bold mb-6">Monte Carlo Algorithm & Reversi</h1>

      <n-flex vertical :size="48">
        <section id="questionBriefing">
          <h2 class="text-2xl font-semibold mb-4">Question Briefing</h2>
          <p>
            In this blog, we'll explore the Monte Carlo algorithm and its application to the game of Reversi (also known as Othello). 
            We'll implement a Monte Carlo-based AI player for Reversi and provide an interactive demo where you can play against the AI.
          </p>
        </section>

        <section id="monteCarloSection">
          <h2 class="text-2xl font-semibold mb-4">Monte Carlo Algorithm</h2>
          <p>
            The Monte Carlo algorithm is a computational technique that relies on repeated random sampling to obtain numerical results. 
            In the context of game AI, Monte Carlo methods can be used to evaluate the strength of different moves by simulating 
            many random games from a given position.
          </p>
          <h3 class="text-xl font-semibold mt-4 mb-2">Key Concepts:</h3>
          <ul class="list-disc pl-6">
            <li><b class="greyhighlight">Random Sampling:</b> Simulate many random games from the current position</li>
            <li><b class="greyhighlight">Evaluation:</b> Count wins/losses from the simulated games</li>
            <li><b class="greyhighlight">Decision Making:</b> Choose the move with the highest win rate</li>
          </ul>
          <p class="mt-4">
            The Monte Carlo method works well for Reversi because it can handle the game's complexity without requiring 
            extensive domain knowledge or complex evaluation functions. It's particularly effective in the opening and 
            middle game stages where traditional minimax algorithms might struggle due to the game's high branching factor.
          </p>
          <h3 class="text-xl font-semibold mt-4 mb-2">getBestMove Function Explanation:</h3>
          <p>
            The getBestMove function is the core of our Monte Carlo implementation. Here's how it works:
          </p>
          <ol class="list-decimal pl-6 mt-2">
            <li>Get all legal moves for the current player</li>
            <li>For each legal move:
              <ul class="list-disc pl-6">
                <li>Simulate a number of random games (default 1000)</li>
                <li>Count how many of these games result in a win for the current player</li>
              </ul>
            </li>
            <li>Choose the move with the highest win count</li>
          </ol>
          <p class="mt-2">
            This approach allows us to estimate the probability of winning for each possible move, 
            without needing to evaluate the board position directly.
          </p>
          <n-card>
            <n-code :code="getBestMoveCode" language="cpp" show-line-numbers />
          </n-card>
        </section>

        <section id="reversiSection">
          <h2 class="text-2xl font-semibold mb-4">Reversi (Othello)</h2>
          <p>
            Reversi is a strategy board game for two players, played on an 8×8 uncheckered board. 
            Players take turns placing disks on the board with their assigned color facing up. 
            During a play, any disks of the opponent's color that are in a straight line and bounded by the disk just placed 
            and another disk of the current player's color are turned over to the current player's color.
          </p>
          <h3 class="text-xl font-semibold mt-4 mb-2">Rules:</h3>
          <ul class="list-disc pl-6">
            <li>Black moves first</li>
            <li>A valid move must flip at least one opponent's disk</li>
            <li>If a player cannot make a valid move, their turn is forfeited</li>
            <li>The game ends when neither player can move</li>
            <li>The player with the most disks of their color on the board wins</li>
          </ul>
          <n-image width="400" src="/placeholder.svg?height=400&width=400" />
        </section>

        <section id="implementationSection">
          <h2 class="text-2xl font-semibold mb-4">Monte Carlo Implementation for Reversi</h2>
          <p>
            Let's break down the implementation into its key components:
          </p>
          
          <h3 class="text-xl font-semibold mt-4 mb-2">1. Getting Legal Moves</h3>
          <p>
            This function returns all valid moves for the current player:
          </p>
          <n-card>
            <n-code :code="getLegalMovesCode" language="cpp" show-line-numbers />
          </n-card>
          
          <h3 class="text-xl font-semibold mt-4 mb-2">2. Checking Valid Moves</h3>
          <p>
            This function checks if a move is valid according to Reversi rules:
          </p>
          <n-card>
            <n-code :code="isValidMoveCode" language="cpp" show-line-numbers />
          </n-card>
          
          <h3 class="text-xl font-semibold mt-4 mb-2">3. Making a Move</h3>
          <p>
            This function applies a move to the board, flipping opponent's disks:
          </p>
          <n-card>
            <n-code :code="makeMoveCode" language="cpp" show-line-numbers />
          </n-card>
          
          <h3 class="text-xl font-semibold mt-4 mb-2">4. Simulating Random Games</h3>
          <p>
            This function simulates a random game from the current board state:
          </p>
          <n-card>
            <n-code :code="simulateRandomGameCode" language="cpp" show-line-numbers />
          </n-card>
          
          <h3 class="text-xl font-semibold mt-4 mb-2">5. Determining the Winner</h3>
          <p>
            This function counts the disks to determine the winner:
          </p>
          <n-card>
            <n-code :code="getWinnerCode" language="cpp" show-line-numbers />
          </n-card>
          
          <p class="mt-4">
            The time complexity of this Monte Carlo implementation is O(s * m * g), where s is the number of simulations, 
            m is the number of legal moves, and g is the average number of moves in a simulated game. While this can be 
            computationally expensive, it often produces strong play without requiring game-specific heuristics.
          </p>
        </section>

        <section id="interactiveSection">
          <h2 class="text-2xl font-semibold mb-4">Interactive Reversi Game</h2>
          <p class="mb-4">Play against the Monte Carlo AI! You are Black, and the AI is White.</p>
          <ReversiGame />
        </section>
      </n-flex>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 60rem;
  margin: 0 auto;
}

.anchor-sidebar {
  position: fixed;
  top: 80px; /* Adjust based on header height if any */
  left: 20px;
  width: 200px;
}

.flex {
  display: flex;
}

.flex-1 {
  margin-left: 240px; /* Width of the anchor-sidebar + some spacing */
}

h2 {
  font-size: 1.75rem;
  font-weight: bold;
}

.greyhighlight {
  background-color: rgba(227, 220, 21, 0.868);
  color: black;
  font-weight: bold;
  padding: 0 0.125rem;
  border-radius: 0.188rem;
}

@media (max-width: 1023px) {
  .anchor-sidebar {
    display: none;
  }
  .flex-1 {
    margin-left: 0;
  }
}

nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  margin-bottom: 0.5rem;
}

nav a {
  text-decoration: none;
  color: #1a73e8;
  cursor: pointer;
}

nav a:hover {
  text-decoration: underline;
}
</style>