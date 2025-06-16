<script setup>
import { ref, onMounted, computed, inject, nextTick } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { techStack, categories } from '../../data/techStack.js'
import { gsap } from 'gsap'

const router = useRouter()
const roles = ref(['Full-stack Developer', 'AI Enthusiast', 'Data Analyst', 'NLP Developer', 'Creative Coder', 'Algorithm Designer', 'Automation Guru'])
const currentRoleIndex = ref(0)
const typedText = ref('')
const showCursor = ref(true)
const isDarkMode = inject('isDarkMode', ref(true))

const skills = ref([
  { name: 'Full-stack Developer', type: 'info' },
  { name: 'AI Enthusiast', type: 'success' },
  { name: 'Data Analyst', type: 'warning' },
  { name: 'Innovator', type: 'primary' }
])

onMounted(() => {
  typeNextRole()
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
  
  // 等待DOM渲染完成后执行动画
  nextTick(() => {
    animateSkills()
  })
})

function animateSkills() {
  const tl = gsap.timeline()
  
  // 初始化所有技能标签为不可见状态，从右边很远的地方开始
  gsap.set('.skill-tag', {
    opacity: 0,
    x: 400, // 从更远的地方开始
    scale: 0.2,
    rotation: 35, // 更大的旋转角度
    skewX: 20, // 更大的倾斜
    transformOrigin: 'center center'
  })
  
  // 为容器添加震动效果的准备
  gsap.set('.skills-container', {
    transformOrigin: 'left center'
  })
  
  // 创建紧凑高效的碰撞飞入动画（3秒内完成）
  skills.value.forEach((skill, index) => {
    // 第一阶段：高速冲击
    tl.to(`.skill-tag:nth-child(${index + 1})`, {
      opacity: 1,
      x: -10, // 减少冲过头距离
      scale: 1.3, // 撞击时放大
      rotation: -4,
      skewX: -2,
      duration: 0.2, // 进一步加快冲击
      ease: 'power4.out',
      delay: index * 0.5 + 0.8 // 大幅减少间隔和延迟
    })
    
    // 第二阶段：快速震动回弹
    .to(`.skill-tag:nth-child(${index + 1})`, {
      x: 2, // 更小的反弹
      scale: 0.98,
      rotation: 0.5,
      duration: 0.15, // 更快的震动
      ease: 'power2.inOut',
      onStart: function() {
        // 简化震动效果
        gsap.to('.skills-container', {
          x: index % 2 === 0 ? 3 : -3,
          duration: 0.02,
          repeat: 2,
          yoyo: true,
          ease: 'power2.inOut'
        })
        
        // 增强冲击波效果
        gsap.fromTo(`.skill-tag:nth-child(${index + 1})`, {
          boxShadow: '0 0 0 0 rgba(0, 140, 255, 1), 0 0 0 0 rgba(255, 77, 109, 0.8)'
        }, {
          boxShadow: '0 0 0 25px rgba(0, 140, 255, 0), 0 0 0 40px rgba(255, 77, 109, 0)', // 增大冲击波范围
          duration: 0.4, // 延长持续时间
          ease: 'power2.out'
        })
      }
    })

    // 第三阶段：快速稳定
    .to(`.skill-tag:nth-child(${index + 1})`, {
      x: 0,
      scale: 1,
      rotation: 0,
      skewX: 0,
      duration: 0.25, // 大幅缩短稳定时间
      ease: 'elastic.out(1.5, 0.6)',
      onComplete: function() {
        // 立即恢复容器位置
        gsap.set('.skills-container', { x: 0 })
      }
    }, '-=0.05')
    
    // 第四阶段：简单弹跳
    .to(`.skill-tag:nth-child(${index + 1})`, {
      y: -5, // 降低弹跳高度
      duration: 0.1,
      ease: 'power2.out'
    }, '-=0.2')
    
    .to(`.skill-tag:nth-child(${index + 1})`, {
      y: 0,
      duration: 0.15,
      ease: 'bounce.out',
      onComplete: function() {
        // 在完全停稳后添加粒子爆炸效果
        createParticles(`.skill-tag:nth-child(${index + 1})`)
      }
    })
  })
}

