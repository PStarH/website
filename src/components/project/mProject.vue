<script setup lang="ts">
import { projects, projectData } from './project';
import { NBreadcrumb, NBreadcrumbItem, NLayout, NLayoutContent, NLayoutHeader, NGrid, NGi, NImage, NStatistic, NText, NRow, NCol } from 'naive-ui';
import router from "../../router/router"
import { ref } from 'vue';
const project = ref<projectData | null>(null);

initial();

function initial() {
    project.value = projects.find(project => project.routerKey == router.currentRoute.value.name)!
}
</script>

<template>
    <div>
        <div v-if="(router.currentRoute.value.name as string).split('-')[1]"
            style="max-width: 960px; padding: 0 24px; margin: 0 auto">
            <n-breadcrumb>
                <n-breadcrumb-item @click="router.push({ name: 'project' })"> Project
                </n-breadcrumb-item>
                <n-breadcrumb-item> {{ project.name }}
                </n-breadcrumb-item>
            </n-breadcrumb>
        </div>
        <router-view />
    </div>
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