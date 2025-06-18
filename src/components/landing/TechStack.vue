<template>
  <section class="tech-stack-container" ref="techStackRef">
    <div class="header">
      <div class="title-container">
        <div class="title-with-icon">
          <svg class="stack-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          <h2 class="main-title">{{ displayedTitle }}<span class="cursor">|</span></h2>
        </div>
        <div class="title-underline"></div>
      </div>
      <p class="subtitle">The technological foundation powering my projects</p>
      <div class="header-background-pattern"></div>
    </div>

    <div class="categories-grid">
      <div v-for="category in techCategories" :key="category.name" class="category-container">
        <div class="category-header">
          <h3 class="category-title">{{ category.name }}</h3>
          <span class="tech-count">{{ category.techs.length }} technologies</span>
        </div>
        
        <div class="category-medias" :class="`medias-${category.id}`">
          <div v-for="tech in category.techs" :key="tech.name" class="media">
            <img 
              :src="tech.icon.startsWith('/') ? tech.icon : `https://api.iconify.design/${tech.icon.replace(':', '/')}.svg${tech.color ? `?color=${encodeURIComponent(tech.color)}` : ''}`" 
              :alt="tech.name" 
              @error="handleImageError($event, tech)"
              @load="handleImageLoad($event)"
              :style="tech.color ? { filter: `drop-shadow(0 0 8px ${tech.color}40)` } : {}"
            />
            <span class="tech-label">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, computed, ref, onMounted, nextTick } from 'vue'

const isDarkMode = inject('isDarkMode', ref(true))
const techStackRef = ref(null)
const displayedTitle = ref('')
const fullTitle = 'Development Toolkit'

// 打字机效果
const typewriterEffect = () => {
  let i = 0
  const interval = setInterval(() => {
    if (i <= fullTitle.length) {
      displayedTitle.value = fullTitle.slice(0, i)
      i++
    } else {
      clearInterval(interval)
    }
  }, 100)
}

// 图标错误处理
const handleImageError = (event, tech) => {
  console.warn(`Failed to load icon for ${tech.name}:`, tech.icon)
  // 使用备用图标或隐藏
  event.target.style.opacity = '0.3'
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzMzMzMzMyIvPgo8dGV4dCB4PSIxMiIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Pz88L3RleHQ+Cjwvc3ZnPgo='
}

const handleImageLoad = (event) => {
  event.target.style.opacity = '1'
}

// 预加载图标
const preloadIcons = () => {
  techCategories.forEach(category => {
    category.techs.forEach(tech => {
      const img = new Image()
      img.src = tech.icon.startsWith('/') ? tech.icon : `https://api.iconify.design/${tech.icon.replace(':', '/')}.svg`
    })
  })
}

