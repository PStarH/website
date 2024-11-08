<script setup lang="ts">

import { projects, projectData } from '../project';
import router from '../../../router/router';
import { ref, onMounted, onUnmounted } from 'vue';
import gridDisplayVue from './gridDisplay/gridDisplay.vue';
import { NCard, NFlex, NCode, NImage, NTime, NText, NIcon, NAnchor, NAnchorLink, NStatistic, NEquation } from 'naive-ui';
import { Katex } from 'naive-ui/es/config-provider/src/katex';

const project = ref<projectData | null>(null);

const questionBriefing = ref(null);

const solution = ref(null);

const bfsSection = ref(null);

const bsSection = ref(null);

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
#include <queue>
#include <set>
#include <tuple>
using namespace std;

class Solution {
    const int NO_FIRE = 1e9; // Sentinel value for areas not reached by fire
    int dirx[4] = {1, 0, -1, 0}; // Directions for row movement (down, left, up, right)
    int diry[4] = {0, -1, 0, 1}; // Directions for column movement (down, left, up, right)

public:
    int maximumMinutes(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        vector<vector<int>> fireTime(m, vector<int>(n, NO_FIRE)); // Grid to store fire spread times
        queue<pair<int, int>> q; // Queue for BFS of fire spread

        // Section 1: Record initial fire positions
        for (int x = 0; x < m; x++) {
            for (int y = 0; y < n; y++) {
                if (grid[x][y] == 1) { // Initial fire
                    q.push({x, y});
                    fireTime[x][y] = 0; // Fire starts at time 0
                } else if (grid[x][y] == 2) { // Wall
                    fireTime[x][y] = -1; // Mark as wall
                }
            }
        }

        // Section 2: BFS to simulate fire spread
        while (!q.empty()) {
            int x = q.front().first, y = q.front().second;
            q.pop();
            for (int dir = 0; dir < 4; dir++) {
                int nx = x + dirx[dir], ny = y + diry[dir];
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && fireTime[nx][ny] == NO_FIRE) {
                    fireTime[nx][ny] = fireTime[x][y] + 1; // Spread fire to the next cell
                    q.push({nx, ny});
                }
            }
        }

        // Helper function to check if escape is possible with a given delay
        auto canEscape = [&](int delay) -> bool {
            vector<vector<int>> vis(m, vector<int>(n, 0)); // Visited array
            queue<pair<int, int>> q; // Queue for BFS of escape path
            q.push({0, 0});
            vis[0][0] = 1;

            int time = delay; // Current time starts with delay
            while (!q.empty()) {
                int sz = q.size();
                while (sz--) {
                    int x = q.front().first, y = q.front().second;
                    q.pop();
                    if (x == m - 1 && y == n - 1) { // Reached safehouse
                        return true;
                    }
                    for (int dir = 0; dir < 4; dir++) {
                        int nx = x + dirx[dir], ny = y + diry[dir];
                        if (nx >= 0 && nx < m && ny >= 0 && ny < n 
                            && !vis[nx][ny] && grid[nx][ny] != 2) {
                            if (fireTime[nx][ny] == NO_FIRE || fireTime[nx][ny] > time + 1) {
                                vis[nx][ny] = 1;
                                q.push({nx, ny});
                            }
                        }
                    }
                }
                time++;
            }
            return false;
        };

        // Section 4: Binary search to find maximum waiting time
        int left = 0, right = m * n, best = -1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (canEscape(mid)) {
                best = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return best == m * n ? NO_FIRE : best;
    }
};
`

const initialization = `#include <vector>
#include <queue>
#include <tuple>
using namespace std;

