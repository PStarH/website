<script setup>
import { projects } from '../project';
import router from '../../../router/router';
import { ref, onMounted, onUnmounted } from 'vue';
import MazeVisualizer from './dfs/mazeVisualizer.vue';

const project = ref(null);

const questionBriefing = ref(null);
const solution = ref(null);
const dfsSection = ref(null);
const backtrackingSection = ref(null);
const codeSection = ref(null);
const scrollContainer = ref(null);
const firstThought = ref(null);

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

const fullcode = `#include <vector>
#include <string>
using namespace std;

class Solution {
    int rows, cols;
    vector<vector<bool>> visited;
    int dirx[4] = {0, 1, 0, -1}; // right, down, left, up
    int diry[4] = {1, 0, -1, 0};
    
public:
    bool hasPath(vector<vector<int>>& maze, vector<int>& start, vector<int>& destination) {
        rows = maze.size();
        cols = maze[0].size();
        visited.resize(rows, vector<bool>(cols, false));
        
        return dfs(maze, start[0], start[1], destination);
    }
    
private:
    bool dfs(vector<vector<int>>& maze, int x, int y, vector<int>& destination) {
        // Base case: reached destination
        if (x == destination[0] && y == destination[1]) {
            return true;
        }
        
        // Mark current cell as visited
        visited[x][y] = true;
        
        // Try all four directions
        for (int dir = 0; dir < 4; dir++) {
            int nx = x + dirx[dir];
            int ny = y + diry[dir];
            
            // Keep rolling in the same direction until hitting a wall
            while (nx >= 0 && nx < rows && ny >= 0 && ny < cols && maze[nx][ny] == 0) {
                nx += dirx[dir];
                ny += diry[dir];
            }
            
            // Step back to the last valid position
            nx -= dirx[dir];
            ny -= diry[dir];
            
            // If not visited, explore this path
            if (!visited[nx][ny]) {
                if (dfs(maze, nx, ny, destination)) {
                    return true;
                }
            }
        }
        
        return false;
    }
};

// Time Complexity: O(m * n) where m is rows and n is cols
// Space Complexity: O(m * n) for visited array and recursion stack
`;

const dfsExplanation = `bool dfs(vector<vector<int>>& maze, int x, int y, vector<int>& destination) {
    // Base case: reached destination
    if (x == destination[0] && y == destination[1]) {
        return true;
    }
    
    // Mark current cell as visited
    visited[x][y] = true;
    
    // Try all four directions
    for (int dir = 0; dir < 4; dir++) {
        int nx = x + dirx[dir];
        int ny = y + diry[dir];
        
        // Keep rolling in the same direction until hitting a wall
        while (nx >= 0 && nx < rows && ny >= 0 && ny < cols && maze[nx][ny] == 0) {
            nx += dirx[dir];
            ny += diry[dir];
        }
        
        // Step back to the last valid position
        nx -= dirx[dir];
        ny -= diry[dir];
        
        // If not visited, explore this path
        if (!visited[nx][ny]) {
            if (dfs(maze, nx, ny, destination)) {
                return true;
            }
        }
    }
    
    return false; // No path found from this cell
}

// Time complexity: O(m * n) as we visit each cell at most once
`;

const initialization = `#include <vector>
#include <string>
using namespace std;

class Solution {
    int rows, cols;
    vector<vector<bool>> visited; // Track visited cells
    int dirx[4] = {0, 1, 0, -1};  // Directions: right, down, left, up
    int diry[4] = {1, 0, -1, 0};
    
public:
    bool hasPath(vector<vector<int>>& maze, vector<int>& start, vector<int>& destination) {
        rows = maze.size();
        cols = maze[0].size();
        visited.resize(rows, vector<bool>(cols, false));
        
        return dfs(maze, start[0], start[1], destination);
    }
    
    // Time complexity for initialization: O(1)
`;

const backtrackingCode = `// Backtracking mechanism in DFS
if (!visited[nx][ny]) {
    if (dfs(maze, nx, ny, destination)) {
        return true;  // Path found!
    }
    // Implicit backtracking: if dfs returns false, 
    // we try the next direction
}

// The function automatically backtracks when:
// 1. Dead end is reached (all directions explored)
// 2. No path to destination found
// This allows exploring alternative paths
`;

initial();

function initial() {
    project.value = projects.find(project => project.routerKey == router.currentRoute.value.name)
}

