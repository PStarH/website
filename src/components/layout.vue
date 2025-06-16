<script setup>
import { ref, computed, provide } from 'vue'
import {
  NDivider,
  NFlex,
  NIcon,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NMenu,
  NSwitch,
  NConfigProvider,
  darkTheme,
  lightTheme
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { Sun, Moon, Mail, Github } from 'lucide-vue-next'

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
</script>

<template>
  <n-config-provider :theme="theme" :class="{ 'dark-mode': isDarkMode }">
    <n-layout class="layout" :style="{
      background: isDarkMode ? 'linear-gradient(to bottom, #1E1E2E, #2D2D2D)' : 'linear-gradient(to bottom, #F5F5F5, #E8E8E8)'
    }">
      <n-layout-header bordered class="header" :style="{
        backgroundColor: isDarkMode ? 'rgba(45, 45, 68, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
      }">
        <div class="header-content">
          <div class="brand-section">
            <div class="brand-logo">
              <span class="brand-text">XPan</span>
            </div>
          </div>
          
          <div class="spacer-section">
          </div>
          
          <div class="nav-section">
            <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions"
              @update:value="handleRouteChange" class="nav-menu" />
          </div>
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
  padding: 0;
  backdrop-filter: blur(20px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 70px;
}

.brand-section {
  flex: 0 0 auto;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(45deg, #008CFF, #FF4D6D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.nav-section {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
}

.spacer-section {
  flex: 1;
}

.main-content {
  max-width: 1400px;
  margin: 24px 0;
  flex: 1;
  padding: 24px 0;
  margin: 0 auto;
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

/* Dark Mode Styles */
.dark-mode :deep(.n-menu) {
  background-color: transparent !important;
}

.dark-mode :deep(.n-menu-item) {
  color: #E0E0E0 !important;
  border-radius: 8px !important;
  margin: 0 2px !important;
  padding: 2px 4px !important;
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
}

.dark-mode :deep(.n-menu-item:hover) {
  color: #008CFF !important;
  background-color: rgba(0, 140, 255, 0.1) !important;
  transform: translateY(-1px) !important;
}

.dark-mode :deep(.n-menu-item--selected) {
  color: #008CFF !important;
  background-color: rgba(0, 140, 255, 0.15) !important;
  box-shadow: 0 2px 8px rgba(0, 140, 255, 0.3) !important;
}

.dark-mode :deep(.n-divider) {
  background-color: #484848;
}

/* Light Mode Styles */
:deep(.n-menu) {
  background-color: transparent !important;
}

:deep(.n-menu-item) {
  color: #333333 !important;
  border-radius: 8px !important;
  margin: 0 2px !important;
  padding: 8px 12px !important;
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
}

:deep(.n-menu-item:hover) {
  color: #008CFF !important;
  background-color: rgba(0, 140, 255, 0.08) !important;
  transform: translateY(-1px) !important;
}

:deep(.n-menu-item--selected) {
  color: #008CFF !important;
  background-color: rgba(0, 140, 255, 0.12) !important;
  box-shadow: 0 2px 8px rgba(0, 140, 255, 0.2) !important;
}

:deep(.n-divider) {
  background-color: #D1D1D1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    height: 60px;
  }
  
  .brand-text {
    font-size: 20px;
  }
  
  .nav-section {
    display: none;
  }
  
  .spacer-section {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 12px;
  }
  
  .brand-text {
    font-size: 18px;
  }
}

/* Brand Logo Animation */
.brand-logo:hover .brand-text {
  animation: brandGlow 0.6s ease-in-out;
}

@keyframes brandGlow {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2) drop-shadow(0 0 8px rgba(0, 140, 255, 0.5));
  }
  100% {
    filter: brightness(1);
  }
}

/* Menu Improvements */
:deep(.n-menu-item-content) {
  position: relative;
  overflow: hidden;
}

:deep(.n-menu-item-content::before) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #008CFF, #FF4D6D);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

:deep(.n-menu-item--selected .n-menu-item-content::before),
:deep(.n-menu-item:hover .n-menu-item-content::before) {
  width: 80%;
}
</style>
