<template>
    <div class="container" style="padding-left: 72px; padding-right: 72px;">
        <!-- Algorithm Series Section -->
        <div class="header-section" ref="headerSection">
            <div class="header-title" ref="headerTitle">Algorithm Visualizations</div>
            <div class="header-description" ref="headerDescription">
                Interactive explorations of classic algorithms and data structures.
                <br />Each project provides step-by-step visualizations to enhance understanding.
            </div>
        </div>
        <div class="subHead" ref="algorithmTitle">Explained Algorithm Series</div>
        <n-grid :cols="4" :x-gap="12" :y-gap="8" class="projects-grid" ref="projectsGrid">
            <n-gi>
                <div class="projectsCard card-wrapper"
                     @click="router.push({ name: 'projects-fireEscape' })">
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
                     @click="router.push({ name: 'projects-reversi' })">
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
                    <div class="tags">
                        <div class="tag mcts">Monte Carlo</div>
                    </div>
                </div>
            </n-gi>
            <n-gi>
                <div class="projectsCard card-wrapper"
                     @click="router.push({ name: 'projects-dfs' })">
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
                     @click="router.push({ name: 'projects-dp' })">
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

        <!-- Growth Timeline Section -->
        <section class="timeline-section" ref="timelineSection">
            <div class="section-header">
                <h1 class="section-title">My Journey</h1>
                <p class="section-subtitle">A timeline of growth, learning, and creation</p>
            </div>

            <div class="timeline-container" ref="timelineContainer">
                <!-- 中央时间轴 -->
                <div class="timeline-axis"></div>

                <!-- 火柴人角色 -->
                <div class="stick-figure" ref="stickFigure">
                    <svg width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
                        <!-- 头部 -->
                        <circle cx="20" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- 身体 -->
                        <line x1="20" y1="18" x2="20" y2="35" stroke="currentColor" stroke-width="2"/>
                        <!-- 手臂 -->
                        <line class="arm-left" x1="20" y1="25" x2="10" y2="30" stroke="currentColor" stroke-width="2"/>
                        <line class="arm-right" x1="20" y1="25" x2="30" y2="30" stroke="currentColor" stroke-width="2"/>
                        <!-- 腿 -->
                        <line class="leg-left" x1="20" y1="35" x2="12" y2="50" stroke="currentColor" stroke-width="2"/>
                        <line class="leg-right" x1="20" y1="35" x2="28" y2="50" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>

                <!-- 时间轴项目 -->
                <div
                    v-for="(project, index) in timeline"
                    :key="index"
                    class="timeline-item"
                    :class="{ 'timeline-left': index % 2 === 0, 'timeline-right': index % 2 === 1 }"
                >
                    <!-- 时间节点圆点 -->
                    <div class="timeline-dot" :style="{ backgroundColor: project.color }">
                        <div class="timeline-dot-icon">{{ project.icon }}</div>
                    </div>

                    <!-- 项目卡片 -->
                    <div class="timeline-card glass-card">
                        <!-- 日期标签 -->
                        <div class="card-date" :style="{ color: project.color }">
                            {{ project.date }}
                        </div>

                        <!-- 项目标题和摘要 -->
                        <h3 class="card-title">{{ project.title }}</h3>
                        <p class="card-summary">{{ project.summary }}</p>
                        <p class="card-description">{{ project.description }}</p>

                        <!-- 链接区域 -->
                        <div v-if="isMultipleRepos(project.repo)" class="repo-grid">
                            <a
                                v-for="(link, linkIndex) in getRepoLinks(project.repo)"
                                :key="linkIndex"
                                :href="link.url.includes('Private') ? '#' : link.url"
                                target="_blank"
                                class="repo-mini-card"
                                :class="{ 'repo-private': link.url.includes('Private') }"
                                :style="{ borderColor: project.color }"
                            >
                                <span class="repo-icon">
                                    {{ link.url.includes('Private') ? '🔒' : '📦' }}
                                </span>
                                <span class="repo-name">{{ extractProjectName(link.url) }}</span>
                            </a>
                        </div>
                        <a
                            v-else
                            :href="project.repo"
                            target="_blank"
                            class="repo-link"
                            :style="{ backgroundColor: project.color + '20', borderColor: project.color }"
                        >
                            <span>View on GitHub</span>
                            <span class="repo-arrow">→</span>
                        </a>

                        <!-- 标签 -->
                        <div class="card-tags">
                            <span
                                v-for="tag in project.tags"
                                :key="tag"
                                class="card-tag"
                                :style="{
                                    backgroundColor: project.color + '20',
                                    borderColor: project.color,
                                    color: project.color
                                }"
                            >
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();

