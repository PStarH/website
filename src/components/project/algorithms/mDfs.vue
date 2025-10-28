<script setup>
import { projects } from '../project';
import router from '../../../router/router';
import { ref } from 'vue';
import MazeVisualizer from './dfs/mazeVisualizer.vue';

const project = ref(null);

const questionBriefing = ref(null);
const solution = ref(null);
const dfsSection = ref(null);
const backtrackingSection = ref(null);
const codeSection = ref(null);
const scrollContainer = ref(null);
const firstThought = ref(null);

const fullcode = `#include <vector>
#include <string>
using namespace std;

class Solution {
    int rows, cols;
    vector<vector<bool>> visited;
    int dirx[4] = {0, 1, 0, -1}; 
    // right, down, left, up
    int diry[4] = {1, 0, -1, 0};
    
public:
    bool hasPath(vector<vector<int>>& maze, 
                 vector<int>& start, 
                 vector<int>& destination) {
        rows = maze.size();
        cols = maze[0].size();
        visited.resize(rows, 
                      vector<bool>(cols, false));
        
        return dfs(maze, start[0], start[1], 
                   destination);
    }
    
private:
    bool dfs(vector<vector<int>>& maze, 
             int x, int y, 
             vector<int>& destination) {
        // Base case: reached destination
        if (x == destination[0] && 
            y == destination[1]) {
            return true;
        }
        
        // Mark current cell as visited
        visited[x][y] = true;
        
        // Try all four directions
        for (int dir = 0; dir < 4; dir++) {
            int nx = x + dirx[dir];
            int ny = y + diry[dir];
            
            // Keep rolling until hitting a wall
            while (nx >= 0 && nx < rows && 
                   ny >= 0 && ny < cols && 
                   maze[nx][ny] == 0) {
                nx += dirx[dir];
                ny += diry[dir];
            }
            
            // Step back to last valid position
            nx -= dirx[dir];
            ny -= diry[dir];
            
            // If not visited, explore this path
            if (!visited[nx][ny]) {
                if (dfs(maze, nx, ny, 
                        destination)) {
                    return true;
                }
            }
        }
        
        return false;
    }
};

// Time Complexity: O(m * n)
// Space Complexity: O(m * n)
`;

const dfsExplanation = `bool dfs(vector<vector<int>>& maze, 
         int x, int y, 
         vector<int>& destination) {
    // Base case: reached destination
    if (x == destination[0] && 
        y == destination[1]) {
        return true;
    }
    
    // Mark current cell as visited
    visited[x][y] = true;
    
    // Try all four directions
    for (int dir = 0; dir < 4; dir++) {
        int nx = x + dirx[dir];
        int ny = y + diry[dir];
        
        // Keep rolling until hitting wall
        while (nx >= 0 && nx < rows && 
               ny >= 0 && ny < cols && 
               maze[nx][ny] == 0) {
            nx += dirx[dir];
            ny += diry[dir];
        }
        
        // Step back to last valid position
        nx -= dirx[dir];
        ny -= diry[dir];
        
        // If not visited, explore path
        if (!visited[nx][ny]) {
            if (dfs(maze, nx, ny, 
                    destination)) {
                return true;
            }
        }
    }
    
    return false;
}

// Time: O(m * n) visit each cell once
`;

const initialization = `#include <vector>
#include <string>
using namespace std;

class Solution {
    int rows, cols;
    // Track visited cells
    vector<vector<bool>> visited;
    // Directions: right, down, left, up
    int dirx[4] = {0, 1, 0, -1};
    int diry[4] = {1, 0, -1, 0};
    
public:
    bool hasPath(vector<vector<int>>& maze,
                 vector<int>& start, 
                 vector<int>& destination) {
        rows = maze.size();
        cols = maze[0].size();
        visited.resize(rows, 
                      vector<bool>(cols, false));
        
        return dfs(maze, start[0], 
                   start[1], destination);
    }
    
    // Time: O(1) for initialization
`;

