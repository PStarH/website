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
  NTooltip,
  darkTheme,
  lightTheme
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { Sun, Moon, Mail, Github, ExternalLink, Youtube } from 'lucide-vue-next'

const router = useRouter()
const isDarkMode = ref(true)
provide('isDarkMode', isDarkMode)

const theme = computed(() => (isDarkMode.value ? darkTheme : lightTheme))

const socialMediaLinks = [
  {
    name: 'Github',
    url: 'https://github.com/PStarH',
    icon: Github,
    color: '#333'
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@sampan090611',
    iconSvg: '/images/Medium.svg',
    color: '#00ab6c'
  },
  {
    name: 'ORCID',
    url: 'https://orcid.org/0009-0006-7115-4981',
    iconSvg: '/images/ORCID.svg',
    color: '#a6ce39'
  },
  {
    name: 'Email',
    url: 'mailto:sampan090611@gmail.com',
    icon: Mail,
    color: '#ea4335'
  }
]

const hoveredItem = ref(null)

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

function openLink(url) {
  window.open(url, '_blank')
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
        <!-- 固定底部社交媒体栏 -->
        <div class="social-media-bar" :class="{ 'dark': isDarkMode }">
          <div class="social-container">
            <div
              v-for="(link, index) in socialMediaLinks"
              :key="link.name"
              class="social-item"
              @mouseenter="hoveredItem = index"
              @mouseleave="hoveredItem = null"
              @click="openLink(link.url)"
              :class="{ 'expanded': hoveredItem === index }"
              :style="{ 
                '--brand-color': link.color,
                'animation-delay': `${0.2 + index * 0.1}s` 
              }"
            >
              <!-- 图标部分 -->
              <div class="social-icon-wrapper">
                <img v-if="link.iconSvg" :src="link.iconSvg" alt="" class="social-icon-svg" />
                <n-icon v-else :component="link.icon" size="24" class="social-icon" />
              </div>
              
              <!-- 展开的信息栏 -->
              <div v-if="hoveredItem === index" class="social-info-panel visible">
                <div class="social-info-content">
                  <div class="social-name">{{ link.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  max-height: 20vh;
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
  max-width: 100vw;
  margin: 24px 0;
  flex: 1;
  padding: 24px 0 90px 0; /* 增加底部padding为底部栏留空间 */
  margin: 0 auto;
  width: 100%;
  background-color: transparent;
}

.footer {
  padding: 0;
  position: relative;
  border: none !important;
}

/* 社交媒体底部栏样式 */
.social-media-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px; /* 减小高度 */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
  animation: slideUpFade 0.8s ease-out; /* 添加进入动画 */
}

@keyframes slideUpFade {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.social-media-bar.dark {
  background: rgba(45, 45, 68, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.social-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 32px; /* 增加间距 */
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.social-item {
  position: relative;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 32px;
  overflow: visible;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 56px;
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center; /* 初始状态居中 */
  z-index: 1;
  min-width: 56px;
  animation: socialItemFadeIn 0.6s ease-out both;
}

@keyframes socialItemFadeIn {
  from {
    transform: translateY(30px) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.social-item:hover {
  transform: translateY(-2px); /* 轻微上浮效果 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-item.expanded {
  width: 200px; /* 稍微减少宽度避免重叠 */
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--brand-color);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  z-index: 10; /* 确保展开的按钮在最上层 */
  transform: translateY(-2px);
  justify-content: flex-start; /* 靠左对齐，使图标移到左边 */
  padding-left: 8px; /* 给图标添加左侧内边距 */
}

.dark .social-item.expanded {
  background: rgba(45, 45, 68, 0.95);
  border-color: var(--brand-color);
}

/* 确保按钮在任何状态下都可点击 */
.social-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  cursor: pointer;
}

.social-item.expanded::before {
  z-index: 1;
}

.social-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  margin: auto; /* 使用auto让图标在父元素中完全居中 */
  flex-shrink: 0;
}

.social-item:hover .social-icon-wrapper {
  transform: scale(1.15); /* 增加悬停时的放大效果 */
  background: var(--brand-color);
  border-color: var(--brand-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.social-item.expanded .social-icon-wrapper {
  transform: scale(1.0); /* 展开时不缩放，保持原始大小 */
  background: var(--brand-color);
  border-color: var(--brand-color);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  margin: 0; /* 展开时移除自动边距，使图标靠左 */
}

.dark .social-icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
}

.social-icon {
  color: #666;
  transition: all 0.5s ease;
  z-index: 1;
  position: relative;
  font-size: 24px; /* 增加图标大小 */
}

.social-icon-svg {
  width: 20px; /* 增加SVG图标大小 */
  height: 20px;
  transition: all 0.5s ease;
  filter: opacity(0.8); /* 增加初始透明度 */
}

.social-item:hover .social-icon {
  color: white;
  transform: scale(1.2);
}

.social-item:hover .social-icon-svg {
  filter: brightness(0) invert(1);
  transform: scale(1.2);
}

.social-item.expanded .social-icon {
  color: white;
}

.social-item.expanded .social-icon-svg {
  filter: brightness(0) invert(1);
}

.dark .social-icon {
  color: #E0E0E0;
}

.social-info-panel {
  position: relative;
  margin-left: 12px;
  width: auto;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  flex: 1;
  animation: slideInFromLeft 0.3s ease-out;
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.social-info-content {
  text-align: left;
  display: flex;
  align-items: center;
  height: 100%;
}

.social-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.2px;
  white-space: nowrap;
  text-transform: uppercase;
}

.dark .social-name {
  color: #E0E0E0;
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
  
  .social-container {
    gap: 12px; /* 增加移动端间距 */
    padding: 0 16px;
  }
  
  .social-item {
    width: 44px;
    height: 44px;
    min-width: 44px; /* 确保移动端可点击区域 */
  }
  
  .social-icon-wrapper {
    width: 28px;
    height: 28px;
    margin: auto; /* 保持居中 */
  }
  
  .social-icon-svg {
    width: 16px;
    height: 16px;
  }
  
  .social-item.expanded {
    width: 200px; /* 移动端稍小的展开宽度 */
    padding-left: 6px; /* 移动端左边距稍小 */
  }
  
  .social-item.expanded .social-icon-wrapper {
    margin: 0; /* 展开时移除自动边距 */
  }
  
  .social-info-panel {
    margin-left: 10px;
  }
  
  .main-content {
    padding-bottom: 80px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 12px;
  }
  
  .brand-text {
    font-size: 18px;
  }
  
  .social-container {
    gap: 8px; /* 小屏幕更紧凑的间距 */
    padding: 0 12px;
  }
  
  .social-item {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }
  
  .social-icon-wrapper {
    width: 24px;
    height: 24px;
    margin: auto; /* 保持居中 */
  }
  
  .social-icon-svg {
    width: 14px;
    height: 14px;
  }
  
  .social-media-bar {
    height: 56px; /* 稍微减小高度 */
  }
  
  .social-item.expanded {
    width: 160px; /* 小屏幕更小的展开宽度 */
    padding-left: 5px; /* 更小屏幕左边距更小 */
  }
  
  .social-item.expanded .social-icon-wrapper {
    margin: 0; /* 展开时移除自动边距 */
  }
  
  .social-info-panel {
    margin-left: 8px;
  }
  
  .social-name {
    font-size: 11px;
  }
  
  .social-description {
    font-size: 9px;
  }
  
  .social-details {
    font-size: 7px;
  }
  
  .main-content {
    padding-bottom: 66px;
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