const timelineSection = ref(null);
const timelineContainer = ref(null);
const stickFigure = ref(null);
const headerTitle = ref(null);
const headerDescription = ref(null);
const algorithmTitle = ref(null);
const projectsGrid = ref(null);

// 成长时间轴数据
const timeline = ref([
  {
    date: "2024-10-17",
    title: "MSTSearch",
    repo: "https://github.com/PStarH/MSTSearch",
    summary: "First project that achieved 50 stars and included both backend and frontend.",
    description: "A search aggregation platform that crawls multiple search engines, ranks results using custom metrics, and leverages AI to generate summaries and answers. Built with a Python backend and Vue.js frontend.",
    tags: ["AI", "Fullstack", "Search", "Python", "Vue"],
    icon: "🔍",
    color: "#667eea"
  },
  {
    date: "2024-11-07",
    title: "Personalized-LLM",
    repo: "https://github.com/PStarH/Personalized-LLM",
    summary: "First project working directly with LLMs.",
    description: "A framework enhancing LLM accuracy and personalization using RAG, local data embedding, web crawling, and contextual analysis.",
    tags: ["LLM", "RAG", "AI", "Personalization", "Chain-of-Thoughts"],
    icon: "🤖",
    color: "#764ba2"
  },
  {
    date: "2024-11-18",
    title: "PackLight & CalmWake",
    repo: ["https://github.com/PStarH/PackLight", "https://github.com/PStarH/CalmWake"],
    summary: "First self-built frontend projects.",
    description: "PackLight is a packing list app built with React and TypeScript. CalmWake Clock provides a smooth, minimalistic clock interface with customizable options.",
    tags: ["Frontend", "React", "TypeScript", "UI Design"],
    icon: "💼",
    color: "#f093fb"
  },
  {
    date: "2024-11-27",
    title: "My GBIF Biodiversity Project",
    repo: "https://github.com/PStarH/my-gbif-project",
    summary: "First project using a public API.",
    description: "A web app using the GBIF API to explore biodiversity data, display random species, and allow database-wide searches.",
    tags: ["API", "Frontend", "Biodiversity", "Data Visualization"],
    icon: "🦋",
    color: "#4ecdc4"
  },
  {
    date: "2024-12-01",
    title: "MoodNotes",
    repo: "https://github.com/PStarH/MoodNotes",
    summary: "First published app.",
    description: "A journaling app designed to record emotions and promote self-reflection through mood tracking and visualization.",
    tags: ["Frontend", "App", "Emotion", "Vue"],
    icon: "📝",
    color: "#ff6b6b"
  },
  {
    date: "2024-12-03",
    title: "React Forum Template / GAN-CNN-Image-Fix / ChatterLink",
    repo: [
      "https://github.com/PStarH/react-forum-template",
      "https://github.com/PStarH/GAN-CNN-Image-Fix",
      "https://github.com/PStarH/ChatterLink"
    ],
    summary: "A group of open-source projects made in early 2025.",
    description: "Includes a React forum template for communities, an image restoration model using GAN/CNN, and a peer-to-peer encrypted chat app focusing on privacy.",
    tags: ["Open Source", "React", "AI", "Privacy", "Template"],
    period: "2025-01",
    icon: "🚀",
    color: "#95e1d3"
  },
  {
    date: "2025-02",
    title: "LLM Research and Applications",
    repo: [
      "https://github.com/PStarH/WebDeepResearch",
      "https://github.com/PStarH/ModelMixPro",
      "Private: Pasa-Paper-Chatbot"
    ],
    summary: "Projects focusing on automation, reasoning, and academic search using LLMs.",
    description: "WebDeepResearch automates web exploration with source validation. ModelMixPro merges reasoning and execution models into a unified API. Pasa-Paper-Chatbot builds upon ByteDance's PaSa for academic paper analysis.",
    tags: ["LLM", "Automation", "Web", "FastAPI", "Research"],
    icon: "🔬",
    color: "#a29bfe"
  },
  {
    date: "2025-03",
    title: "Open Source Contributions",
    repo: {
      "llama-index": "https://github.com/run-llama/llama_index",
      "dify-docs": "https://github.com/langgenius/dify-docs-archived",
      "ragflow": "https://github.com/infiniflow/ragflow"
    },
    summary: "First open-source PRs merged.",
    description: "Contributed to llama-index (first merged PR), dify-docs, and ragflow, improving documentation and LLM integration. Marked the start of involvement in the global open-source ecosystem.",
    tags: ["Open Source", "LLM", "Community"],
    icon: "🌐",
    color: "#fd79a8"
  },
  {
    date: "2025-04",
    title: "Second.me (Core Developer)",
    repo: "https://github.com/mindverse/Second-Me",
    summary: "First time being called a Core Developer.",
    description: "Second.me lets users train an AI version of themselves using Hierarchical Memory Modeling (HMM) and the Me-Alignment Algorithm. It enables digital identity sharing across a decentralized network, with modules for AI roleplay and collaboration.",
    tags: ["AI", "Identity", "Decentralization", "Core Developer"],
    icon: "👤",
    color: "#6c5ce7"
  }
]);

