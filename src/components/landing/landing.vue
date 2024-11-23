<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue'
import {
  NAvatar,
  NFlex,
  NGrid, NGi,
  NText,
  NTag,
  NCard,
  NButton,
  NDivider,
} from 'naive-ui'
import { ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { projects } from '../project/project'

const router = useRouter()
const roles = ref(['Full-stack Developer', 'AI Enthusiast', 'Data Analyst'])
const currentRoleIndex = ref(0)
const typedText = ref('')
const showCursor = ref(true)
const isDarkMode = inject('isDarkMode', ref(true))

const skills = [
  { name: 'Full-stack Development', type: 'success', icon: 'code' },
  { name: 'Artificial Intelligence', type: 'info', icon: 'brain' },
  { name: 'Data Analysis', type: 'warning', icon: 'bar-chart' },
]

onMounted(() => {
  typeNextRole()
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
})

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
  '-webkit-background-clip': 'text',
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
            <span class="typed-role">{{ typedText }}<span class="cursor" :class="{ 'cursor-visible': showCursor }">|</span></span>
          </div>
          <p class="description">
            Currently studying at Shenzhen College of International Education, I'm a passionate computer science student
            dedicated to learning algorithms and exploring the frontiers of artificial intelligence. My drive to innovate
            in these fields makes me eager to contribute to and thrive in small but impactful projects.
          </p>
          <div class="skills">
            <n-tag v-for="skill in skills" :key="skill.name" :type="skill.type" class="skill-tag">
              <template #icon>
                <n-icon :component="ChevronRight" />
              </template>
              {{ skill.name }}
            </n-tag>
          </div>
        </div>
      </n-gi>
      <n-gi :span="8">
        <n-flex :justify="'end'">
          <n-avatar :size="289" :src="`/website/images/landingAvatar.jpg`" round class="avatar" />
        </n-flex>
      </n-gi>
    </n-grid>

    <n-divider />

    <div class="projects-section">
      <h2 :style="gradientStyle">Projects I've Worked On</h2>
      <n-grid :cols="2" :x-gap="24" :y-gap="24">
        <n-gi v-for="project in projects" :key="project.name">
          <n-card class="project-card" @click="router.push({ name: project.routerKey })">
            <template #header>
              <h3>{{ project.name }}</h3>
            </template>
            <n-text :depth="3">
              {{ project.description }}
            </n-text>
            <template #footer>
              <n-button text>
                Learn More
                <template #icon>
                  <n-icon :component="ChevronRight" />
                </template>
              </n-button>
            </template>
          </n-card>
        </n-gi>
      </n-grid>
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
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.description {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 24px;
  color: v-bind("isDarkMode ? '#E0E0E0' : '#333333'");
}

.skills {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.skill-tag {
  font-size: 14px;
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

.project-card {
  cursor: pointer;
  transition: all 0.3s;
  background-color: v-bind("isDarkMode ? 'rgba(45, 45, 68, 0.8)' : 'rgba(255, 255, 255, 0.8)'");
  backdrop-filter: blur(10px);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: v-bind("isDarkMode ? '0 4px 12px rgba(255, 255, 255, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.1)'");
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

  .skills {
    flex-wrap: wrap;
  }

  .projects-section h2 {
    font-size: 28px;
  }
}
</style>

