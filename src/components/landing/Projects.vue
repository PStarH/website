<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timelineContainer = ref(null)

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
])

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

onMounted(() => {
  // 为每个时间轴项添加入场动画
  gsap.utils.toArray('.timeline-item').forEach((item, index) => {
    gsap.from(item, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })
  })
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<template>
  <section class="timeline-section">
    <div class="section-header">
      <h1 class="section-title">My Journey</h1>
      <p class="section-subtitle">A timeline of growth, learning, and creation</p>
    </div>

    <div class="timeline-container" ref="timelineContainer">
      <!-- 中央时间轴 -->
      <div class="timeline-axis"></div>

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
</template>

<style scoped>
.timeline-section {
  min-height: 100vh;
  padding: 4rem 2rem;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-title {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

/* 时间轴容器 */
.timeline-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

/* 中央轴线 */
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

/* 时间轴项目 */
.timeline-item {
  position: relative;
  display: flex;
  margin-bottom: 4rem;
  width: 100%;
}

/* 左侧项目 */
.timeline-left {
  justify-content: flex-start;
}

.timeline-left .timeline-card {
  margin-right: calc(50% + 3rem);
}

.timeline-left .timeline-dot {
  left: calc(50% - 20px);
}

/* 右侧项目 */
.timeline-right {
  justify-content: flex-end;
}

.timeline-right .timeline-card {
  margin-left: calc(50% + 3rem);
}

.timeline-right .timeline-dot {
  right: calc(50% - 20px);
}

/* 时间节点圆点 */
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

/* 玻璃质感卡片 */
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
}

.timeline-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

/* 卡片内容 */
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

/* 链接样式 */
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

/* 多个仓库的网格布局 */
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  word-break: break-word;
}

/* 标签 */
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

/* 响应式设计 - 平板 */
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

/* 响应式设计 - 手机 */
@media (max-width: 768px) {
  .timeline-section {
    padding: 3rem 1rem;
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

  /* 手机端所有卡片在右侧 */
  .timeline-item {
    justify-content: flex-start !important;
  }

  .timeline-card {
    width: calc(100% - 80px);
    margin-left: 60px !important;
    margin-right: 0 !important;
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
</style>