// 三个主要技术栈分类，每个12个技术（3x4布局）
const techCategories = [
  {
    id: 'frontend',
    name: 'Frontend & UI',
    techs: [
      { name: 'Vue.js', icon: 'logos:vue' },
      { name: 'Vite', icon: 'logos:vitejs' },
      { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon' },
      { name: 'Naive UI', icon: 'logos:naiveui' },
      { name: 'GSAP', icon: 'simple-icons:greensock', color: '#88CE02' },
      { name: 'TypeScript', icon: 'logos:typescript-icon' },
  
      { name: 'Next.js', icon: 'logos:nextjs-icon' },
      { name: 'Vercel', icon: 'logos:vercel-icon' },
      { name: 'Vue Router', icon: 'logos:vue' },
      { name: 'Axios', icon: 'simple-icons:axios', color: '#5A29E4' },
      { name: 'Three.js', icon: 'logos:threejs' },
      { name: 'JavaScript', icon: 'logos:javascript' }
    ]
  },
  {
    id: 'backend',
    name: 'Backend & Database',
    techs: [
      { name: 'Node.js', icon: 'logos:nodejs-icon' },
      { name: 'Python', icon: 'logos:python' },
      { name: 'Django', icon: 'logos:django-icon' },
      { name: 'FastAPI', icon: 'logos:fastapi-icon' },
      { name: 'Flask', icon: 'logos:flask' },
      { name: 'MongoDB', icon: 'logos:mongodb-icon' },
      { name: 'MySQL', icon: 'logos:mysql' },
      { name: 'Redis', icon: 'logos:redis' },
      { name: 'Docker', icon: 'logos:docker-icon' },
      { name: 'Git', icon: 'logos:git-icon' },
      { name: 'Nginx', icon: 'logos:nginx' },
      { name: 'Kubernetes', icon: 'logos:kubernetes' }
    ]
  },
  {
    id: 'ai',
    name: 'AI & Data Science',
    techs: [
      { name: 'PyTorch', icon: 'logos:pytorch-icon' },
      { name: 'LangChain', icon: 'simple-icons:langchain' },
      { name: 'Hugging Face', icon: 'simple-icons:huggingface', color: '#FF9D00' },
      { name: 'Pandas', icon: 'simple-icons:pandas', color: '#150458' },
      { name: 'NumPy', icon: 'logos:numpy' },
      { name: 'ChromaDB', icon: '/images/chroma.svg', color: '#2E2AF6' },
      { name: 'Milvus', icon: 'simple-icons:milvus', color: '#F26722' },
      { name: 'Jupyter', icon: 'logos:jupyter' },
      { name: 'Anaconda', icon: 'simple-icons:anaconda', color: '#44A833' },
      { name: 'spaCy', icon: 'simple-icons:spacy', color: '#09A3D5' },
      { name: 'sklearn', icon: 'simple-icons:scikitlearn', color: '#F7931E' },
      { name: 'CUDA', icon: 'simple-icons:nvidia', color: '#76B900' }
    ]
  }
]

onMounted(async () => {
  await nextTick()
  
  // 启动打字机效果
  setTimeout(() => {
    typewriterEffect()
  }, 500)
  
  // 预加载所有图标
  preloadIcons()
  
  // 延迟动画初始化，等待图标加载
  setTimeout(async () => {
    if (typeof window !== 'undefined') {
      try {
        const { gsap } = await import('gsap')

        let mousePos = { x: 0, y: 0 }
        let oldMousePos = { x: 0, y: 0 }
        
        const root = techStackRef.value
        if (!root) return
        
        // 跟踪鼠标位置
        root.addEventListener("mousemove", (e) => {
          oldMousePos.x = mousePos.x
          oldMousePos.y = mousePos.y
          mousePos.x = e.clientX
          mousePos.y = e.clientY
        })

        // 为每个分类容器设置独立的动画
        techCategories.forEach((category, categoryIndex) => {
          const categoryContainer = root.querySelector(`.medias-${category.id}`)
          if (!categoryContainer) return
          
          const medias = categoryContainer.querySelectorAll('.media')
          
          medias.forEach((media, index) => {
            media.addEventListener('mouseenter', () => {
              // 增强的惯性动画 - 大幅度移动
              const deltaX = Math.min(Math.max((mousePos.x - oldMousePos.x) * 1.5, -50), 50)
              const deltaY = Math.min(Math.max((mousePos.y - oldMousePos.y) * 1.5, -50), 50)
              
              // 清除之前的动画
              gsap.killTweensOf(media)
              
              // 大幅度惯性动画 - 整个卡片移动
              gsap.to(media, {
                x: deltaX,
                y: deltaY,
                rotation: (Math.random() - 0.5) * 15,
                scale: 1.1,
                duration: 0.4,
                ease: "power2.out"
              })
              
              // 强烈的回弹效果
              gsap.to(media, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 1.2,
                delay: 0.3,
                ease: "elastic.out(1, 0.4)"
              })
            })
          })
          
          // 简化的初始入场动画
          gsap.set(medias, { opacity: 0, scale: 0.8 })
          gsap.to(medias, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.05,
            delay: categoryIndex * 0.1
          })
        })
      } catch (error) {
        console.error('GSAP animation error:', error)
      }
    }
  }, 500) // 延迟500ms等待图标加载
})
</script>

<style scoped>
.tech-stack-container {
  height: calc(100vh - 80px); /* 减去footer高度 */
  padding: 30px 40px 10px 40px;
  background: transparent; /* 使用透明背景，继承父容器的背景 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  flex-shrink: 0;
  position: relative;
  padding: 20px 0;
}

.title-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.stack-icon {
  width: 32px;
  height: 32px;
  color: #008CFF;
  opacity: 0.9;
  transition: all 0.3s ease;
}

.header:hover .stack-icon {
  transform: scale(1.1) rotate(5deg);
  opacity: 1;
}

.header:hover .main-title {
  text-shadow: 0 0 40px rgba(0, 140, 255, 0.5);
  transform: scale(1.02);
}

.title-container:hover .title-underline {
  box-shadow: 0 0 15px rgba(0, 140, 255, 0.4);
}

.main-title {
  font-size: 3.2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #008CFF 0%, #7C3AED 50%, #FF4D6D 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  text-shadow: 0 0 30px rgba(0, 140, 255, 0.3);
  position: relative;
  transition: all 0.3s ease;
  min-height: 1.2em; /* 防止高度跳动 */
}

