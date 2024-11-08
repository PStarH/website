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
  <div style="max-width: 100%; margin: auto; padding: 8px">
    <!-- display: flex; align-items: center; justify-content: space-between -->
    <!-- 介绍 -->
    <!-- <n-flex :align="'center'" :justify="'space-between'">
      <div :style="'font-size: 48px'"><b>Xinghan Pan</b></div>
      <n-gradient-text gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)">早上中午晚上好</n-gradient-text>
    </n-flex> -->

    <div style="font-size: 48px"><b>
        <span style="font-size: 56px">Hello,</span> I'm Xinghan Pan!
      </b></div>
    <n-flex :justify="'center'">
      <n-avatar :size="289" src="/landingAvatar.jpg" round />
    </n-flex>
    <div style="font-size: 18px; max-width: 100%;">
      <p>I currently study at Shenzhen College of International Education.</p>
      <p>As a passionate student of computer science, I'm dedicated to learn algorithms and
        exploring the frontiers of artificial intelligence.</p>
      <p>My drive to innovate in these fields makes me eager to contribute to and thrive in small but useful
        projects
      </p>
    </div>
    <div>
      <div style="font-size: 24px; margin: 12px 0"><b>Projects that I have worked on</b></div>
      <n-grid :cols="1">
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
    <!-- 第一个部分 -->
    <!-- <n-divider title-placement="left" style="font-size:30px; font-weight: bold;">
      Part 1
    </n-divider>
    <n-grid x-gap="32px" :cols="4">
      <n-gi>
        <div class="light-green" style="height:250px">Outcome 1</div>
      </n-gi>
      <n-gi>
        <div class="green" style="height:250px">Outcome 2</div>
      </n-gi>
      <n-gi>
        <div class="yellow-green" style="height:250px">Outcome 3</div>
      </n-gi>
      <n-gi>
        <div class="yellow" style="height:250px">Outcome 4</div>
      </n-gi>
    </n-grid>
    <div class="carousel-container">
      <n-carousel autoplay style="align-items: center; padding-top: 15px;">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg">
      </n-carousel>
    </div> -->
    <!-- 第二个部分 -->
    <!-- <n-divider title-placement="left" style="font-size:30px; font-weight: bold;">
      Part 2
    </n-divider>
    <n-split direction="horizontal" style="border: solid 1px; height: 200px; box-sizing: border-box ;height: 200px"
      default-size="500px">
      <template #1>
        1
      </template>
<template #2>
        <n-split direction="vertical" style="height: 200px">
          <template #1>
            2
          </template>
<template #2>
            <n-split direction="horizontal" style="height: 100%">
              <template #1>
                3
              </template>
<template #2>
                more
              </template>
</n-split>
</template>
</n-split>
</template>
</n-split> -->
    <!--第三个部分 -->
    <!-- <n-divider title-placement="left" style="font-size:30px; font-weight: bold;">
      Part 3
    </n-divider>
    <n-layout has-sider>
      <n-layout-sider
        style="border: solid ; padding-left:40px; padding-right: 40px; margin-right: 20px; font-size: 20px; font-weight: bold;"
        content-style="padding: 24px;">
        A
      </n-layout-sider>
      <n-layout>
        <div style="padding-bottom: 20px; margin-bottom: 10px; border:solid; padding-left: 20px;">1</div>
        <div style="padding-bottom: 20px; margin-bottom: 10px ; border:solid; padding-left: 20px;">2</div>
        <div style="padding-bottom: 20px; margin-bottom: 10px; border:solid; padding-left: 20px;">3</div>
      </n-layout>
    </n-layout>
    <n-layout has-sider>
      <n-layout-sider
        style="border: solid; padding-left:40px; padding-right: 40px; margin-right: 20px;font-size: 20px; font-weight: bold;"
        content-style="padding: 24px;">
        B
      </n-layout-sider>
      <n-layout>
        <div style="padding-bottom: 20px; margin-bottom: 10px; border:solid; padding-left: 20px;">1</div>
        <div style="padding-bottom: 20px; margin-bottom: 10px ; border:solid; padding-left: 20px;">2</div>
        <div style="padding-bottom: 20px; margin-bottom: 10px; border:solid; padding-left: 20px;">3</div>
      </n-layout>
    </n-layout>
    <div style="padding: 12px 0">
      <h1 style="text-align: center; font-size: 40px;">Timeline</h1>
      <n-timeline style="align-items: center;">
        <n-timeline-item title="这是1" content="awdoawhdiasawd" time="1900-01-01"></n-timeline-item>
        <n-timeline-item title="这是2" content="awdoawhdiasawd" time="1910-02-03"></n-timeline-item>
        <n-timeline-item title="这是3" content="awdoawhdiasawd" time="1920-03-05"></n-timeline-item>
        <n-timeline-item title="这是4" content="awdoawhdiasawd" time="1930-04-07"></n-timeline-item>
        <n-timeline-item title="这是5" content="awdoawhdiasawd" time="1940-05-09"></n-timeline-item>
        <n-timeline-item title="这是6" content="awdoawhdiasawd" time="1950-06-11"></n-timeline-item>
        <n-timeline-item title="这是7" content="awdoawhdiasawd" time="1960-07-13"></n-timeline-item>
      </n-timeline>
    </div> -->
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