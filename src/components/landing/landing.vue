<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NAvatar,
  NFlex,
  NGrid, NGi,
  NLayout, NLayoutHeader, NLayoutContent, NLayoutSider,
  NSplit,
  NText,
  NTimeline,
  NTimelineItem,
  NGradientText,
  NEllipsis,
  NDivider,
  NCarousel,
  NTag,
} from 'naive-ui'
import router from '../../router/router'
import { projects } from '../project/project'

const contentRef = ref<string | null>(null)
const roles = ref(['Full-stack Developer', 'AI Enthusiast', 'Data Analyst'])
const currentRoleIndex = ref(0)
const typedText = ref('')
const showCursor = ref(true)

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
</script>

<template>
  <div class="homepage">
    <n-grid :cols="24" :x-gap="24">
      <n-gi :span="16">
        <div class="intro">
          <h1 class="name">Hello, I'm Xinghan Pan!</h1>
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
            <n-tag type="success" class="skill-tag">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M160 368L32 256l128-112M352 368l128-112-128-112M304 96l-96 320"/>
                </svg>
              </template>
              Full-stack Development
            </n-tag>
            <n-tag type="info" class="skill-tag">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                  <path d="M216 260c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zM96 260c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zM336 260c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z" fill="currentColor"/>
                  <path d="M448 32H64C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm16 384c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v320z" fill="currentColor"/>
                </svg>
              </template>
              Artificial Intelligence
            </n-tag>
            <n-tag type="warning" class="skill-tag">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                  <path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z" fill="currentColor"/>
                </svg>
              </template>
              Data Analysis
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

    <div class="projects-section">
      <h2>Projects I've Worked On</h2>
      <n-grid :cols="2" :x-gap="24" :y-gap="24">
        <n-gi v-for="project in projects" :key="project.name">
          <div class="project-card" @click="router.push({ name: project.routerKey })">
            <h3>{{ project.name }}</h3>
            <n-text :depth="3">
              {{ project.description }}
            </n-text>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<style scoped lang="less">
.homepage {
  max-width: 960px;
  margin: auto;
  padding: 48px 24px;
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
  color: #666;
}

.typed-role {
  font-weight: bold;
  color: #18a058;
}

.cursor {
  display: inline-block;
  width: 2px;
  background-color: #18a058;
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
}

.skills {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.skill-tag {
  font-size: 14px;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  margin-right: 4px;
}

.avatar {
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
}

.projects-section {
  margin-top: 64px;

  h2 {
    font-size: 32px;
    margin-bottom: 24px;
  }
}

.project-card {
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--boxShadow-light);
  background-color: #fff;

  &:hover {
    box-shadow: var(--boxShadow-regular);
    transform: translateY(-5px);
  }

  h3 {
    font-size: 20px;
    margin-bottom: 12px;
  }
}
</style>