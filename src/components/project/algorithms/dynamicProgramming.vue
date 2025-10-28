<script setup>
import { projects } from '../project';
import router from '../../../router/router';
import { ref, onMounted, onUnmounted } from 'vue';
import KnapsackVisualizer from './dp/knapsackVisualizer.vue';

const project = ref(null);

const questionBriefing = ref(null);
const solution = ref(null);
const dpSection = ref(null);
const memoizationSection = ref(null);
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
#include <algorithm>
using namespace std;

class Solution {
public:
    int knapsack(int W, vector<int>& weights, vector<int>& values, int n) {
        // Create a 2D DP table
        // dp[i][w] = maximum value achievable with first i items and weight limit w
        vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
        
        // Build table dp[][] in bottom-up manner
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                // If current item's weight is more than capacity, skip it
                if (weights[i - 1] <= w) {
                    // Max of: including current item vs not including it
                    dp[i][w] = max(
                        values[i - 1] + dp[i - 1][w - weights[i - 1]],  // Include
                        dp[i - 1][w]                                      // Exclude
                    );
                } else {
                    // Can't include current item
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        
        return dp[n][W];
    }
    
    // Space-optimized version using 1D array
    int knapsackOptimized(int W, vector<int>& weights, vector<int>& values, int n) {
        vector<int> dp(W + 1, 0);
        
        for (int i = 0; i < n; i++) {
            // Traverse from right to left to avoid overwriting
            for (int w = W; w >= weights[i]; w--) {
                dp[w] = max(dp[w], values[i] + dp[w - weights[i]]);
            }
        }
        
        return dp[W];
    }
};

// Time Complexity: O(n * W) where n is number of items, W is capacity
// Space Complexity: O(n * W) for 2D version, O(W) for optimized version
`;

const dpTableBuild = `// Building the DP table step by step
for (int i = 1; i <= n; i++) {
    for (int w = 1; w <= W; w++) {
        if (weights[i - 1] <= w) {
            // We have two choices:
            // 1. Include item i: get value[i-1] + best solution for remaining weight
            // 2. Exclude item i: keep best solution without this item
            dp[i][w] = max(
                values[i - 1] + dp[i - 1][w - weights[i - 1]],  // Include
                dp[i - 1][w]                                      // Exclude
            );
        } else {
            // Current item too heavy, can't include it
            dp[i][w] = dp[i - 1][w];
        }
    }
}

// Each cell dp[i][w] represents:
// Maximum value achievable using first i items with weight limit w

// Time complexity: O(n * W) - we fill n * W cells
`;

const initialization = `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int knapsack(int W, vector<int>& weights, 
                 vector<int>& values, int n) {
        // Create 2D DP table
        // dp[i][w] = max value with first i items 
        //            and weight limit w
        vector<vector<int>> dp(n + 1, 
                              vector<int>(W + 1, 0));
        
        // Base case: dp[0][w] = 0 (no items)
        // Base case: dp[i][0] = 0 (no capacity)
        // Already initialized to 0
        
        // Time complexity for initialization: O(n * W)
`;

const recursiveFormula = `// The recursive formula for 0/1 Knapsack:
// 
// dp[i][w] = max value using first i items with weight limit w
//
// Recurrence relation:
// If weights[i-1] <= w:
//     dp[i][w] = max(
//         values[i-1] + dp[i-1][w - weights[i-1]],  // Include item i
//         dp[i-1][w]                                  // Exclude item i
//     )
// Else:
//     dp[i][w] = dp[i-1][w]  // Can't include, too heavy
//
// Base cases:
// dp[0][w] = 0  (no items selected)
// dp[i][0] = 0  (no capacity available)

// Example visualization:
// Items: weight=[2, 3, 4], value=[3, 4, 5], capacity=5
//
//     w=0  w=1  w=2  w=3  w=4  w=5
// i=0  0    0    0    0    0    0
// i=1  0    0    3    3    3    3
// i=2  0    0    3    4    4    7
// i=3  0    0    3    4    5    7
//
// dp[3][5] = 7 is the maximum value
`;

const spaceOptimization = `// Space-optimized version using 1D array
int knapsackOptimized(int W, vector<int>& weights, 
                      vector<int>& values, int n) {
    vector<int> dp(W + 1, 0);
    
    for (int i = 0; i < n; i++) {
        // IMPORTANT: Traverse RIGHT TO LEFT
        // This prevents overwriting values we still need
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = max(
                dp[w],                           // Don't take item i
                values[i] + dp[w - weights[i]]   // Take item i
            );
        }
    }
    
    return dp[W];
}

// Why traverse right to left?
// - We need old values from dp[w - weight]
// - If we go left to right, we'd overwrite these values
// - Right to left ensures we use previous iteration's values

// Space complexity reduced from O(n*W) to O(W)!
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <div ref="scrollContainer" style="height: 100%; overflow-y: auto; overflow-x: hidden;">
        <Transition>
            <n-anchor ref="anchorRef" affix :trigger-top="88" :top="88"
                style="z-index: 1; padding: 1.5rem; float: left;">
                <n-anchor-link title="Question Briefing" @click="scrollToQuestion" />
                <n-anchor-link title="First Thought" @click="scrollToFirstThought" />
                <n-anchor-link title="Dynamic Programming" @click="scrollToDP" />
                <n-anchor-link title="Memoization" @click="scrollToMemoization" />
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
                <p>This is the classic <b>0/1 Knapsack Problem</b>, a fundamental Dynamic Programming problem.</p>
                