// 判断项目有多个链接
const isMultipleRepos = (repo) => {
  return Array.isArray(repo) || (typeof repo === 'object' && !Array.isArray(repo))
}

// 获取项目链接数组
const getRepoLinks = (repo) => {
  if (Array.isArray(repo)) {
    return repo.map((link, index) => ({
      url: link,
      name: link.includes('Private') ? link : `Project ${index + 1}`
    }))
  } else if (typeof repo === 'object') {
    return Object.entries(repo).map(([name, url]) => ({ name, url }))
  }
  return [{ url: repo, name: 'View Project' }]
}

// 提取项目名称从链接
const extractProjectName = (url) => {
  if (url.includes('Private:')) {
    return url.replace('Private:', '').trim()
  }
  const match = url.match(/github\.com\/[^\/]+\/([^\/]+)/)
  return match ? match[1] : 'Project'
}

let ctx;

onMounted(() => {
    ctx = gsap.context(() => {
        // Stick figure walking animation along timeline
        if (stickFigure.value && timelineSection.value) {
            const timelineHeight = timelineSection.value.offsetHeight;

            // Main movement along the timeline
            gsap.to(stickFigure.value, {
                y: timelineHeight - 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: timelineSection.value,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1,
                    onUpdate: (self) => {
                        // Add walking animation based on velocity
                        const velocity = self.getVelocity();
                        if (Math.abs(velocity) > 100) {
                            // Walking
                            if (!stickFigure.value.classList.contains('walking')) {
                                stickFigure.value.classList.add('walking');
                            }
                        } else {
                            stickFigure.value.classList.remove('walking');
                        }
                    }
                }
            });

            // Walking animation for limbs
            const walkTimeline = gsap.timeline({ repeat: -1, paused: false });
            walkTimeline
                .to('.leg-left', { rotation: 20, transformOrigin: '50% 0%', duration: 0.3, ease: 'sine.inOut' })
                .to('.leg-right', { rotation: -20, transformOrigin: '50% 0%', duration: 0.3, ease: 'sine.inOut' }, 0)
                .to('.arm-left', { rotation: -15, transformOrigin: '100% 50%', duration: 0.3, ease: 'sine.inOut' }, 0)
                .to('.arm-right', { rotation: 15, transformOrigin: '0% 50%', duration: 0.3, ease: 'sine.inOut' }, 0)
                .to('.leg-left', { rotation: -20, transformOrigin: '50% 0%', duration: 0.3, ease: 'sine.inOut' })
                .to('.leg-right', { rotation: 20, transformOrigin: '50% 0%', duration: 0.3, ease: 'sine.inOut' }, 0.3)
                .to('.arm-left', { rotation: 15, transformOrigin: '100% 50%', duration: 0.3, ease: 'sine.inOut' }, 0.3)
                .to('.arm-right', { rotation: -15, transformOrigin: '0% 50%', duration: 0.3, ease: 'sine.inOut' }, 0.3);
        }

        // Enhanced timeline items scroll animations with stagger and rotation
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            const isLeft = index % 2 === 0;
            const isMobile = window.innerWidth <= 768;

            gsap.from(item, {
                opacity: 0,
                y: 80,
                x: isMobile ? 0 : (isLeft ? -50 : 50),
                rotationY: isMobile ? 0 : (isLeft ? -15 : 15),
                scale: 0.9,
                duration: 1,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    end: 'top 30%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Card mouse move effect (desktop only)
            if (!isMobile) {
                const card = item.querySelector('.timeline-card');
                if (card) {
                    card.addEventListener('mousemove', (e) => {
                        const rect = card.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        card.style.setProperty('--mouse-x', `${x}%`);
                        card.style.setProperty('--mouse-y', `${y}%`);
                    });
                }
            }
        });

        // Algorithm section animations
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.from(headerTitle.value, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: headerTitle.value,
                start: 'top 80%'
            }
        });

        tl.from(headerDescription.value, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            scrollTrigger: {
                trigger: headerDescription.value,
                start: 'top 80%'
            }
        }, "-=0.4");

        tl.from(algorithmTitle.value, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            scrollTrigger: {
                trigger: algorithmTitle.value,
                start: 'top 80%'
            }
        }, "-=0.2");

        if (projectsGrid.value) {
            const cards = projectsGrid.value.$el.querySelectorAll('.card-wrapper');
            gsap.from(cards, {
                opacity: 0,
                y: 50,
                duration: 0.6,
                stagger: 0.15,
                clearProps: 'all',
                scrollTrigger: {
                    trigger: projectsGrid.value.$el,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        }
    });
});