// 创建增强的粒子爆炸效果
function createParticles(selector) {
  const element = document.querySelector(selector)
  if (!element) return
  
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  // 创建更多粒子，增强视觉效果
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div')
    particle.className = 'collision-particle'
    
    // 随机粒子大小增加视觉层次
    const size = 3 + Math.random() * 4
    const colors = [
      'rgba(0, 140, 255, 0.9)',
      'rgba(255, 77, 109, 0.9)', 
      'rgba(0, 255, 136, 0.8)',
      'rgba(255, 165, 0, 0.8)'
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    particle.style.cssText = `
      position: fixed;
      left: ${centerX - size/2}px;
      top: ${centerY - size/2}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      box-shadow: 0 0 ${size * 2}px ${color};
    `
    
    document.body.appendChild(particle)
    
    // 随机方向和距离，增加变化
    const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
    const distance = 40 + Math.random() * 40
    const endX = Math.cos(angle) * distance
    const endY = Math.sin(angle) * distance
    
    // 增强粒子动画
    gsap.to(particle, {
      x: endX,
      y: endY,
      scale: 0,
      opacity: 0,
      rotation: 360 + Math.random() * 360,
      duration: 0.6 + Math.random() * 0.4, // 随机持续时间
      ease: 'power2.out',
      onComplete: () => {
        document.body.removeChild(particle)
      }
    })
  }
}

function typeNextRole() {
  const role = roles.value[currentRoleIndex.value]
  let charIndex = 0

  const typingInterval = setInterval(() => {
    if (charIndex < role.length) {
      typedText.value += role[charIndex]
      charIndex++
    } else {
      clearInterval(typingInterval)
      setTimeout(() => {
        eraseRole()
      }, 2000)
    }
  }, 100)
}

function eraseRole() {
  const eraseInterval = setInterval(() => {
    if (typedText.value.length > 0) {
      typedText.value = typedText.value.slice(0, -1)
    } else {
      clearInterval(eraseInterval)
      currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.value.length
      setTimeout(() => {
        typeNextRole()
      }, 500)
    }
  }, 50)
}

const gradientStyle = computed(() => ({
  background: 'linear-gradient(90deg, #008CFF, #FF4D6D)',
  'background-clip': 'text',
  '-webkit-background-clip': 'text',
  'color': 'transparent',
  '-webkit-text-fill-color': 'transparent',
}))
</script>

<template>
  <div class="homepage">
    <n-grid :cols="24" :x-gap="24">
      <n-gi :span="16">
        <div class="intro">
          <h1 class="name" :style="gradientStyle">Hello, I'm Xinghan Pan!</h1>
          <div class="role-container">
            <span class="role">I'm a </span>
            <span class="typed-role">{{ typedText }}<span class="cursor"
                :class="{ 'cursor-visible': showCursor }">|</span></span>
          </div>
          <p class="description">
            Currently studying at Shenzhen College of International Education, I'm a passionate computer science student
            dedicated to learning algorithms and exploring the frontiers of artificial intelligence. My drive to
            innovate
            in these fields makes me eager to contribute to and thrive in small but impactful projects.
          </p>
        </div>
      </n-gi>
      <n-gi :span="8">
        <n-flex :justify="'end'">
          <n-avatar :size="289" :src="`/website/images/landingAvatar.jpg`" round class="avatar" />
        </n-flex>
      </n-gi>
    </n-grid>
    <div class="skills-container">
      <n-tag v-for="(skill, index) in skills" :key="skill.name" :type="skill.type" class="skill-tag" :data-index="index">
        <template #icon>
          <n-icon :component="ChevronRight" />
        </template>
        {{ skill.name }}
      </n-tag>
    </div>
    <n-divider />

    <div class="projects-section">
      <h2 :style="gradientStyle">Projects I've Worked On</h2>
      <n-grid :cols="2" :x-gap="24" :y-gap="24">
        <n-gi>
          <div class="projectsCard" @click="router.push({ name: 'project' })">
            <div class="project-title"><b>Explained Algorithms</b></div>
            <div>
              <n-text :depth="3">
                Using real-life examples and actual Leetcode problems, I explain the algorithms and data structures in a
                way
                that is easy to understand and remember with implementation of the algorithm that can be viewed by the
                user
                visually.
              </n-text>
            </div>
          </div>
        </n-gi>
      </n-grid>
    </div>
    <n-divider></n-divider>
    <div class="tech-stack">
      <h1 :style="gradientStyle">Tech Stack</h1>
      <div class="tech-categories">
        <div v-for="category in categories" :key="category.id" class="category-section">
          <h4 class="category-title">{{ category.name }}</h4>
          <div class="tech-icons">
            <n-tooltip v-for="tech in techStack.filter(t =>
              Array.isArray(category.id)
                ? category.id.includes(t.category)
                : t.category === category.id
            )" :key="tech.name" :trigger="'hover'" :placement="'top'">
              <template #trigger>
                <div class="tech-icon">
                  <img :src="`https://api.iconify.design/${tech.icon.replace(':', '/')}.svg`" :alt="tech.name"
                    class="tech-icon-img" />
                </div>
              </template>
              {{ tech.name }}
            </n-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.homepage {
  padding: 48px 24px;
  max-width: 1080px;
  margin: 24px 0;
  flex: 1;
  padding: 24 px 0;
  margin: 0 auto;
  width: 100%;
}