                <div style="background: rgba(100, 200, 255, 0.1); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem; border-left: 4px solid #64b5f6;">
                    <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">💡 What is the Knapsack Problem? (Simple Explanation)</div>
                    <p style="font-size: 1.1rem; line-height: 1.6;">
                        Imagine you're going on a camping trip and have a backpack that can only carry <b>10 kg</b> of items. 
                        You have several items to choose from:
                        <br><br>
                        • <b>Tent:</b> 5 kg, very useful (value: 8)
                        <br>
                        • <b>Food:</b> 3 kg, essential (value: 6)
                        <br>
                        • <b>Water bottle:</b> 2 kg, important (value: 4)
                        <br>
                        • <b>Book:</b> 1 kg, nice to have (value: 2)
                        <br><br>
                        You can't take everything because the total weight exceeds 10 kg. 
                        <b>Which items should you pack to get the most "value" while staying within the 10 kg limit?</b>
                        <br><br>
                        This is the Knapsack Problem! In real life, it appears in:
                        <br>
                        • 📦 <b>Cargo loading:</b> Which packages to put on a truck with limited space
                        <br>
                        • 💰 <b>Investment:</b> Which projects to invest in with a limited budget
                        <br>
                        • 📱 <b>App development:</b> Which features to include with limited development time
                        <br><br>
                        <b>Why can't we just try every combination?</b> With 20 items, there are over 1 million combinations to check! 
                        Dynamic Programming solves this efficiently by remembering previous decisions and building on them.
                    </p>
                </div>
                
