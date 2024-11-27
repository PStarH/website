<script setup lang="ts">
import { computed } from 'vue'
import {
    NLayout, NLayoutHeader, NLayoutContent,
    NTimeline, NTimelineItem, NGradientText, NEllipsis,
    NProgress
} from 'naive-ui';

const highSchoolStart = new Date('2022-08-08');
const highSchoolEnd = new Date('2026-06-19');


const currentDate = new Date();

const totalDuration = highSchoolEnd.getTime() - highSchoolStart.getTime();
const elapsedTime = currentDate.getTime() - highSchoolStart.getTime();

const elapsedDay = Math.floor(((elapsedTime / 1000) / 3600) / 24);
// const MiddleSchoolEnd = elapsedDay+24;

const highSchoolProgress = computed(() => {
    return (Math.min(Math.max((elapsedTime / totalDuration) * 100, 0), 100)).toFixed(2);
});

</script>

<template>
    <div style="overflow: hidden;">
        <n-layout>
            <n-layout-header style="padding: 0;">
                <h1>Introduction</h1>
                <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
                    鲁巴金曾经提到过，读书是在别人思想的帮助下，建立起自己的思想。这不禁令我深思。 这种事实对本人来说意义重大，相信对这个世界也是有一定意义的。
                    了解清楚生活的意义到底是一种怎么样的存在，是解决一切问题的关键。 本人也是经过了深思熟虑，在每个日日夜夜思考这个问题。 可是，即使是这样，生活的意义的出现仍然代表了一定的意义。
                    就我个人来说，生活的意义对我的意义，不能不说非常重大。 赫尔普斯曾经说过，有时候读书是一种巧妙地避开思考的方法。这不禁令我深思。 这种事实对本人来说意义重大，相信对这个世界也是有一定意义的。
                    生活中，若生活的意义出现了，我们就不得不考虑它出现了的事实。 每个人都不得不面对这些问题。 在面对这种问题时， 我认为，
                    吕凯特曾经说过，生命不可能有两次，但许多人连一次也不善于度过。这似乎解答了我的疑惑。 生活的意义因何而发生？ 经过上述讨论， 生活的意义因何而发生。
                </n-ellipsis>
            </n-layout-header>
            <n-layout-content>
                <div>
                    <h1 style="text-align: center; font-size: 40px; font-weight: bold;">Timeline</h1>
                    <div style="overflow: auto; max-height: 100vh;">
                        <n-timeline style="align-items: center;">
                            <div style="overflow: hidden; max-height: 100vh;">
                                <n-timeline-item title="这是1" content="awdoawhdiasawd"
                                    time="2009-06-11"></n-timeline-item>
                                <n-timeline-item title="这是2" content="awdoawhdiasawd"
                                    time="1910-02-03"></n-timeline-item>
                                <n-timeline-item title="这是3" content="awdoawhdiasawd"
                                    time="1920-03-05"></n-timeline-item>
                                <n-timeline-item title="这是4" content="awdoawhdiasawd"
                                    time="1930-04-07"></n-timeline-item>
                                <n-timeline-item title="这是5" content="awdoawhdiasawd"
                                    time="1940-05-09"></n-timeline-item>
                                <n-timeline-item title="这是6" content="awdoawhdiasawd"
                                    time="1950-06-11"></n-timeline-item>
                                <n-timeline-item title="这是7" content="awdoawhdiasawd"
                                    time="1960-07-13"></n-timeline-item>
                            </div>
                        </n-timeline>
                    </div>
                </div>
            </n-layout-content>
            <n-layout-footer style="text-align: center;">
                <n-space>
                    <h2 style="text-align: center;">High School Progress</h2>
                    <div><n-progress type="dashboard" gap-position="bottom" :percentage="Number(highSchoolProgress)" />
                    </div>
                    <div><b>Days I've been in High school: </b>{{ elapsedDay }}</div>
                    <div style="padding: 50px;"><n-gradient-text
                            gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)">早上中午晚上好</n-gradient-text>
                    </div>
                </n-space>
            </n-layout-footer>
        </n-layout>
    </div>
</template>

<style scoped lang="less">
.n-layout {
    padding: 1rem;
}
</style>