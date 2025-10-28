<script setup>
import { projects } from '../project';
import router from '../../../router/router';
import { ref } from 'vue';
import KnapsackVisualizer from './dp/knapsackVisualizer.vue';

const project = ref(null);

const questionBriefing = ref(null);
const solution = ref(null);
const dpSection = ref(null);
const memoizationSection = ref(null);
const codeSection = ref(null);
const scrollContainer = ref(null);
const firstThought = ref(null);

const fullcode = `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int knapsack(int W, vector<int>& weights, 
                 vector<int>& values, int n) {
        // dp[i][w] = max value with first i items 
        //            and weight limit w
        vector<vector<int>> dp(n + 1, 
                              vector<int>(W + 1, 0));
        
        // Build table bottom-up
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                if (weights[i - 1] <= w) {
                    // Max of: include vs exclude
                    dp[i][w] = max(
                        values[i - 1] + 
                        dp[i - 1][w - weights[i - 1]],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        
        return dp[n][W];
    }
    
    // Space-optimized version
    int knapsackOptimized(int W, 
                         vector<int>& weights, 
                         vector<int>& values, 
                         int n) {
        vector<int> dp(W + 1, 0);
        
        for (int i = 0; i < n; i++) {
            // Right to left traversal
            for (int w = W; w >= weights[i]; w--) {
                dp[w] = max(dp[w], 
                           values[i] + 
                           dp[w - weights[i]]);
            }
        }
        
        return dp[W];
    }
};

// Time: O(n * W), Space: O(n * W) or O(W)
`;

const dpTableBuild = `// Building the DP table
for (int i = 1; i <= n; i++) {
    for (int w = 1; w <= W; w++) {
        if (weights[i - 1] <= w) {
            // Two choices:
            // 1. Include: value[i-1] + 
            //    best for remaining weight
            // 2. Exclude: keep best without
            dp[i][w] = max(
                values[i - 1] + 
                dp[i - 1][w - weights[i - 1]],
                dp[i - 1][w]
            );
        } else {
            // Too heavy, can't include
            dp[i][w] = dp[i - 1][w];
        }
    }
}

// dp[i][w] = max value using first i 
//            items with weight limit w
// Time: O(n * W)
`;

const initialization = `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int knapsack(int W, 
                 vector<int>& weights, 
                 vector<int>& values, 
                 int n) {
        // Create 2D DP table
        vector<vector<int>> dp(n + 1, 
                              vector<int>(W + 1, 0));
        
        // Base: dp[0][w] = 0 (no items)
        // Base: dp[i][0] = 0 (no capacity)
        // Already initialized to 0
        
        // Time: O(n * W)
`;

const recursiveFormula = `// Recursive formula for 0/1 Knapsack:
// 
// dp[i][w] = max value using first i 
//            items with weight limit w
//
// Recurrence:
// If weights[i-1] <= w:
//     dp[i][w] = max(
//         values[i-1] + 
//         dp[i-1][w - weights[i-1]],
//         dp[i-1][w]
//     )
// Else:
//     dp[i][w] = dp[i-1][w]
//
// Base cases:
// dp[0][w] = 0  (no items)
// dp[i][0] = 0  (no capacity)

// Example:
// weight=[2,3,4], value=[3,4,5], cap=5
//
//     0  1  2  3  4  5
// 0   0  0  0  0  0  0
// 1   0  0  3  3  3  3
// 2   0  0  3  4  4  7
// 3   0  0  3  4  5  7
//
// dp[3][5] = 7 (max value)
`;

const spaceOptimization = `// Space-optimized 1D array version
int knapsackOptimized(int W, 
                      vector<int>& weights, 
                      vector<int>& values, 
                      int n) {
    vector<int> dp(W + 1, 0);
    
    for (int i = 0; i < n; i++) {
        // RIGHT TO LEFT traversal
        // Prevents overwriting needed values
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = max(
                dp[w],  // Don't take item
                values[i] + dp[w - weights[i]]
            );
        }
    }
    
    return dp[W];
}

// Why right to left?
// - Need old values from dp[w - weight]
// - Left to right overwrites them
// - Right to left uses previous values

// Space: O(n*W) → O(W) optimization!
`;