                <n-flex vertical :size="48">
                    <div>
                        <div class="subTitle" ref="questionBriefing">Question Briefing</div>
                        <p style="vertical-align: text-bottom">
                            You are given:
                            <br>
                            • A set of <b class="greyhighlight">n items</b>, each with a weight and a value
                            <br>
                            • A <b class="greyhighlight">knapsack</b> with a maximum weight capacity <b class="greyhighlight">W</b>
                            <br><br>
                            Your goal is to select items to put in the knapsack such that:
                            <br>
                            • The <b class="greyhighlight">total weight</b> doesn't exceed W
                            <br>
                            • The <b class="greyhighlight">total value</b> is maximized
                            <br>
                            • Each item can only be selected <b class="greyhighlight">once</b> (0/1 - either take it or leave it)
                            <br><br>
                            <b>Example:</b>
                            <br>
                            Weights: [2, 3, 4]
                            <br>
                            Values: [3, 4, 5]
                            <br>
                            Capacity: 5
                            <br>
                            Output: 7 (take items 1 and 2: weight = 2+3=5, value = 3+4=7)
                        </p>
                        <div @click="scrollToCode" class="link" style="font-size: 0.625rem;">Click to skip to full code</div>
                    </div>
                    <div>
                        <div ref="firstThought" class="subTitle">First Thought About the Question</div>
                        <p>
                            <b class="list">1.</b> We need to make a <b class="greyhighlight">decision</b> for each item: take it or leave it.<br>
                            <b class="list">2.</b> These decisions are <b class="greyhighlight">interdependent</b> - taking one item affects what else we can take.<br>
                            <b class="list">3.</b> A brute force approach would try all <b class="greyhighlight">2<sup>n</sup> combinations</b> - too slow!<br>
                            <b class="list">4.</b> We have <b class="greyhighlight">overlapping subproblems</b> - same smaller problems appear multiple times.<br>
                            <b class="list">5.</b> This is a perfect candidate for <b class="link" @click="scrollToDP">Dynamic Programming</b>!
                        </p>
                    </div>
                    <div>
                        <div ref="dpSection" class="subTitle">What is Dynamic Programming?</div>
                        <p>
                            <b>Introduction: </b> Dynamic Programming (DP) is an algorithmic technique that solves complex problems by breaking them down into 
                            <b class="greyhighlight">simpler subproblems</b> and storing the results to avoid redundant calculations.
                            <br><br>
                            <b>Key Characteristics:</b>
                            <br>
                            • <b class="greyhighlight">Optimal Substructure:</b> Optimal solution can be constructed from optimal solutions of subproblems
                            <br>
                            • <b class="greyhighlight">Overlapping Subproblems:</b> Same subproblems are solved multiple times
                            <br>
                            • <b class="greyhighlight">Memoization/Tabulation:</b> Store results to avoid recalculation
                            <br><br>
                            <b>Two Main Approaches:</b>
                            <br>
                            1. <b class="greyhighlight">Top-Down (Memoization):</b> Start with original problem, recursively break down, cache results
                            <br>
                            2. <b class="greyhighlight">Bottom-Up (Tabulation):</b> Start with smallest subproblems, build up to original problem
                        </p>
                        <p>
                            <b>Why DP is Powerful:</b>
                            <br>
                            • Reduces exponential time complexity to polynomial time
                            <br>
                            • Transforms recursive solutions into efficient iterative ones
                            <br>
                            • Commonly used in: shortest paths, resource allocation, sequence alignment, game theory
                        </p>
                        <div>Time complexity: <b style="font-size: 1.375rem; font-weight: 2000; font-style: italic; font-family:serif;">O(n*W)</b> for 0/1 Knapsack</div>
                    </div>
                    <div>
                        <div ref="memoizationSection" class="subTitle">DP Table and State Transition</div>
                        <p>
                            In the 0/1 Knapsack problem, we build a 2D table where:
                            <br>
                            • <b class="greyhighlight">dp[i][w]</b> = maximum value achievable using first <b class="greyhighlight">i</b> items with weight limit <b class="greyhighlight">w</b>
                            <br><br>
                            <b>State Transition:</b>
                            <br>
                            For each item i and weight w, we have two choices:
                            <br>
                            1. <b class="greyhighlight">Include item i:</b> value[i] + dp[i-1][w - weight[i]]
                            <br>
                            2. <b class="greyhighlight">Exclude item i:</b> dp[i-1][w]
                            <br><br>
                            We take the <b class="greyhighlight">maximum</b> of these two options.
                        </p>
                        <n-card>
                            <n-code :code="recursiveFormula" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                        <div style="text-align: center; margin-top: 1rem; font-size: 1rem;"><b>DP Table Building Process</b></div>
                    </div>
                    <div>
                        <div class="subTitle" ref="solution">Solution</div>
                        <p><b class="list">1. </b>Initialize the DP table with base cases (0 items or 0 capacity = 0 value).</p>
                        <n-card>
                            <n-code :code="initialization" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                        <p><b class="list">2. </b>Build the DP table by considering each item and weight combination.</p>
                        <n-card>
                            <n-code :code="dpTableBuild" language="cpp" :show-line-numbers=true word-wrap></n-code>
                        </n-card>
                        <p><b class="list">3. </b>Space optimization: reduce from 2D to 1D array.</p>
                        <n-card>
                            <n-code :code="spaceOptimization" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                    </div>
                    <div>
                        <div class="subTitle">Interactive Visualization</div>
                        <p>Try the interactive visualization below to see how the DP table is built step by step:</p>
                        <KnapsackVisualizer :width="'700px'" />
                    </div>
                    <div>
                        <div ref="codeSection" class="subTitle" style="padding-top: 3.75rem;">Complete Code</div>
                        <n-card>
                            <n-code :code="fullcode" language="cpp" show-line-numbers word-wrap></n-code>
                        </n-card>
                        <div style="display: flex; align-items: center;">
                            <n-statistic style="font-weight: bold; padding-right: 1.75rem;" label="Time Complexity">
                                <b style="font-size: 1.375rem; font-weight: 2000; font-style: italic; font-family:serif;">O(n*W)</b>
                            </n-statistic>
                            <n-statistic style="font-weight: bold; padding-right: 1.75rem;" label="Space Complexity">
                                <b style="font-size: 1.375rem; font-weight: 2000; font-style: italic; font-family:serif;">O(n*W) or O(W)</b>
                            </n-statistic>
                        </div>
                        <div><b>Complexity Analysis</b></div>
                        <div style="display: flex; align-items: center;">
                            <n-statistic style="padding-right: 1.75rem;" label="Brute Force Time"><b>O(2<sup>n</sup>)</b></n-statistic>
                            <n-statistic style="padding-right: 1.75rem;" label="DP Time"><b>O(n*W)</b></n-statistic>
                            <n-statistic style="padding-right: 1.75rem;" label="Improvement"><b>Exponential → Polynomial</b></n-statistic>
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