function scrollToDFS() {
    dfsSection.value.scrollIntoView({ behavior: 'smooth' });
}

function scrollToBacktracking() {
    backtrackingSection.value.scrollIntoView({ behavior: 'smooth' });
}

function scrollToCode() {
    codeSection.value.scrollIntoView({ behavior: 'smooth' });
}

function scrollToQuestion() {
    questionBriefing.value.scrollIntoView({ behavior: 'smooth' });
}

function scrollToSolution() {
    solution.value.scrollIntoView({ behavior: 'smooth' });
}

function scrollToFirstThought() {
    firstThought.value.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <div ref="scrollContainer" style="height: 100%; overflow-y: auto; overflow-x: hidden;">
        <Transition>
            <n-anchor ref="anchorRef" affix :trigger-top="88" :top="88"
                style="z-index: 1; padding: 1.5rem; float: left;">
                <n-anchor-link title="Question Briefing" @click="scrollToQuestion" />
                <n-anchor-link title="First Thought" @click="scrollToFirstThought" />
                <n-anchor-link title="DFS Explanation" @click="scrollToDFS" />
                <n-anchor-link title="Backtracking Explanation" @click="scrollToBacktracking" />
                <n-anchor-link title="Solution" @click="scrollToSolution" />
                <n-anchor-link title="Complete Code" @click="scrollToCode" />
            </n-anchor>
        </Transition>
        <div v-if="project" class="projectDetailPage">
            <div>
                <div style="font-size: 3rem;">
                    <b>{{ project.name }}</b>
                </div>
                <div>
                    <n-text :depth="3">
                        <n-time :time="project.start"></n-time>
                    </n-text>
                </div>
            </div>
            <div style="padding: 3rem">
                <p>This question is based on <b>Leetcode 490 - The Maze</b>. This question relates to Depth-First Search (DFS).</p>
                <n-flex vertical :size="48">
                    <div>
                        <div class="subTitle" ref="questionBriefing">Question Briefing</div>
                        <p style="vertical-align: text-bottom">
                            You are given a maze represented as a 2D grid where:
                            <br>
                            • <b class="greyhighlight">0</b> represents an empty space
                            <br>
                            • <b class="greyhighlight">1</b> represents a wall
                            <br>
                            • A ball starts at position <b class="greyhighlight">start</b>
                            <br>
                            • The destination is at position <b class="greyhighlight">destination</b>
                            <br><br>
                            The ball can roll through empty spaces in four directions (up, down, left, right), but it won't stop until it hits a wall. 
                            When the ball stops, it can choose the next direction.
                            <br><br>
                            Determine if the ball can stop at the destination.
                        </p>
                        <div @click="scrollToCode" class="link" style="font-size: 0.625rem;">Click to skip to full code</div>
                    </div>
                    <div>
                        <div ref="firstThought" class="subTitle">First Thought About the Question</div>
                        <p>
                            <b class="list">1.</b> The maze is represented as a <b class="greyhighlight">2D grid</b>, so we need to traverse through cells.<br>
                            <b class="list">2.</b> The ball keeps rolling until it <b class="greyhighlight">hits a wall</b>, suggesting we need to simulate continuous movement.<br>
                            <b class="list">3.</b> We need to <b class="greyhighlight">explore all possible paths</b> from the start to see if we can reach the destination.<br>
                            <b class="list">4.</b> This is a perfect use case for <b class="link" @click="scrollToDFS">Depth-First Search (DFS)</b> with <b class="link" @click="scrollToBacktracking">backtracking</b>.<br>
                            <b class="list">5.</b> We need to track <b class="greyhighlight">visited cells</b> to avoid infinite loops.
                        </p>
                    </div>
                    <div>
                        <div ref="dfsSection" class="subTitle">What is DFS (Depth-First Search)?</div>
                        <p>
                            <b>Introduction: </b> Depth-First Search is an algorithm that explores a graph or tree by going as <b class="greyhighlight">deep</b> as possible along each branch before backtracking. 
                            It starts at a root node and explores each path to its fullest depth before moving to the next path.
                            <br><br>
                            <b>Implementation:</b> DFS can be implemented using either:
                            <br>
                            • <b class="greyhighlight">Recursion</b> (most common and intuitive)
                            <br>
                            • <b class="greyhighlight">Stack</b> (iterative approach)
                            <br><br>
                            In the recursive approach, the function calls itself to explore deeper paths. When a dead end is reached, 
                            the recursion naturally backtracks to explore other paths.
                        </p>
                        <div style="text-align: center; padding-bottom: 0.156rem; margin: 1rem 0;"><b>DFS Visualization</b></div>
                        <p>
                            <b>DFS vs BFS:</b>
                            <br>
                            • DFS explores <b class="greyhighlight">depth-first</b> (one path completely before trying others)
                            <br>
                            • BFS explores <b class="greyhighlight">breadth-first</b> (all neighbors at current level before going deeper)
                            <br>
                            • DFS uses less memory but may not find the shortest path
                            <br>
                            • DFS is excellent for problems involving <b class="greyhighlight">path exploration</b> and <b class="greyhighlight">backtracking</b>
                        </p>
                        <div>Time complexity: <b style="font-size: 1.375rem; font-weight: 2000; font-style: italic; font-family:serif;">O(V+E)</b> (Vertices+Edges)</div>
                        <div style="text-align: center;">
                            <n-image width="200" src="/website/images/graph.png"></n-image>
                        </div>
                    </div>
                    <div>
                        <div ref="backtrackingSection" class="subTitle">What is Backtracking?</div>
                        <p>
                            <b>Backtracking</b> is a problem-solving technique where you explore all possible solutions by building them incrementally. 
                            When you reach a point where the current path cannot lead to a solution, you <b class="greyhighlight">"backtrack"</b> 
                            (undo the last choice) and try a different path.
                            <br><br>
                            <b>Key Concepts:</b>
                            <br>
                            • <b class="greyhighlight">Choice:</b> At each step, make a choice
                            <br>
                            • <b class="greyhighlight">Constraint:</b> Check if the choice is valid
                            <br>
                            • <b class="greyhighlight">Goal:</b> Check if we reached the solution
                            <br>
                            • <b class="greyhighlight">Backtrack:</b> If path doesn't work, undo and try another
                            <br><br>
                            In our maze problem, backtracking allows us to explore all possible paths. If a path leads to a dead end, 
                            we backtrack and try a different direction.
                        </p>
                        <div style="text-align: center; font-size: 1rem; margin: 1rem 0;"><b>Backtracking Process</b></div>
                    </div>
                    <div>
                        <div class="subTitle" ref="solution">Solution</div>
                        <p><b class="list">1. </b>Initialize the maze dimensions and create a visited array to track explored cells.</p>
                        <n-card>
                            <n-code :code="initialization" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                        <p><b class="list">2. </b>Implement the DFS function that explores all possible paths from the current position.</p>
                        <n-card>
                            <n-code :code="dfsExplanation" language="cpp" :show-line-numbers=true word-wrap></n-code>
                        </n-card>
                        <p><b class="list">3. </b>Use backtracking to explore alternative paths when a dead end is reached.</p>
                        <n-card>
                            <n-code :code="backtrackingCode" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                    </div>
                    <div>
                        <div class="subTitle">Interactive Maze Visualization</div>
                        <p>Try the interactive visualization below to see how DFS explores the maze and backtracks when it hits dead ends:</p>
                        <MazeVisualizer :width="'700px'" />
                    </div>
                    <div>
                        <div ref="codeSection" class="subTitle" style="padding-top: 3.75rem;">Complete Code</div>
                        <n-card>
                            <n-code :code="fullcode" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                    </div>
                </n-flex>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.projectDetailPage {
    width: 60rem;
    padding: 1.5rem;
    margin: 0 auto;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;

    .subTitle {
        font-size: 1.75rem;
        font-weight: bold;
    }

    .icons {
        vertical-align: middle;
    }

    .greyhighlight {
        background-color: rgba(227, 220, 21, 0.868);
        color: black;
        font-weight: bold;
        padding: 0 0.125rem;
        border-radius: 0.188rem;
    }
}

.link {
    display: inline-block;
    text-shadow: 1.875rem;
    font-style: italic;
    background-color: rgba(201, 236, 75, 0.347);
    opacity: 0.8;
    border-radius: 2.188rem;
    padding: 0.3rem 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

.list {
    font-size: 1.125rem;
    font-weight: bold;
    font-style: oblique;
}

.hide-on-small {
    display: block;
}

@media (max-width: 1023px) {
    .hide-on-small {
        display: none;
    }
}
</style>