const backtrackingCode = `// Backtracking in DFS
if (!visited[nx][ny]) {
    if (dfs(maze, nx, ny, destination)) {
        return true;  // Path found!
    }
    // Implicit backtracking: 
    // if dfs returns false, 
    // try the next direction
}

// Backtracking happens when:
// 1. Dead end reached
// 2. No path to destination found
// This allows exploring alternatives
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
    <div ref="scrollContainer" style="height: 100%;">
        <div v-if="project" class="projectDetailPage">
            <div style="padding: 24px">
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
                <div>
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
                                <b class="list">1.</b> The maze is a <b class="greyhighlight">2D grid</b>, need to traverse cells.<br>
                                <b class="list">2.</b> Ball keeps rolling until it <b class="greyhighlight">hits a wall</b>.<br>
                                <b class="list">3.</b> Need to <b class="greyhighlight">explore all paths</b> from start.<br>
                                <b class="list">4.</b> Perfect for <b class="link" @click="scrollToDFS">DFS</b> with <b class="link" @click="scrollToBacktracking">backtracking</b>.<br>
                                <b class="list">5.</b> Track <b class="greyhighlight">visited cells</b> to avoid loops.
                            </p>
                        </div>
                        <div>
                            <div ref="dfsSection" class="subTitle">What is DFS?</div>
                            <p>
                                <b>Introduction: </b> Depth-First Search explores a graph by going as <b class="greyhighlight">deep</b> as possible along each branch before backtracking.
                                <br><br>
                                <b>Implementation:</b> DFS can be implemented using:
                                <br>
                                • <b class="greyhighlight">Recursion</b> (most common)
                                <br>
                                • <b class="greyhighlight">Stack</b> (iterative)
                                <br><br>
                                When a dead end is reached, the recursion naturally backtracks to explore other paths.
                            </p>
                            <div style="text-align: center; padding-bottom: 0.156rem;"><b>DFS Concept</b></div>
                            <p>
                                <b>DFS vs BFS:</b>
                                <br>
                                • DFS: <b class="greyhighlight">depth-first</b> (one path completely)
                                <br>
                                • BFS: <b class="greyhighlight">breadth-first</b> (level by level)
                                <br>
                                • DFS uses less memory
                                <br>
                                • DFS excellent for <b class="greyhighlight">path exploration</b>
                            </p>
                            <div>Time complexity: <b style="font-size: 1.375rem; font-weight: 2000; font-style: italic; font-family:serif;">O(V+E)</b></div>
                            <div style="text-align: center; align-content: center;">
                                <n-image width="70%" src="/website/images/graph.png"></n-image>
                            </div>
                        </div>
                        <div>
                            <div ref="backtrackingSection" class="subTitle">What is Backtracking?</div>
                            <p>
                                <b>Backtracking</b> explores all possible solutions by building them incrementally. 
                                When current path cannot lead to solution, <b class="greyhighlight">"backtrack"</b> and try different path.
                                <br><br>
                                <b>Key Concepts:</b>
                                <br>
                                • <b class="greyhighlight">Choice:</b> Make a choice at each step
                                <br>
                                • <b class="greyhighlight">Constraint:</b> Check if choice is valid
                                <br>
                                • <b class="greyhighlight">Goal:</b> Check if solution reached
                                <br>
                                • <b class="greyhighlight">Backtrack:</b> If path fails, undo and try another
                            </p>
                        </div>
                        <div>
                            <div class="subTitle" ref="solution">Solution</div>
                            <p><b class="list">1. </b>Initialize maze and create visited array.</p>
                            <n-card>
                                <n-code :code="initialization" language="cpp" show-line-numbers word-wrap></n-code>
                            </n-card>
                            <p><b class="list">2. </b>Implement DFS to explore all paths.</p>
                            <n-card>
                                <n-code :code="dfsExplanation" language="cpp" :show-line-numbers=true word-wrap></n-code>
                            </n-card>
                            <p><b class="list">3. </b>Use backtracking for alternatives.</p>
                            <n-card>
                                <n-code :code="backtrackingCode" language="cpp" show-line-numbers word-wrap></n-code>
                            </n-card>
                        </div>
                        <div>
                            <div class="subTitle">Interactive Maze Visualization</div>
                            <p>Try the visualization below to see DFS exploring and backtracking:</p>
                            <MazeVisualizer :width="'100%'" />
                        </div>

                    </n-flex>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.projectDetailPage {
    width: 100%;
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
</style>