onBeforeUnmount(() => {
    if (ctx) {
        ctx.revert();
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<style scoped>
/* Timeline Section Styles */
.timeline-section {
    padding: 4rem 0 6rem 0;
    margin-bottom: 4rem;
}

.section-header {
    text-align: center;
    margin-bottom: 5rem;
}

.section-title {
    font-size: 3.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #bbc2e1 0%, #dbcce9 50%, #eacaee 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
}

.section-subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
}

.timeline-container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 0;
}

.timeline-axis {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg,
        transparent 0%,
        rgba(102, 126, 234, 0.8) 5%,
        rgba(102, 126, 234, 0.8) 95%,
        transparent 100%
    );
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
    transform: translateX(-50%);
}

/* Stick Figure Character */
.stick-figure {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    z-index: 100;
    color: #667eea;
    filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.8));
    will-change: transform;
}

.stick-figure svg {
    display: block;
}

.stick-figure.walking .leg-left,
.stick-figure.walking .leg-right,
.stick-figure.walking .arm-left,
.stick-figure.walking .arm-right {
    animation: none;
}

/* Walking animation keyframes */
@keyframes walk {
    0%, 100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(20deg);
    }
    75% {
        transform: rotate(-20deg);
    }
}

.timeline-item {
    position: relative;
    display: flex;
    margin-bottom: 4rem;
    width: 100%;
}

.timeline-left {
    justify-content: flex-start;
}

.timeline-left .timeline-card {
    margin-right: calc(50% + 3rem);
}

.timeline-left .timeline-dot {
    left: calc(50% - 20px);
}

.timeline-right {
    justify-content: flex-end;
}

.timeline-right .timeline-card {
    margin-left: calc(50% + 3rem);
}

.timeline-right .timeline-dot {
    right: calc(50% - 20px);
}

.timeline-dot {
    position: absolute;
    top: 2rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.3),
                0 0 0 8px rgba(255, 255, 255, 0.1);
    z-index: 10;
    transition: all 0.3s ease;
}

.timeline-dot:hover {
    transform: scale(1.2);
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.3),
                0 0 0 12px rgba(255, 255, 255, 0.2),
                0 0 30px currentColor;
}

.timeline-dot-icon {
    font-size: 1.5rem;
}

