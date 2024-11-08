<script setup lang="ts">
import { ref } from 'vue'
import {
  NAvatar,
  NFlex,
  NGrid, NGi,
  NLayout, NLayoutHeader, NLayoutContent, NLayoutSider,
  NSplit,
  NText,
  NTimeline,
  NTimelineItem,
  NGradientText, NEllipsis, NDivider, NCarousel
} from 'naive-ui';
import router from '../../router/router';
import { projects } from '../project/project';

const contentRef = ref<string | null>(null);

// defineProps<{ msg: string }>()

// const count = ref(0)

initial();

function initial() {
  contentRef.value = "1";
}
</script>

<template>
  <div style="max-width: 960px; margin: auto; padding: 24px">
    <!-- display: flex; align-items: center; justify-content: space-between -->
    <!-- 介绍 -->
    <!-- <n-flex :align="'center'" :justify="'space-between'">
      <div :style="'font-size: 48px'"><b>Xinghan Pan</b></div>
      <n-gradient-text gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)">早上中午晚上好</n-gradient-text>
    </n-flex> -->
    <n-grid style="margin: 48px 0; align-items: center;">
      <n-gi :span="16">
        <div style="font-size: 48px"><b>
            <span style="font-size: 56px">Hello,</span> I'm Xinghan Pan!
          </b></div>
        <div style="font-size: 18px; max-width: 480px;">
          <p>I currently study at Shenzhen College of International Education.</p>
          <p>As a passionate student of computer science, I'm dedicated to learn algorithms and
            exploring the frontiers of artificial intelligence.</p>
          <p>My drive to innovate in these fields makes me eager to contribute to and thrive in small but useful
            projects
          </p>
        </div>
      </n-gi>
      <n-gi :span="8">
        <n-flex :justify="'end'">
          <n-avatar :size="289" :src="`/website/images/landingAvatar.jpg`" round />
        </n-flex>
      </n-gi>
    </n-grid>
    <div>
      <div style="font-size: 24px; margin: 12px 0"><b>Projects that I have worked on</b></div>
      <n-grid :cols="2">
        <n-gi v-for="project in projects">
          <div class="projectsCard" @click="router.push({ name: project.routerKey })">
            <!-- :style="{ backgroundColor: project.color }" -->
            <div style="font-size: 18px"><b>{{ project.name }}</b></div>
            <div>
              <n-text :depth="3">
                {{ project.description }}
              </n-text>
            </div>
          </div>
        </n-gi>
      </n-grid>
    </div>
    <div style="height: 200px"></div>
  </div>
</template>

<style scoped lang="less">
.light-green {
  height: 108px;
  background-color: rgba(25, 146, 4, 0.939);
  color: #ffdcda
}

.green {
  height: 108px;
  background-color: rgba(119, 220, 4, 0.868);
}

.yellow-green {
  height: 108px;
  background-color: rgba(135, 245, 9, 0.902);
}

.yellow {
  height: 108px;
  background-color: rgba(196, 248, 8, 0.879);
}

.n-layout-header {
  padding-top: 25px;
  padding-right: 100px;
  padding-bottom: 10px;
  padding-left: 100px;
}

.n-layout-sider {
  padding-left: 200px;
}

.projectsCard {
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--boxShadow-light);

  &:hover {
    box-shadow: var(--boxShadow-regular)
  }
}

.n-gradient-text {
  font-size: 16px;
}
</style>