class Solution {
    const int NO_FIRE = 1e9; // Sentinel value for areas not reached by fire
    int dirx[4] = {1, 0, -1, 0}; // Directions for row movement (down, left, up, right)
    int diry[4] = {0, -1, 0, 1}; // Directions for column movement (down, left, up, right)

public:
    int maximumMinutes(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        vector<vector<int>> fireTime(m, vector<int>(n, NO_FIRE));
        // Grid to store fire spread times
        queue<pair<int, int>> q; // Queue for BFS of fire spread

        // Record initial fire positions
        for (int x = 0; x < m; x++) {
            for (int y = 0; y < n; y++) {
                if (grid[x][y] == 1) { // Initial fire
                    q.push({x, y});
                    fireTime[x][y] = 0; // Fire starts at time 0
                } else if (grid[x][y] == 2) { // Wall
                    fireTime[x][y] = -1; // Mark as wall
                }
            }
        }


        // Time complexity is O(mn) as it need to go through every grid which is m * n
`
const bfs_fire = `// BFS to simulate fire spread
        while (!q.empty()) {
            int x = q.front().first, y = q.front().second;
            q.pop();
            for (int dir = 0; dir < 4; dir++) {
                int nx = x + dirx[dir], ny = y + diry[dir];
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && fireTime[nx][ny] == NO_FIRE) {
                    fireTime[nx][ny] = fireTime[x][y] + 1; // Spread fire to the next cell
                    q.push({nx, ny});
                }
            }
        }
        // Time complexity is O(mn) as it is O(V + E), we have no edge here but we have m * n grid which is vertices

`
const bfs_man = `// Helper function to check if escape is possible with a given delay
        auto canEscape = [&](int delay) -> bool {
            vector<vector<int>> vis(m, vector<int>(n, 0)); // Visited array
            queue<pair<int, int>> q; // Queue for BFS of escape path
            q.push({0, 0});
            vis[0][0] = 1;

            int time = delay; // Current time starts with delay
            while (!q.empty()) {
                int sz = q.size();
                while (sz--) {
                    int x = q.front().first, y = q.front().second;
                    q.pop();
                    if (x == m - 1 && y == n - 1) { // Reached safehouse
                        return true;
                    }
                    for (int dir = 0; dir < 4; dir++) {
                        int nx = x + dirx[dir], ny = y + diry[dir];
                        if (nx >= 0 && nx < m && ny >= 0 && ny < n 
                            && !vis[nx][ny] && grid[nx][ny] != 2) {
                            if (fireTime[nx][ny] == NO_FIRE || fireTime[nx][ny] > time + 1) {
                                vis[nx][ny] = 1;
                                q.push({nx, ny});
                            }
                        }
                    }
                }
                time++;
            }
            return false;
        };
        //Time complexity is the same as the previous bfs of fire
        `
const binary_search = `// Binary search to find maximum waiting time
        int left = 0, right = m * n, best = -1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (canEscape(mid)) {
                best = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return best == m * n ? NO_FIRE : best;
    }
};