.glass-card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.timeline-card {
    padding: 2rem;
    width: calc(50% - 4rem);
    position: relative;
    overflow: hidden;
    perspective: 1000px;
    transform-style: preserve-3d;
}

.timeline-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.3);
}

.timeline-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.timeline-card:hover::before {
    opacity: 1;
}

.card-date {
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.card-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 0.75rem 0;
    line-height: 1.3;
}

.card-summary {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    margin-bottom: 1rem;
    font-style: italic;
}

.card-description {
    font-size: 0.95rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
}

.repo-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    border: 2px solid;
    text-decoration: none;
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.repo-link:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.repo-arrow {
    font-size: 1.25rem;
    transition: transform 0.3s ease;
}

.repo-link:hover .repo-arrow {
    transform: translateX(5px);
}

.repo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.repo-mini-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 10px;
    border: 2px solid;
    background: rgba(255, 255, 255, 0.05);
    text-decoration: none;
    color: #ffffff;
    transition: all 0.3s ease;
}

.repo-mini-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.repo-mini-card.repo-private {
    opacity: 0.7;
    cursor: not-allowed;
}

.repo-mini-card.repo-private:hover {
    transform: none;
}

.repo-icon {
    font-size: 1.75rem;
}

.repo-name {
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
    word-break: break-word;
}

.card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.card-tag {
    padding: 0.4rem 0.85rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid;
    transition: all 0.3s ease;
}

.card-tag:hover {
    transform: scale(1.05);
}

/* Algorithm Section Styles */
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

.projects-grid {
    max-width: 1400px;
    margin: 0 auto 2rem auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 1fr;
    gap: 12px 8px;
}

.card-wrapper {
    position: relative;
}

.projectsCard {
    position: relative;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, rgba(58, 51, 83, 0.95) 0%, rgba(45, 40, 70, 0.95) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    will-change: transform;
}

.projectsCard:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(102, 126, 234, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
    z-index: 10;
}

.projectsCard:active {
    transform: translateY(-6px) scale(1.01);
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
    backdrop-filter: blur(4px);
    transition: transform 0.2s ease, filter 0.2s ease;
}

.tag:hover {
    transform: translateY(-2px);
    filter: brightness(1.2);
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

/* Responsive Design - Timeline */
@media (max-width: 1024px) {
    .timeline-card {
        width: calc(50% - 3rem);
    }

    .timeline-left .timeline-card {
        margin-right: calc(50% + 2.5rem);
    }

    .timeline-right .timeline-card {
        margin-left: calc(50% + 2.5rem);
    }

    .section-title {
        font-size: 2.5rem;
    }
}

@media (max-width: 768px) {
    .timeline-section {
        padding: 3rem 0;
    }

    .section-header {
        margin-bottom: 3rem;
    }

    .section-title {
        font-size: 2rem;
    }

    .section-subtitle {
        font-size: 1rem;
    }

    /* 手机端轴线移到左侧 */
    .timeline-axis {
        left: 20px;
    }

    /* 手机端火柴人也移到左侧 */
    .stick-figure {
        left: 20px;
        transform: translateX(-50%) scale(0.8);
    }

    /* 手机端所有卡片在右侧 */
    .timeline-item {
        justify-content: flex-start !important;
    }

    .timeline-card {
        width: calc(100% - 80px);
        margin-left: 60px !important;
        margin-right: 0 !important;
        perspective: none;
    }

    .timeline-card:hover {
        transform: translateY(-5px) scale(1.01);
    }

    .timeline-dot {
        left: 0 !important;
        right: auto !important;
    }

    .card-title {
        font-size: 1.4rem;
    }

    .repo-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .section-title {
        font-size: 1.75rem;
    }

    .timeline-card {
        padding: 1.5rem;
    }

    .card-title {
        font-size: 1.25rem;
    }

    .timeline-dot {
        width: 35px;
        height: 35px;
    }

    .timeline-dot-icon {
        font-size: 1.25rem;
    }
}

@media (min-width: 640px) {
    .projects-grid {
        padding-left: 0;
    }
}

/* 修复explained algorithm部分卡片垂直位置不一致 */
.projects-grid :deep(.n-gi) {
    display: flex;
    flex-direction: column;
}

.projectsCard {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}
</style>
