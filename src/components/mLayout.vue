<script setup>
import { ref, computed, provide, h } from 'vue'
import {
  NDivider,
  NFlex,
  NIcon,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NMenu,
  NDropdown,
  NButton,
  NConfigProvider,
  darkTheme,
  lightTheme
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { Sun, Moon, Mail, Github, ChevronDown } from 'lucide-vue-next'

const router = useRouter()
const isDarkMode = ref(true)
provide('isDarkMode', isDarkMode)

const theme = computed(() => (isDarkMode.value ? darkTheme : lightTheme))

const menuOptions = [
  { label: 'Home', key: 'landing' },
  { label: 'Project', key: 'project' },
  { label: 'Competition', key: 'competition' },
  { label: 'Activity', key: 'activity' },
  { label: 'About', key: 'about' }
]

const activeKey = computed(() => router.currentRoute.value.name)

function handleRouteChange(key) {
  router.push({ name: key })
}

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
}

const dropdownOptions = computed(() =>
  menuOptions.map(option => ({
    key: option.key,
    label: option.label,
    disabled: option.key === activeKey.value
  }))
)

const renderDropdownLabel = () => {
  const activeOption = menuOptions.find(option => option.key === activeKey.value)
  return h('div', {
    style: 'display: flex; align-items: center;'
  }, [
    h('span', null, activeOption ? activeOption.label : 'Menu'),
    h(ChevronDown, { style: 'margin-left: 4px' })
  ])
}
</script>

<template>
  <n-config-provider :theme="theme" :class="{ 'dark-mode': isDarkMode }">
    <n-layout class="layout" :style="{
      background: isDarkMode ? 'linear-gradient(to bottom, #1E1E2E, #2D2D2D)' : 'linear-gradient(to bottom, #F5F5F5, #E8E8E8)'
    }">
      <n-layout-header bordered class="header" :style="{
        backgroundColor: isDarkMode ? 'rgba(45, 45, 68, 0.8)' : 'rgba(245, 245, 245, 0.8)'
      }">
        <div class="header-content">
          <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleRouteChange"
            class="desktop-menu" />
          <n-dropdown trigger="click" :options="dropdownOptions" @select="handleRouteChange" class="mobile-menu">
            <n-button>
              <component :is="renderDropdownLabel" />
            </n-button>
          </n-dropdown>
        </div>
      </n-layout-header>
      <n-layout-content class="content main-content"
        :style="{ backgroundColor: isDarkMode ? 'rgba(45, 45, 68, 0.8)' : 'rgba(255, 255, 255, 0.8)' }">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </n-layout-content>
      <n-layout-footer bordered class="footer" :style="{
        backgroundColor: isDarkMode ? 'rgba(45, 45, 68, 0.8)' : 'rgba(232, 232, 232, 0.8)'
      }">
        <n-flex justify="center" :align="'center'" class="footer-content">
          <n-flex :align="'center'">
            <n-icon size="20">
              <Mail />
            </n-icon>
            <span class="ml-2">sampan090611@gmail.com</span>
          </n-flex>
          <n-divider vertical />
          <n-flex :align="'center'">
            <n-icon size="20">
              <Github />
            </n-icon>
            <span class="ml-2">PStarH</span>
          </n-flex>
        </n-flex>
      </n-layout-footer>
    </n-layout>
  </n-config-provider>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 16px 0;
  backdrop-filter: blur(10px);
}

.header-content {
  margin: 0 auto;
  display: flex;
  align-items: right;
  justify-content: right;
  margin-right: 32px;
  max-width: 1200px;
  width: 100%;
  padding: 0 16px;
}

.content {
  flex: 1;
}

.main-content {
  max-width: 1400px;
  margin: 24px auto;
  padding: 24px 0;
  width: 100%;
  background-color: transparent;
}

.footer {
  padding: 24px 0;
}

.footer-content {
  margin: 0 auto;
  padding: 0 20px;
}

.ml-2 {
  margin-left: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.desktop-menu {
  display: flex;
}

.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  .mobile-menu {
    display: block;
  }
}

/* Dark Mode Styles */
.dark-mode :deep(.n-menu) {
  background-color: transparent !important;
}

.dark-mode :deep(.n-menu-item) {
  color: #E0E0E0 !important;
}

.dark-mode :deep(.n-menu-item:hover),
.dark-mode :deep(.n-menu-item--selected) {
  color: #008CFF !important;
}

.dark-mode :deep(.n-divider) {
  background-color: #484848;
}

.dark-mode :deep(.n-switch) {
  --n-button-color-active: #008CFF;
  --n-button-color: #FF4D6D;
}

/* Light Mode Styles */
:deep(.n-menu) {
  background-color: transparent !important;
}

:deep(.n-menu-item) {
  color: #333333 !important;
}

:deep(.n-menu-item:hover),
:deep(.n-menu-item--selected) {
  color: #008CFF !important;
}

:deep(.n-divider) {
  background-color: #D1D1D1;
}

:deep(.n-switch) {
  --n-button-color-active: #008CFF;
  --n-button-color: #FF4D6D;
}
</style>