initial();

function initial() {
    project.value = projects.find(project => project.routerKey == router.currentRoute.value.name)
}

function scrollToDP() {
    dpSection.value.scrollIntoView({ behavior: 'smooth' });
}

function scrollToMemoization() {
    memoizationSection.value.scrollIntoView({ behavior: 'smooth' });
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
                    <p>This is the classic <b>0/1 Knapsack Problem</b>, a fundamental Dynamic Programming problem.</p>
                    
                    <div style="background: rgba(100, 200, 255, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 2rem; border-left: 4px solid #64b5f6;">
                        <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.8rem;">💡 What is the Knapsack Problem?</div>
                        <p style="font-size: 1rem; line-height: 1.5;">
                            Imagine packing for a camping trip with a backpack that can only carry <b>10 kg</b>:
                            <br><br>
                            • <b>Tent:</b> 5 kg, value: 8
                            <br>
                            • <b>Food:</b> 3 kg, value: 6
                            <br>
                            • <b>Water:</b> 2 kg, value: 4
                            <br>
                            • <b>Book:</b> 1 kg, value: 2
                            <br><br>
                            <b>Which items give you the most value within 10 kg?</b>
                            <br><br>
                            Real-world uses:
                            <br>
                            📦 Cargo loading
                            <br>
                            💰 Investment decisions
                            <br>
                            📱 Feature selection
                            <br><br>
                            With 20 items, there are 1 million+ combinations! 
                            DP solves this efficiently.
                        </p>
                    </div>
                    
                    <n-flex vertical :size="48">
                        <div>
                            <div class="subTitle" ref="questionBriefing">Question Briefing</div>
                            <p style="vertical-align: text-bottom">
                                You are given:
                                <br>
                                • A set of <b class="greyhighlight">n items</b>, each with weight and value
                                <br>
                                • A <b class="greyhighlight">knapsack</b> with max capacity <b class="greyhighlight">W</b>
                                <br><br>
                                Your goal:
                                <br>
                                • <b class="greyhighlight">Total weight</b> ≤ W
                                <br>
                                • <b class="greyhighlight">Total value</b> is maximized
                                <br>
                                • Each item used <b class="greyhighlight">once</b> (0 or 1)
                                <br><br>
                                <b>Example:</b>
                                <br>
                                Weight: [2, 3, 4]
                                <br>
                                Value: [3, 4, 5]
                                <br>
                                Capacity: 5
                                <br>
                                Output: 7 (items 1+2: w=5, v=7)
                            </p>
                            <div @click="scrollToCode" class="link" style="font-size: 0.625rem;">Skip to full code</div>
                        </div>
                        <div>
                            <div ref="firstThought" class="subTitle">First Thought</div>
                            <p>
                                <b class="list">1.</b> Make <b class="greyhighlight">decision</b> for each item: take/leave.<br>
                                <b class="list">2.</b> Decisions are <b class="greyhighlight">interdependent</b>.<br>
                                <b class="list">3.</b> Brute force tries all <b class="greyhighlight">2<sup>n</sup></b> combos - too slow!<br>
                                <b class="list">4.</b> Has <b class="greyhighlight">overlapping subproblems</b>.<br>
                                <b class="list">5.</b> Perfect for <b class="link" @click="scrollToDP">Dynamic Programming</b>!
                            </p>
                        </div>
                        <div>
                            <div ref="dpSection" class="subTitle">What is DP?</div>
                            <p>
                                <b>Introduction: </b> Dynamic Programming solves complex problems by breaking into 
                                <b class="greyhighlight">simpler subproblems</b> and storing results.
                                <br><br>
                                <b>Key Points:</b>
                                <br>
                                • <b class="greyhighlight">Optimal Substructure</b>
                                <br>
                                • <b class="greyhighlight">Overlapping Subproblems</b>
                                <br>
                                • <b class="greyhighlight">Memoization/Tabulation</b>
                                <br><br>
                                <b>Two Approaches:</b>
                                <br>
                                1. <b class="greyhighlight">Top-Down:</b> Recursive + cache
                                <br>
                                2. <b class="greyhighlight">Bottom-Up:</b> Iterative table
                            </p>
                            <div style="text-align: center; padding-bottom: 0.156rem;"><b>DP Concept</b></div>
                            <p>
                                <b>Why DP is Powerful:</b>
                                <br>
                                • Exponential → Polynomial time
                                <br>
                                • Efficient iterative solutions
                                <br>
                                • Used in: paths, allocation, alignment
                            </p>
                            <div>Time: <b style="font-size: 1.375rem; font-weight: 2000; font-style: italic; font-family:serif;">O(n*W)</b></div>
                        </div>
                        <div>
                            <div ref="memoizationSection" class="subTitle">DP Table & Transition</div>
                            <p>
                                In 0/1 Knapsack, we build 2D table:
                                <br>
                                • <b class="greyhighlight">dp[i][w]</b> = max value with first <b class="greyhighlight">i</b> items, weight limit <b class="greyhighlight">w</b>
                                <br><br>
                                <b>State Transition:</b>
                                <br>
                                For item i and weight w:
                                <br>
                                1. <b class="greyhighlight">Include:</b> value[i] + dp[i-1][w-weight[i]]
                                <br>
                                2. <b class="greyhighlight">Exclude:</b> dp[i-1][w]
                                <br><br>
                                Take <b class="greyhighlight">maximum</b> of both.
                            </p>
                            <n-card>
                                <n-code :code="recursiveFormula" language="cpp" show-line-numbers word-wrap></n-code>
                            </n-card>
                        </div>
                        <div>
                            <div class="subTitle" ref="solution">Solution</div>
                            <p><b class="list">1. </b>Initialize DP table with base cases.</p>
                            <n-card>
                                <n-code :code="initialization" language="cpp" show-line-numbers word-wrap></n-code>
                            </n-card>
                            <p><b class="list">2. </b>Build DP table for each item/weight.</p>
                            <n-card>
                                <n-code :code="dpTableBuild" language="cpp" :show-line-numbers=true word-wrap></n-code>
                            </n-card>
                            <p><b class="list">3. </b>Space optimization: 2D → 1D array.</p>
                            <n-card>
                                <n-code :code="spaceOptimization" language="cpp" show-line-numbers word-wrap></n-code>
                            </n-card>
                        </div>
                        <div>
                            <div class="subTitle">Interactive Visualization</div>
                            <p>Try the visualization below to see how DP table is built:</p>
                            <KnapsackVisualizer :width="'100%'" />
                        </div>
                        <div>
                            <div ref="codeSection" class="subTitle" style="padding-top: 3.75rem;">Complete Code</div>
                            <n-card>
                                <n-code :code="fullcode" language="cpp" show-line-numbers word-wrap></n-code>
                            </n-card>
                            <div style="display: flex; align-items: center;">
                                <n-statistic style="font-weight: bold; padding-right: 1.75rem;" label="Time Complexity">
                                    <img style="width: 100%" src="/website/images/time_complexity_nw.png" 
                                        alt="O(n*W)">
                                </n-statistic>
                            </div>
                            <div><b>Complexity Analysis</b></div>
                            <div style="display: flex; align-items: center; flex-wrap: wrap;">
                                <n-statistic style="padding-right: 1.75rem; padding-bottom: 1rem;" label="Brute Force"><b>O(2<sup>n</sup>)</b></n-statistic>
                                <n-statistic style="padding-right: 1.75rem; padding-bottom: 1rem;" label="DP Time"><b>O(n*W)</b></n-statistic>
                                <n-statistic style="padding-right: 1.75rem; padding-bottom: 1rem;" label="Improvement"><b>Exponential → Polynomial</b></n-statistic>
                            </div>
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
