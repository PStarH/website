<template>
    <div class="container" style="padding-left: 72px; padding-right: 72px;">
        <div class="header-section">
            <div class="header-title">Project</div>
            <div class="header-description">
                Welcome to my Project showcase. This collection highlights my previous work,
                <br />demonstrating some of my sudden bright ideas. Each project represents a unique challenge
                <br />and innovative solution.
            </div>
        </div>
        <div class="subHead">Explained Algorithm Series</div>
        <n-grid :cols="4" :x-gap="12" :y-gap="8" class="projects-grid">
            <n-gi>
                <div class="projectsCard" @click="router.push({ name: 'projects-fireEscape' })">
                    <div class="project-title"><b>Escape the Spreading Fire</b></div>
                    <div>
                        <n-text :depth="3">
                            Determine the longest a man can remain in the room before being safely unable to
                            escape from the top-left corner (0,0) with the fire spreading and obstacles in the
                            way of the walls to the safehouse, which is located at the bottom-right corner. This
                            is done by using the <b>Double BFS algorithm and Binary Search.</b>
                        </n-text>
                    </div>
                    <div class="tags">
                        <div class="tag bfs">BFS</div>
                        <div class="tag binary-search">Binary Search</div>
                    </div>
                </div>
            </n-gi>
            <n-gi>
                <div class="projectsCard" @click="router.push({ name: 'projects-reversi' })">
                    <div class="project-title"><b>Reversi</b></div>
                    <div>
                        <n-text :depth="3">
                            Discover how the Monte Carlo Algorithm powers an intelligent AI for Reversi (Othello). This
                            blog breaks down the algorithm's principles, guides you through its implementation, and
                            offers an interactive demo to play against the algorithm. Explore how Monte Carlo
                            simulations enhance game strategy and
                            decision-making.
                        </n-text>
                    </div>
                    <div class="tag mcts">Monte Carlo</div>
                </div>
            </n-gi>
            <n-gi>
                <div class="projectsCard" @click="router.push({ name: 'projects-dfs' })">
                    <div class="project-title"><b>DFS Maze Solver</b></div>
                    <div>
                        <n-text :depth="3">
                            Learn how Depth-First Search (DFS) algorithm can solve complex maze problems. This blog 
                            explains the recursive nature of DFS, demonstrates its implementation with <b>backtracking</b>, 
                            and provides an interactive maze visualization where you can watch the algorithm explore 
                            paths to find the exit.
                        </n-text>
                    </div>
                    <div class="tags">
                        <div class="tag dfs">DFS</div>
                        <div class="tag backtracking">Backtracking</div>
                    </div>
                </div>
            </n-gi>
            <n-gi>
                <div class="projectsCard" @click="router.push({ name: 'projects-dp' })">
                    <div class="project-title"><b>Knapsack Problem</b></div>
                    <div>
                        <n-text :depth="3">
                            Explore the power of Dynamic Programming through the classic 0/1 Knapsack problem. 
                            Understand how to break down complex problems into subproblems, build solution tables, 
                            and achieve optimal results. Includes step-by-step visualization of the <b>DP table</b> 
                            construction process.
                        </n-text>
                    </div>
                    <div class="tags">
                        <div class="tag dp">Dynamic Programming</div>
                    </div>
                </div>
            </n-gi>
        </n-grid>
        <div class="subHead">Example Projects</div>
        <n-grid cols="2" :x-gap="12" :y-gap="8" class="example-projects-grid">
            <n-gi>
                <div class="project-item">
                    <div class="project-meta">
                        <div class="project-subhead">Example Project 1</div>
                        <div class="project-time">Time: 1970/01/01</div>
                    </div>
                    <div class="projectsCard" @click="router.push({ name: 'projects-fireEscape' })">
                        <div class="project-title"><b>Escape the Spreading Fire</b></div>
                        <div>
                            <n-text :depth="3">
                                Determine the longest a man can remain in the room before being safely unable to
                                escape from the top-left corner (0,0) with the fire spreading and obstacles in the
                                way of the walls to the safehouse, which is located at the bottom-right corner.
                                This is done by using the <b>Double BFS algorithm and Binary Search.</b>
                            </n-text>
                        </div>
                        <div class="tags">
                            <div class="tag bfs">BFS</div>
                            <div class="tag binary-search">Binary Search</div>
                        </div>
                    </div>
                    <div class="project-image">
                        <n-image width="400" src="/website/images/example_1.png" alt="Example Project 1 Image"></n-image>
                    </div>
                    <div class="project-stats">
                        <n-row>
                            <n-col :span="8">
                                <n-statistic label="Lines of Code" :value="3218"></n-statistic>
                            </n-col>
                            <n-col :span="8">
                                <n-statistic label="Hours Spent" :value="100"></n-statistic>
                            </n-col>
                            <n-col :span="8">
                                <n-statistic label="Commits" :value="128"></n-statistic>
                            </n-col>
                        </n-row>
                    </div>
                </div>
            </n-gi>
            <n-gi>
                <div class="project-item">
                    <div class="project-meta">
                        <div class="project-subhead">Example Project 2</div>
                        <div class="project-time">Time: 1970/01/01</div>
                    </div>
                    <div class="projectsCard" @click="router.push({ name: 'projects-fireEscape' })">
                        <div class="project-title"><b>Escape the Spreading Fire</b></div>
                        <div>
                            <n-text :depth="3">
                                Determine the longest a man can remain in the room before being safely
                                unable to escape from the top-left corner (0,0) with the fire spreading and obstacles
                                in the way of the walls to the safehouse, which is located at the bottom-right corner.
                                This is done by using the <b>Double BFS algorithm and Binary Search.</b>
                            </n-text>
                        </div>
                        <div class="tags">
                            <div class="tag bfs">BFS</div>
                            <div class="tag binary-search">Binary Search</div>
                        </div>
                    </div>
                    <div class="project-image">
                        <n-image width="400" src="/website/images/example_1.png" alt="Example Project 2 Image"></n-image>
                    </div>
                    <div class="project-stats">
                        <n-row>
                            <n-col :span="8">
                                <n-statistic label="Lines of Code" :value="3218"></n-statistic>
                            </n-col>
                            <n-col :span="8">
                                <n-statistic label="Hours Spent" :value="100"></n-statistic>
                            </n-col>
                            <n-col :span="8">
                                <n-statistic label="Commits" :value="128"></n-statistic>
                            </n-col>
                        </n-row>
                    </div>
                </div>
            </n-gi>
        </n-grid>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.container {
    align-items: center;
    text-align: center;
    min-height: 100vh;
    background: var(--background-gradient);
    padding: 2rem 1rem;
    color: var(--text-color);
}

