<template>
    <div class="container" style="padding-left: 72px; padding-right: 72px;">
        <div class="header-section" ref="headerSection">
            <div class="header-title" ref="headerTitle">Project</div>
            <div class="header-description" ref="headerDescription">
                Welcome to my Project showcase. This collection highlights my previous work,
                <br />demonstrating some of my sudden bright ideas. Each project represents a unique challenge
                <br />and innovative solution.
            </div>
        </div>
        <div class="subHead" ref="algorithmTitle">Explained Algorithm Series</div>
        <n-grid :cols="4" :x-gap="12" :y-gap="8" class="projects-grid" ref="projectsGrid">
            <n-gi>
                <div class="projectsCard card-wrapper" 
                     @click="router.push({ name: 'projects-fireEscape' })"
                     @mouseenter="handleCardHover"
                     @mouseleave="handleCardLeave">
                    <div class="glow-border"></div>
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
                <div class="projectsCard card-wrapper" 
                     @click="router.push({ name: 'projects-reversi' })"
                     @mouseenter="handleCardHover"
                     @mouseleave="handleCardLeave">
                    <div class="glow-border"></div>
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
                <div class="projectsCard card-wrapper" 
                     @click="router.push({ name: 'projects-dfs' })"
                     @mouseenter="handleCardHover"
                     @mouseleave="handleCardLeave">
                    <div class="glow-border"></div>
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
                <div class="projectsCard card-wrapper" 
                     @click="router.push({ name: 'projects-dp' })"
                     @mouseenter="handleCardHover"
                     @mouseleave="handleCardLeave">
                    <div class="glow-border"></div>
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
        <div class="subHead" ref="exampleTitle">Example Projects</div>
        <n-grid cols="2" :x-gap="12" :y-gap="8" class="example-projects-grid" ref="exampleGrid">
            <n-gi>
                <div class="project-item">
                    <div class="project-meta">
                        <div class="project-subhead">Example Project 1</div>
                        <div class="project-time">Time: 1970/01/01</div>
                    </div>
                    <div class="projectsCard card-wrapper" 
                         @click="router.push({ name: 'projects-fireEscape' })"
                         @mouseenter="handleCardHover"
                         @mouseleave="handleCardLeave">
                        <div class="glow-border"></div>
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
                    <div class="projectsCard card-wrapper" 
                         @click="router.push({ name: 'projects-fireEscape' })"
                         @mouseenter="handleCardHover"
                         @mouseleave="handleCardLeave">
                        <div class="glow-border"></div>
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
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const router = useRouter();

// Refs for animated elements
const headerTitle = ref(null);
const headerDescription = ref(null);
const algorithmTitle = ref(null);
const projectsGrid = ref(null);
const exampleTitle = ref(null);
const exampleGrid = ref(null);

// Page load animation
onMounted(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    // 1. Header title fades in and slides up
    tl.from(headerTitle.value, {
        opacity: 0,
        y: 30,
        duration: 0.8
    });
    
    // 2. Header description follows
    tl.from(headerDescription.value, {
        opacity: 0,
        y: 20,
        duration: 0.6
    }, "-=0.4");
    
    // 3. Algorithm section title
    tl.from(algorithmTitle.value, {
        opacity: 0,
        y: 20,
        duration: 0.6
    }, "-=0.2");
    
    // 4. Cards stagger in from bottom
    if (projectsGrid.value) {
        const cards = projectsGrid.value.$el.querySelectorAll('.card-wrapper');
        tl.from(cards, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.15
        }, "-=0.3");
    }
    
    // 5. Example projects title
    tl.from(exampleTitle.value, {
        opacity: 0,
        y: 20,
        duration: 0.6
    }, "-=0.2");
    
    // 6. Example projects grid
    if (exampleGrid.value) {
        const exampleItems = exampleGrid.value.$el.querySelectorAll('.project-item');
        tl.from(exampleItems, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.2
        }, "-=0.3");
    }
});

// Card hover animation
const handleCardHover = (event) => {
    const card = event.currentTarget;
    const glowBorder = card.querySelector('.glow-border');
    const tags = card.querySelectorAll('.tag');
    
    // Card lift and scale
    gsap.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
    });
    
    // Enhanced shadow with glow
    gsap.to(card, {
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(100, 150, 255, 0.3)",
        duration: 0.3
    });
    
    // Glow border activation
    gsap.to(glowBorder, {
        opacity: 0.6,
        duration: 0.3
    });
    
    // Tags breathing effect
    gsap.to(tags, {
        scale: 1.05,
        duration: 0.3,
        stagger: 0.05,
        ease: "power1.inOut"
    });
};

