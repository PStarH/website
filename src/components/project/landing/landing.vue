<script setup lang="ts">
import { projects, projectData } from '../project';
import { NBreadcrumb, NBreadcrumbItem, NLayout, NLayoutContent, NLayoutHeader, NLayoutFooter, NGrid, NGi, NImage, NStatistic, NText, NRow, NCol } from 'naive-ui';
import router from "../../../router/router"
import { ref } from 'vue';
</script>

<template>
    <n-layout class="lout">
        <n-layout-header style="padding-left: 30px; padding-bottom: 0px;">
            <div style="font-size: 42px; font-weight: bold;">Project</div>
            <div style="color: grey; ">Welcome to my Project showcase. This collection highlights my previous work,
                <br> demonstrating some of sudden bright idea. Each project represents a unique challenge <br> and
                innovative solution.
            </div>
        </n-layout-header>
        <n-layout-content style="padding-left: 30px; padding-bottom: 100px;">
            <div class="subHead">Explained Algorithm Series</div>
            <n-grid :cols="4" :x-gap="12" :y-gap="8" style="padding-bottom: 30px;">
                <n-gi>
                    <div style="border: 1px solid aquamarine;" class="projectsCard"
                        @click="router.push({ name: 'projects-fireEscape' })">
                        <div style="font-size: 18px"><b>Escape the Spreading Fire</b></div>
                        <div>
                            <n-text :depth="3">
                                Determine the longest a man can remain in the room before being safely unable to
                                escape from the top-left corner (0,0) with the fire spreading and obstacles in the
                                way of the walls to the safehouse, which is located at the bottom-right corner. This
                                is done by using the <b>Double BFS algorithm and Binary Search.</b>
                            </n-text>
                        </div>
                        <div>
                            <div class="tag bfs">BFS</div>
                            <div class="tag binary-search">Binary search</div>
                        </div>
                    </div>
                </n-gi>
            </n-grid>
            <n-grid cols="2" :x-gap="12" :y-gap="8">
                <n-gi>
                    <div class="subHead">Example Project 1</div>
                    <div style="color: grey;">Time: 1970/01/01</div>
                    <div>
                        <div style="border: 1px solid aquamarine;" class="projectsCard"
                            @click="router.push({ name: 'projects-fireEscape' })">
                            <div style="font-size: 18px"><b>Escape the Spreading Fire</b></div>
                            <div>
                                <n-text :depth="3">
                                    Determine the longest a man can remain in the room before being safely unable to
                                    escape from the top-left corner (0,0) with the fire spreading and obstacles in
                                    the
                                    way of the walls to the safehouse, which is located at the bottom-right corner.
                                    This
                                    is done by using the <b>Double BFS algorithm and Binary Search.</b>
                                </n-text>
                            </div>
                            <div>
                                <div class="tag bfs">BFS</div>
                                <div class="tag binary-search">Binary search</div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; padding: 30px;">
                        <n-image width="400" src="/website/images/example_1.png"></n-image>
                    </div>
                    <div>
                        <n-row>
                            <n-col :span="6">
                                <n-statistic label="Lines of code" :value="3218"></n-statistic>
                            </n-col>
                            <n-col :span="6">
                                <n-statistic label="Hours Spent" :value="100"></n-statistic>
                            </n-col>
                            <n-col :span="6">
                                <n-statistic label="Commits" :value="128"></n-statistic>
                            </n-col>
                        </n-row>
                    </div>
                </n-gi>
                <n-gi>
                    <div class="subHead">Example Project 2</div>
                    <div style="color: grey;">Time: 1970/01/01</div>
                    <div>
                        <div style="border: 1px solid aquamarine;" class="projectsCard"
                            @click="router.push({ name: 'projects-fireEscape' })">
                            <div style="font-size: 18px"><b>Escape the Spreading Fire</b></div>
                            <div>
                                <n-text :depth="3">
                                    Determine the longest a man can remain in the room before being safely
                                    unable to
                                    escape from the top-left corner (0,0) with the fire spreading and obstacles
                                    in
                                    the
                                    way of the walls to the safehouse, which is located at the bottom-right
                                    corner.
                                    This
                                    is done by using the <b>Double BFS algorithm and Binary Search.</b>
                                </n-text>
                            </div>
                            <div>
                                <div class="tag bfs">BFS</div>
                                <div class="tag binary-search">Binary search</div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; padding: 30px;">
                        <n-image width="400" src="/website/images/example_1.png"></n-image>
                    </div>
                    <div>
                        <n-row>
                            <n-col :span="6">
                                <n-statistic label="Lines of code" :value="3218"></n-statistic>
                            </n-col>
                            <n-col :span="6">
                                <n-statistic label="Hours Spent" :value="100"></n-statistic>
                            </n-col>
                            <n-col :span="6">
                                <n-statistic label="Commits" :value="128"></n-statistic>
                            </n-col>
                        </n-row>
                    </div>
                </n-gi>
            </n-grid>
        </n-layout-content>
        <n-layout-footer style="padding-top: 50px;">
            <div></div>
        </n-layout-footer>
    </n-layout>
</template>

<style>
.lout {
    padding-top: 10px;
    padding-right: 100px;
    padding-left: 100px;
}

.subHead {
    font-size: 1.5rem;
    font-weight: bold;
    padding-bottom: 5px;
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

.tag {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    margin: 5px;
}

.bfs {
    background-color: rgba(13, 52, 249, 0.5);
}

.binary-search {
    background-color: rgb(66, 248, 15, 0.5);
}
</style>