.header-section {
    padding-left: 36px;
    margin: 0 auto;
    max-width: 1400px;
}

.header-title {
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.header-description {
    color: grey;
    line-height: 1.6;
}

.subHead {
    font-size: 1.5rem;
    font-weight: bold;
    padding-bottom: 1rem;
    margin-left: 36px;
}

.projects-grid,
.example-projects-grid {
    max-width: 1400px;
    margin: 0 auto 2rem auto;
}

.projectsCard {
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: var(--boxShadow-light);
    background-color: rgba(58, 51, 83, 0.9);
}

.projectsCard:hover {
    box-shadow: var(--boxShadow-regular);
}

.project-title {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
    color: var(--text-color);
}

.tags {
    margin-top: 1rem;
}

.tag {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    margin-right: 5px;
    margin-bottom: 5px;
}

.bfs {
    background-color: rgba(13, 52, 249, 0.5);
}

.mcts {
    background-color: rgba(249, 13, 13, 0.5);
}

.binary-search {
    background-color: rgba(66, 248, 15, 0.5);
}

.dfs {
    background-color: rgba(255, 152, 0, 0.5);
}

.backtracking {
    background-color: rgba(156, 39, 176, 0.5);
}

.dp {
    background-color: rgba(233, 30, 99, 0.5);
}

.optimization {
    background-color: rgba(0, 188, 212, 0.5);
}

.project-item {
    margin-bottom: 2rem;
}

.project-meta {
    margin-left: 36px;
    margin-bottom: 0.5rem;
}

.project-subhead {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-color);
}

.project-time {
    color: grey;
    margin-bottom: 1rem;
}

.project-image {
    text-align: center;
    padding: 1.875rem 0;
    /* 30px */
}

.project-stats {
    padding-left: 36px;
}

@media (min-width: 640px) {

    .projects-grid,
    .example-projects-grid {
        padding-left: 0;
    }

    .project-stats .n-col {
        text-align: center;
    }
}
</style>