// Binary Search's time complexity is O(log(mn)) and it calls the function everytime so it is O(O(mn)log(mn))
`

initial();

function initial() {
    project.value = projects.find(project => project.routerKey == router.currentRoute.value.name)!
}

function scrollToBFS() {
    bfsSection.value.scrollIntoView({ behavior: 'smooth' });
}

function scrollToBS() {
    bsSection.value.scrollIntoView({ behavior: 'smooth' });
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

    <div ref="scrollContainer" style="height: 100%; overflow: hidden;">
        <Transition>
            <n-anchor ref="anchorRef" affix :trigger-top="88" :top="88"
                style="z-index: 1; padding: 1.5rem; float: left;">
                <n-anchor-link title="Question Briefing" @click="scrollToQuestion" />
                <n-anchor-link title="First Thought" @click="scrollToFirstThought" />
                <n-anchor-link title="BFS Explanation" @click="scrollToBFS" />
                <n-anchor-link title="Binary Search Explanation" @click="scrollToBS" />
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
                <!-- <grid-display-vue :rows="5" :cols="7" :figurePosition="0"></grid-display-vue> -->
                <p>This question is on <b>Leetcode 2258</b>. This question relates to bfs.</p>
                <n-flex vertical :size="48">
                    <div>
                        <div class="subTitle" ref="questionBriefing">Question Briefing</div>
                        <p style="vertical-align: text-bottom">
                            You are given a 2D array which represents a grid. The
                            grid includes wall
                            <n-icon class="icons" color="#663300" :size="22">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                                        <path d="M4 8h16"></path>
                                        <path d="M20 12H4"></path>
                                        <path d="M4 16h16"></path>
                                        <path d="M9 4v4"></path>
                                        <path d="M14 8v4"></path>
                                        <path d="M8 12v4"></path>
                                        <path d="M16 12v4"></path>
                                        <path d="M11 16v4"></path>
                                    </g>
                                </svg>
                            </n-icon> and fire
                            <n-icon class="icons" color="#FF3333" :size="22">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23c.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59c-1.81-1.37-2-3.34-1.84-4.75c.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54c2.43.31 5.06-.14 6.95-1.87c2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44-.35 2.18-1.39 2.38-2.31c.33-1.43-.96-2.83-.09-5.09c.33 1.87 3.27 3.04 3.27 5.08c.08 2.53-2.66 4.7-5.56 2.32z"
                                        fill="currentColor"></path>
                                </svg>
                            </n-icon>. For
                            every minute
                            the fire will spread to every possible adjacent block. You need to calculate the time a
                            person
                            locating
                            in the top-left corner <b class="greyhighlight">
                                (0,0)</b> can wait before escaping making sure he
                            can still escape to the bottom-right corner. If it can't escape return <b
                                class="greyhighlight">
                                -1 </b>,
                            and if it can always escape return <b class="greyhighlight">10<sup>9</sup></b>
                        </p>
                        <div @click="scrollToCode" class="link" style="font-size: 0.625rem;">Click to skip to full
                            code
                        </div>
                        <div style="text-align: center; font-weight: bold; font-size: 1rem;">Visualization</div>
                        <grid-display-vue :rows="5" :cols="7" :figurePosition="0" :allowSlide="true" :showPlayer="true"
                            :showExit="true" :allowSetup="true"></grid-display-vue>
                    </div>
                    <div>
                        <div ref="firstThought" class="subTitle">First thought about the question</div>
                        <p><b class="list">1.</b>The first word we see in the question is a 2D array, so our first step
                            is to initilaize a 2D array to store grass(0), fire(1), and wall(2) <br>
                            <b class="list">2.</b>The question then say <b class="greyhighlight"> Every minute </b>the
                            player can move to an adjacent <b class="greyhighlight">grass</b> cell. This hints us that
                            we can use <b class="link" @click="scrollToBFS">BFS</b> to solve this question as the player
                            moves step by step while identifying whether each step is valid using the simulation of the
                            spread of fire <br>
                            <b class="list">3.</b>Then, the question saids <b class="greyhighlight">"After your move,
                                every fire cell will
                                spread
                                to all adjacent cells that are not walls."</b> This also hints us to use BFS to simulate
                            the
                            spread of fire as it can move in every direction it can spread, so it is very suitable to
                            use BFS. <br>
                            <b class="list">4.</b>The question ask us to return <b class="greyhighlight">the maximum
                                minute the person can
                                stay</b>
                            In order to make sure it is the maximum minute, we can simulate whether the person is able
                            to escape given a certain waiting time. Therefore, it is suitable to use <b class="link"
                                @click="scrollToBS">Binary search</b> as it
                            is a <b class="greyhighlight">fast</b>way to find the value and the numbers are all sorted.
                        </p>
                    </div>
                    <div>
                        <div ref="bfsSection" class="subTitle">What is BFS?</div>
                        <p> <b>Introduction: </b> This algorithm starts at the root <b class="greyhighlight">node</b>
                            (or any node) and visits all
                            neighboring
                            nodes first, and then
                            for each neighboring node, their unvisited neighboring nodes. This process proceeds <b
                                class="greyhighlight">layer</b> by
                            layer
                            until
                            all nodes have been visited. <br>
                            <b>Implementation:</b> BFS is usually implemented using a <b
                                class="greyhighlight">queue</b>. first the root node is
                            added to
                            the
                            queue,
                            then the node is continually removed from the queue, all its unvisited neighboring nodes are
                            accessed,
                            and these neighboring nodes are added to the queue. This process is repeated until the queue
                            is
                            empty,
                            i.e., all nodes have been visited.
                        </p>
                        <div style="text-align: center"><n-image width="600" src="/website/images/BFSexplain.png"></n-image>
                        </div>
                        <div style="text-align: center;"><n-image width="400" lazy src="/website/images/bfs_demo.gif"></n-image></div>
                        <div style="text-align: center; padding-bottom: 0.156rem;"><b>BFS explanation</b></div>
                        <div>BFS can also work in <b class="greyhighlight">graph</b> rather than just grid. A graph is
                            made up of <b class="greyhighlight">vertices (points)</b>
                            connected by <b class="greyhighlight">edges (lines)</b>. Vertices represent entities or
                            nodes, and edges show
                            the connections between them. In many graphs, edges can have lengths, which indicate the
                            weight, cost, or distance associated with moving from one vertex to another. This addition
                            allows us to analyze not just the connections but also the efficiency of pathways or routes.
                            For example, in a road network, edge lengths might represent travel time or distance,
                            enabling us to solve problems like finding the shortest path or optimizing routes.</div>
                        its time complexity is:<b
                            style="font-size: 1.375rem; font-weight: 2000; font-style: italic; font-family:serif;">O(V+E)</b>
                        (Vertices+Edges)
                        <div style="text-align: center;"><n-image width="200" src="/website/images/graph.png"></n-image></div>
                    </div>
                    <div>
                        <div ref="bsSection" class="subTitle">What is Binary Search?</div>
                        <p> Binary Search is an <b class="greyhighlight">efficient</b> method for finding a specific
                            item in a <b class="greyhighlight">sorted</b> list or array.
                            It
                            works
                            by
                            repeatedly dividing the search interval <b class="greyhighlight">in half</b>. To begin, you
                            select the <b class="greyhighlight">middle value</b> of
                            the
                            sorted
                            array and compare it to <b class="greyhighlight">the target value</b> you're looking for. If
                            the target value is less
                            than
                            this
                            middle element, you narrow the search interval to the lower half of the array. If it's
                            greater,
                            you
                            narrow it to the upper half. This process continues, with each step selecting the middle
                            element
                            of
                            the
                            new, smaller interval and comparing it to the target value. The search ends when either <b
                                class="greyhighlight">the
                                target
                                value
                                is found</b> or the interval becomes <b class="greyhighlight">empty</b>, indicating the
                            value isn't in the array. This
                            approach
                            is
                            analogous to finding a name in a phone book by repeatedly opening it to the middle, deciding
                            whether
                            to
                            look in the first or second half, and then repeating this process on the chosen half. By
                            <b class="greyhighlight">eliminating
                                half</b> of the remaining possibilities with each step, Binary Search becomes
                            significantly
                            faster
                            than
                            checking each item sequentially, especially for large datasets. This makes it a powerful
                            tool in
                            computer science and everyday problem-solving, particularly when dealing with sorted data.
                        </p>
                        <div>Its time complexity is <b
                                style="font-size: 1.375rem; font-weight: 2000; font-style: italic; font-family:serif;">O(log(n))</b>
                        </div>
                        <div style="text-align: center;"><b>Imagine you need to find number 2 in an array -5 to 5</b>
                        </div>
                        <div style="text-align: center;"><n-image width="600" lazy src="/website/images/binarysearch.gif"></n-image>
                        </div>
                        <div style="text-align: center; font-size: 1rem;"><b>Binary Search animation</b></div>
                    </div>
                    <div>
                        <div class="subTitle" ref="solution">Solution</div>
                        <p><b class="list">1. </b>Recording the initial position of the fire. Use a list to record each
                            coordinate of fire and the time they start to burn.</p>
                        <n-card>
                            <n-code :code="initialization" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                        <div style="text-align: center; font-weight: bold;">How the grid look like:</div>
                        <grid-display-vue :rows="5" :cols="7" :figurePosition="0" :allowSlide="false" :showPlayer="true"
                            :showExit="true" :allowSetup="false"></grid-display-vue>
                        <p><b class="list">2. </b>Use a <b class="link" @click="scrollToBFS">Breadth-First
                                Search
                                (BFS)
                                algorithm</b> to simulate the spread of fire for a
                            given number of minutes. This helps determine how the fire will spread over time.</p>
                        <n-card>
                            <n-code :code="bfs_fire" language="cpp" :show-line-numbers=true word-wrap></n-code>
                        </n-card>
                        <div style="align-items: center; text-align: center; padding: auto;"><b>How the fire spread:</b>
                        </div>
                        <div>
                            <grid-display-vue :rows="5" :cols="7" :figurePosition="0"
                                :allowSlide="true"></grid-display-vue>
                        </div>
                        <p><b class="list">3. </b>Perform another BFS to check whether you can reach the safehouse
                            starting
                            from
                            the top-left corner, and the time needed (if possible) considering the fire spread at each
                            minute
                            and
                            the wall obstacle in the room.</p>
                        <n-card>
                            <n-code :code="bfs_man" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                        <p><b class="list">4.</b>Implement a <b class="link" @click="scrollToBS">binary
                                search</b>
                            to
                            find
                            the maximum waiting time. Check if the escape is
                            possible at each delay time to determine the maximum waiting time.</p>
                        <n-card>
                            <n-code :code="binary_search" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                    </div>
                    <div>
                        <div ref="codeSection" class="subTitle" style="padding-top: 3.75rem;">Complete Code</div>
                        <n-card>
                            <n-code :code="fullcode" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                        <div style="display: flex; align-items: center;">
                            <n-statistic style="font-weight: bold; padding-right: 1.75rem;" label="Time Complexity"><img
                                    style="width: 12.5rem;" src="/website/images/time_complexity.png" alt=""></n-statistic>
                        </div>
                        <div><b>The following data came from Leetcode</b> </div>
                        <div style="display: flex; align-items: center;">
                            <n-statistic style="padding-right: 1.75rem;" label="Run Time"><b>41ms</b></n-statistic>
                            <n-statistic style="padding-right: 1.75rem;" label="Beats"><b>86.50%</b></n-statistic>
                            <n-statistic style="padding-right: 1.75rem;" label="Memory"><b>22.89MB</b></n-statistic>
                            <n-statistic style="padding-right: 1.75rem;" label="Beats"><b>92.93%</b></n-statistic>
                        </div>
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
        background-color: rgba(21, 227, 162, 0.3);
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
    background-color: rgb(211, 211, 211);
    opacity: 0.8;
    border-radius: 2.188rem;
    padding: 0.625 3.125rem;
    overflow: hidden;
    text-overflow: ellipsis;
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