.cursor {
  background: linear-gradient(135deg, #008CFF 0%, #7C3AED 50%, #FF4D6D 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.title-underline {
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #008CFF 25%, #7C3AED 50%, #FF4D6D 75%, transparent 100%);
  border-radius: 2px;
  margin: 0 auto;
  width: 0;
  transition: width 0.8s ease;
  animation: expandUnderline 2s ease 0.5s forwards;
}

@keyframes expandUnderline {
  to {
    width: 100%;
  }
}

.subtitle {
  font-size: 1.3rem;
  color: v-bind("isDarkMode ? '#BAB8B9' : '#666666'");
  margin: 0;
  opacity: 0.85;
  font-weight: 500;
  letter-spacing: 0.01em;
  position: relative;
  z-index: 2;
}

.header-background-pattern {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 140, 255, 0.03) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateX(-50%) scale(1.1);
    opacity: 0.5;
  }
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
  align-items: center;
}

.category-container {
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'");
  border-radius: 20px;
  padding: 30px;
  border: 1px solid v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'");
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.category-container:hover {
  transform: translateY(-5px);
  box-shadow: v-bind("isDarkMode ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.1)'");
  border-color: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'");
}

.category-header {
  text-align: center;
  margin-bottom: 20px;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: v-bind("isDarkMode ? '#ffffff' : '#333333'");
}

.tech-count {
  font-size: 0.9rem;
  color: v-bind("isDarkMode ? '#BAB8B9' : '#666666'");
  opacity: 0.7;
}

.category-medias {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 16px;
  height: 320px;
}

.media {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'");
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: visible; /* 允许动画超出边界 */
  min-height: 62px;
  padding: 6px;
}

.media:hover {
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'");
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 140, 255, 0.15);
}

.media:hover .tech-label {
  color: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'");
}

.media img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  display: block;
  pointer-events: none;
  will-change: transform;
  transition: all 0.3s ease;
  margin-bottom: 3px;
}

.tech-label {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  color: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'");
  line-height: 1.2;
  pointer-events: none;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.media:hover img {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .categories-grid {
    gap: 30px;
  }
  
  .category-container {
    padding: 25px;
  }
  
  .category-medias {
    height: 280px;
    gap: 15px;
  }
  
  .media {
    min-height: 65px;
    padding: 6px;
  }
  
  .media img {
    width: 32px;
    height: 32px;
  }
  
  .tech-label {
    font-size: 9px;
  }
}

@media (max-width: 768px) {
  .tech-stack-container {
    height: calc(100vh - 80px);
    padding: 30px 20px 15px 20px;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .stack-icon {
    width: 28px;
    height: 28px;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .header {
    margin-bottom: 20px;
    padding: 15px 0;
  }
  
  .header-background-pattern {
    width: 150px;
    height: 150px;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .category-container {
    padding: 20px;
  }
  
  .category-medias {
    height: 240px;
    gap: 12px;
  }
  
  .media {
    min-height: 55px;
    padding: 5px;
  }
  
  .media img {
    width: 28px;
    height: 28px;
  }
  
  .tech-label {
    font-size: 9px;
  }
  
  .category-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .tech-stack-container {
    height: calc(100vh - 80px);
    padding: 25px 15px 10px 15px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .stack-icon {
    width: 24px;
    height: 24px;
  }
  
  .title-with-icon {
    gap: 8px;
  }
  
  .header {
    margin-bottom: 15px;
    padding: 10px 0;
  }
  
  .header-background-pattern {
    width: 120px;
    height: 120px;
  }
  
  .categories-grid {
    gap: 20px;
  }
  
  .category-medias {
    height: 200px;
    gap: 10px;
  }
  
  .media {
    min-height: 45px;
    padding: 3px;
  }
  
  .media img {
    width: 24px;
    height: 24px;
  }
  
  .tech-label {
    font-size: 8px;
  }
}

/* 添加渐变边框效果 */
.category-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(0, 140, 255, 0.1), 
    rgba(255, 77, 109, 0.1), 
    rgba(0, 140, 255, 0.1)
  );
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.category-container:hover::before {
  opacity: 1;
}
</style>
