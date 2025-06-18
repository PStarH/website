<template>
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
</template>

<script setup>
import { inject, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isDarkMode = inject('isDarkMode', ref(true))

const gradientStyle = computed(() => ({
  background: 'linear-gradient(90deg, #008CFF, #FF4D6D)',
  'background-clip': 'text',
  '-webkit-background-clip': 'text',
  color: 'transparent',
  '-webkit-text-fill-color': 'transparent'
}))
</script>

<style scoped>
.projects-section {
  margin-bottom: 64px;
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

.project-title {
  font-size: 18px;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .projects-section h2 {
    font-size: 28px;
  }
}
</style>