.intro {
  margin-bottom: 48px;
}

.name {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
}

.role-container {
  font-size: 24px;
  margin-bottom: 24px;
}

.role {
  color: v-bind("isDarkMode ? '#9E9E9E' : '#666666'");
}

.typed-role {
  font-weight: bold;
  color: #008CFF;
}

.cursor {
  display: inline-block;
  width: 2px;
  background-color: #008CFF;
  animation: blink 0.7s infinite;
}

.cursor-visible {
  opacity: 1;
}

@keyframes blink {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes impact {
  0% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  25% {
    transform: scale(1.15) rotate(1deg);
    filter: brightness(1.2);
  }
  50% {
    transform: scale(1.08) rotate(-0.5deg);
    filter: brightness(1.1);
  }
  75% {
    transform: scale(1.05) rotate(0.3deg);
    filter: brightness(1.05);
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }
  10% {
    transform: translateX(-3px) translateY(-1px) rotate(-1deg);
  }
  20% {
    transform: translateX(3px) translateY(1px) rotate(1deg);
  }
  30% {
    transform: translateX(-2px) translateY(-1px) rotate(-0.5deg);
  }
  40% {
    transform: translateX(2px) translateY(1px) rotate(0.5deg);
  }
  50% {
    transform: translateX(-1px) translateY(-0.5px) rotate(-0.2deg);
  }
  60% {
    transform: translateX(1px) translateY(0.5px) rotate(0.2deg);
  }
  70% {
    transform: translateX(-0.5px) translateY(-0.2px) rotate(-0.1deg);
  }
  80% {
    transform: translateX(0.5px) translateY(0.2px) rotate(0.1deg);
  }
  90% {
    transform: translateX(-0.2px) translateY(-0.1px) rotate(-0.05deg);
  }
}

/* 碰撞波纹效果 */
@keyframes ripple {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
    border-radius: 50%;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 0.5;
    border-radius: 30%;
  }
  100% {
    transform: scale(3) rotate(360deg);
    opacity: 0;
    border-radius: 10%;
  }
}

/* 粒子爆炸效果 */
@keyframes particle-explosion {
  0% {
    transform: scale(0) translate(-50%, -50%);
    opacity: 1;
  }
  50% {
    transform: scale(2) translate(-50%, -50%);
    opacity: 0.8;
  }
  100% {
    transform: scale(4) translate(-50%, -50%);
    opacity: 0;
  }
}

/* 碰撞粒子样式 - 增强版 */
.collision-particle {
  background: radial-gradient(circle, rgba(0, 140, 255, 1) 0%, rgba(0, 140, 255, 0.8) 30%, transparent 70%);
  box-shadow: 
    0 0 10px rgba(0, 140, 255, 1),
    0 0 20px rgba(0, 140, 255, 0.8),
    0 0 30px rgba(0, 140, 255, 0.6);
  animation: particle-glow 0.6s ease-out;
}

/* 粒子发光动画 */
@keyframes particle-glow {
  0% {
    box-shadow: 
      0 0 5px rgba(0, 140, 255, 1),
      0 0 10px rgba(0, 140, 255, 0.8);
  }
  50% {
    box-shadow: 
      0 0 15px rgba(0, 140, 255, 1),
      0 0 30px rgba(0, 140, 255, 0.8),
      0 0 45px rgba(0, 140, 255, 0.6);
  }
  100% {
    box-shadow: 
      0 0 5px rgba(0, 140, 255, 0.5),
      0 0 10px rgba(0, 140, 255, 0.3);
  }
}