// Card leave animation
const handleCardLeave = (event) => {
    const card = event.currentTarget;
    const glowBorder = card.querySelector('.glow-border');
    const tags = card.querySelectorAll('.tag');
    
    // Reset card position and scale
    gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
    });
    
    // Reset shadow
    gsap.to(card, {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        duration: 0.3
    });
    
    // Hide glow border
    gsap.to(glowBorder, {
        opacity: 0,
        duration: 0.3
    });
    
    // Reset tags
    gsap.to(tags, {
        scale: 1,
        duration: 0.3,
        stagger: 0.05,
        ease: "power1.inOut"
    });
};
</script>

<style scoped>
.container {
    align-items: center;
    text-align: center;
    min-height: 100vh;
    background: var(--background-gradient);
    padding: 2rem 1rem;
    color: var(--text-color);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.header-section {
    padding-left: 36px;
    margin: 0 auto;
    max-width: 1400px;
    margin-bottom: 3rem;
}

.header-title {
    font-size: 48px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    color: var(--text-color);
    font-family: 'Inter', 'Montserrat', sans-serif;
}

.header-description {
    color: #a0a0a0;
    line-height: 1.8;
    font-size: 16px;
    font-weight: 400;
}

.subHead {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    padding-bottom: 1.5rem;
    margin-left: 36px;
    margin-top: 3rem;
    color: var(--text-color);
    font-family: 'Inter', 'Montserrat', sans-serif;
}

.projects-grid,
.example-projects-grid {
    max-width: 1400px;
    margin: 0 auto 2rem auto;
}

/* Card wrapper with glow border */
.card-wrapper {
    position: relative;
    overflow: hidden;
}

.glow-border {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
        rgba(100, 150, 255, 0.5), 
        rgba(150, 100, 255, 0.5), 
        rgba(100, 200, 255, 0.5)
    );
    border-radius: 14px;
    opacity: 0;
    z-index: -1;
    filter: blur(8px);
    transition: opacity 0.3s ease;
}

.projectsCard {
    position: relative;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, rgba(58, 51, 83, 0.95) 0%, rgba(45, 40, 70, 0.95) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1;
    will-change: transform, box-shadow;
}

.project-title {
    font-size: 1.25rem;
    margin-bottom: 0.875rem;
    color: var(--text-color);
    font-weight: 600;
    letter-spacing: -0.01em;
}

.tags {
    margin-top: 1.25rem;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
}

.tag {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 6px;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.02em;
    transition: transform 0.3s ease;
    backdrop-filter: blur(4px);
}

.bfs {
    background: linear-gradient(135deg, rgba(13, 52, 249, 0.6) 0%, rgba(13, 52, 249, 0.4) 100%);
    box-shadow: 0 2px 8px rgba(13, 52, 249, 0.3);
}

.mcts {
    background: linear-gradient(135deg, rgba(249, 13, 13, 0.6) 0%, rgba(249, 13, 13, 0.4) 100%);
    box-shadow: 0 2px 8px rgba(249, 13, 13, 0.3);
}

.binary-search {
    background: linear-gradient(135deg, rgba(66, 248, 15, 0.6) 0%, rgba(66, 248, 15, 0.4) 100%);
    box-shadow: 0 2px 8px rgba(66, 248, 15, 0.3);
}

.dfs {
    background: linear-gradient(135deg, rgba(255, 152, 0, 0.6) 0%, rgba(255, 152, 0, 0.4) 100%);
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
}

.backtracking {
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.6) 0%, rgba(156, 39, 176, 0.4) 100%);
    box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
}

.dp {
    background: linear-gradient(135deg, rgba(233, 30, 99, 0.6) 0%, rgba(233, 30, 99, 0.4) 100%);
    box-shadow: 0 2px 8px rgba(233, 30, 99, 0.3);
}

.optimization {
    background: linear-gradient(135deg, rgba(0, 188, 212, 0.6) 0%, rgba(0, 188, 212, 0.4) 100%);
    box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3);
}

.project-item {
    margin-bottom: 2rem;
}

.project-meta {
    margin-left: 36px;
    margin-bottom: 0.75rem;
}

.project-subhead {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.01em;
}

.project-time {
    color: #a0a0a0;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.project-image {
    text-align: center;
    padding: 1.875rem 0;
}

.project-stats {
    padding-left: 36px;
}

/* Responsive design */
@media (min-width: 640px) {
    .projects-grid,
    .example-projects-grid {
        padding-left: 0;
    }

    .project-stats .n-col {
        text-align: center;
    }
}

/* Add smooth transitions for text elements */
.header-title,
.header-description,
.subHead {
    opacity: 1;
    transform: translateY(0);
}
</style>