/* 光晕脉冲效果 */
@keyframes glow-pulse {
  0% {
    box-shadow: 0 0 5px rgba(0, 140, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 140, 255, 0.6), 0 0 30px rgba(0, 140, 255, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(0, 140, 255, 0.3);
  }
}

.description {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 24px;
  color: v-bind("isDarkMode ? '#E0E0E0' : '#333333'");
}

.skills-container {
  display: flex;
  gap: 0px; /* 完全无间距 */
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: flex-start; /* 顶部对齐确保方形贴合 */
  position: relative;
  overflow: visible; /* 确保动画效果可见 */
  padding: 8px; /* 添加一些内边距防止动画被裁剪 */
}

.skill-tag {
  font-size: 14px;
  opacity: 0; /* 初始隐藏 */
  transform: translateX(400px) scale(0.2) rotate(35deg) skewX(20deg); /* 更强烈的初始变形 */
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 2px; /* 更方形的圆角 */
  overflow: hidden;
  will-change: transform; /* 优化性能 */
  margin: 0; /* 完全移除边距 */
  backdrop-filter: blur(10px); /* 添加毛玻璃效果 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 添加细边框 */
  min-height: 32px; /* 确保统一高度 */
  display: flex;
  align-items: center;
  padding: 6px 12px; /* 统一内边距 */
  box-sizing: border-box;
}

.skill-tag:hover {
  transform: translateY(-5px) scale(1.08);
  box-shadow: 
    0 8px 25px rgba(0, 140, 255, 0.4),
    0 0 0 3px rgba(0, 140, 255, 0.2),
    0 0 15px rgba(0, 140, 255, 0.6);
  transition: all 0.3s ease;
  animation: impact 0.4s ease-out;
  z-index: 10; /* 确保hover时在最上层 */
}

/* 添加碰撞后的光晕效果 - 增强版 */
.skill-tag::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(255, 255, 255, 0.9), 
    rgba(0, 140, 255, 0.3),
    transparent
  );
  transition: left 0.6s ease;
  pointer-events: none;
  z-index: 1;
}

.skill-tag:hover::after {
  left: 100%;
}

/* 添加碰撞时的粒子效果 */
.skill-tag::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(0, 140, 255, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

/* 碰撞时的特殊效果 */
.skill-tag.impact {
  animation: shake 0.4s ease-in-out;
}

.avatar {
  transition: transform 0.3s ease-in-out;
}

.avatar:hover {
  transform: scale(1.05);
}

.projects-section {
  margin-top: 64px;
}

.projects-section h2 {
  font-size: 32px;
  margin-bottom: 24px;
}

.projectsCard {
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--boxShadow-light);
  background-color: rgba(58, 51, 83, 0.9);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: v-bind("isDarkMode ? '0 4px 12px rgba(255, 255, 255, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.1)'");
}

.tech-stack {
  margin-bottom: 24px;
}

.tech-stack h3 {
  font-size: 20px;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #008CFF, #FF4D6D);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.tech-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.category-section {
  background-color: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'");
  border-radius: 8px;
  padding: 12px;
}

.category-title {
  font-size: 14px;
  margin-bottom: 12px;
  color: v-bind("isDarkMode ? '#e0e0e0' : '#333333'");
}

.tech-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tech-icon {
  width: 28px;
  height: 28px;
  padding: 5px;
  border-radius: 6px;
  background-color: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'");
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.tech-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tech-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: none;
}

:root[class='dark'] .tech-icon-img {
  filter: brightness(0.95);
}

@media (max-width: 768px) {
  .homepage {
    padding: 24px 16px;
  }

  .name {
    font-size: 36px;
  }

  .role-container {
    font-size: 20px;
  }

  .description {
    font-size: 16px;
  }

  .skills-container {
    flex-wrap: wrap;
    gap: 0px; /* 移动端也保持无间距 */
    padding: 6px;
  }
  
  .skill-tag {
    font-size: 12px; /* 移动端稍小的字体 */
    margin: 0; /* 移动端也无边距 */
    padding: 4px 8px; /* 移动端更紧凑的内边距 */
    min-height: 28px; /* 移动端稍小的高度 */
  }

  .projects-section h2 {
    font-size: 28px;
  }

  .tech-categories {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .tech-icons {
    gap: 6px;
  }

  .tech-icon {
    width: 24px;
    height: 24px;
    padding: 4px;
  }

  .category-title {
    font-size: 13px;
  }
}
</style>
