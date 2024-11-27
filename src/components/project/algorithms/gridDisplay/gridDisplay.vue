<script setup lang="ts">
import {
    NFlex,
    NGrid, NGi,
    NSwitch,
    NIcon, NInputNumber, NSlider
} from 'naive-ui';
import { calcTime } from '../../bfs/bfs.functions';
import { dfsFireEscape, findMaxIn2DArray } from '../../dfs/dfs.functions';
import { computed, CSSProperties, ref, watch } from 'vue';

const props = defineProps({
    rows: Number,
    cols: Number,
    figurePosition: Number,
    showPlayer: {
        type: Boolean,
        default: () => false
    },
    showExit: {
        type: Boolean,
        default: () => false
    },
    allowSetup: {
        type: Boolean,
        default: () => false
    },
    allowSlide: {
        type: Boolean,
        default: () => false
    },
    width: {
        type: String,
        default: () => '360px'
    },
})

const sliderValue = ref(0);

const grid = ref<number[][]>([]);

const player = ref<number[]>([0, 0]);

const waitingMark = ref<number>(0);

const escapedMark = ref<number>(0);

const marks = computed(() => {
    return props.showPlayer ? {
        0: '0 min',
        [waitingMark.value]: `${waitingMark.value} min`,
        [escapedMark.value]: `${escapedMark.value} min`,
    } : {
        0: '0 min',
        [escapedMark.value]: `${escapedMark.value} min`,
    }
})

const fires = ref<number[][]>([]);

const switchVal = ref<1 | 2>(2);

const dfsPlayerPath = ref<number[][]>([]);

const arrival = (x: number, y: number) => {
    return x === props.rows - 1 && y === props.cols - 1;
}

const blockStyle = (x: number, y: number) => {
    return {
        borderTop: '1px solid #000',
        borderRight: x == props.cols! - 1 ? '1px solid #000' : null,
        borderBottom: y == props.rows! - 1 ? '1px solid #000' : null,
        borderLeft: '1px solid #000',
        aspectRatio: "1/1",
        cursor: props.allowSetup ? 'pointer' : undefined
    }
}

const UpdateGrid = (time: number) => {
    if (time >= waitingMark.value && time - waitingMark.value != dfsPlayerPath.value.length) {
        player.value = dfsPlayerPath.value[time - waitingMark.value];
    } else if (time < waitingMark.value) {
        player.value = [0, 0]
    }
};

const railStyle = ({
    focused,
    checked
}: {
    focused: boolean
    checked: boolean
}) => {
    const style: CSSProperties = {}
    if (checked) {
        style.background = '#FF3333'
        if (focused) {
            style.boxShadow = '0 0 0 2px #FF333340'
        }
    }
    else {
        style.background = '#663300'
        if (focused) {
            style.boxShadow = '0 0 0 2px #66330040'
        }
    }
    return style
}

initial();

function initial() {
    grid.value = Array(props.rows).fill(0).map(() => Array(props.cols).fill(0));
    handleFigurePosition(0);
    setup();
}

watch(sliderValue, (newVal, oldVal) => {
    if (newVal > oldVal) {
        grid.value.map((gi, m: number) => {
            for (let n = 0; n < fires.value[m].length; n++) {
                if (fires.value[m][n] <= newVal && fires.value[m][n] && gi[n] != 2) {
                    gi[n] = 1;
                }
            };
            return gi;
        })
    } else {
        grid.value.map((gi, m: number) => {
            for (let n = 0; n < fires.value[m].length; n++) {
                if (fires.value[m][n] > newVal && gi[n] != 2) {
                    gi[n] = 0;
                }
            };
            return gi;
        })
    }
})

function setup() {
    const firePlayerBuffer = calcTime(grid.value);
    waitingMark.value = firePlayerBuffer.maxWaitTime;
    fires.value = firePlayerBuffer.Firemap;
    escapedMark.value = findMaxIn2DArray(fires.value) - (props.showExit ? 1 : 0);
    dfsPlayerPath.value = dfsFireEscape(grid.value, fires.value)
    if (waitingMark.value == -1) {
        waitingMark.value = 0;
        if (dfsPlayerPath.value) {
            escapedMark.value = dfsPlayerPath.value.length - (props.showExit ? 1 : 0);
        } else {
            escapedMark.value = 0;
        }
    }
}

function handleFigurePosition(p: number) {
    switch (p) {
        case 0:
            grid.value = [
                [0, 2, 0, 0, 0, 0, 0],
                [0, 0, 0, 2, 2, 1, 0],
                [0, 2, 0, 0, 1, 2, 0],
                [0, 0, 2, 2, 2, 0, 2],
                [0, 0, 0, 0, 0, 0, 0]
            ];
            break;
        case 1:

            break;
        case 2:

            break;
        case 3:

            break;
        default:
            break;
    }
}

function handleSwitchUpdate(value: number) {
    console.log(switchVal.value)
}

function handleSetBlock(x: number, y: number) {
    if (props.allowSetup) {
        if ((player.value[0] === y && player.value[1] === x) ||
            (y === props.rows && x === props.cols) ||
            sliderValue.value != 0) {

        } else {
            if (grid.value[y][x] == switchVal.value) {
                grid.value[y][x] = 0;
            } else {
                grid.value[y][x] = switchVal.value
            }
            setup();
        }
    }
}
</script>

<template>
    <div class="GridContainer" :style="{ width: width }">
        <n-flex v-if="allowSetup" style="margin: 24px 0" :justify="'end'" :align="'center'">
            Click to switch block
            <n-switch :rail-style="railStyle" v-model:value="switchVal" :checked-value="1" :unchecked-value="2"
                @update:value="handleSwitchUpdate" :round="false">
                <template #checked-icon>
                    <n-icon color="#FF3333" :size="24">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 24 24">
                            <path
                                d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23c.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59c-1.81-1.37-2-3.34-1.84-4.75c.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54c2.43.31 5.06-.14 6.95-1.87c2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44-.35 2.18-1.39 2.38-2.31c.33-1.43-.96-2.83-.09-5.09c.33 1.87 3.27 3.04 3.27 5.08c.08 2.53-2.66 4.7-5.56 2.32z"
                                fill="currentColor"></path>
                        </svg>
                    </n-icon>
                </template>
                <template #unchecked-icon>
                    <n-icon color="#663300" :size="24">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 24 24">
                            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <rect x="4" y="4" width="20" height="20" rx="2"></rect>
                                <path d="M4 8h16"></path>
                                <path d="M20 12H4"></path>
                                <path d="M4 16h16"></path>
                                <path d="M9 4v4"></path>
                                <path d="M14 8v4"></path>
                                <path d="M8 12v4"></path>
                                <path d="M16 12v4"></path>
                                <path d="M11 16v4"></path>
                            </g>
                        </svg>
                    </n-icon>
                </template>
            </n-switch>
        </n-flex>
        <n-grid v-for="(row, y) in rows" :key="y" :cols="cols">
            <n-gi v-for="(col, x) in cols" :key="x" class="block" @click="handleSetBlock(x, y)"
                :style="blockStyle(x, y)">
                <n-flex style="height: 100%" :align="'center'" :justify="'center'">
                    <div v-if="grid[y][x] === 2">
                        <!-- {{ wall }} -->
                        <n-icon color="#663300" style="margin-top: 7px" :size="36">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                                    <path d="M4 8h16"></path>
                                    <path d="M20 12H4"></path>
                                    <path d="M4 16h16"></path>
                                    <path d="M9 4v4"></path>
                                    <path d="M14 8v4"></path>
                                    <path d="M8 12v4"></path>
                                    <path d="M16 12v4"></path>
                                    <path d="M11 16v4"></path>
                                </g>
                            </svg>
                        </n-icon>
                    </div>
                    <div v-if="showPlayer && (player[0] === y && player[1] === x) && !arrival(player[0], player[1])">
                        <!-- {{ playerEmoji }} -->
                        <n-icon style="margin-top: 7px" :size="28">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 448 512">
                                <path
                                    d="M64 224h13.5c24.7 56.5 80.9 96 146.5 96s121.8-39.5 146.5-96H384c8.8 0 16-7.2 16-16v-96c0-8.8-7.2-16-16-16h-13.5C345.8 39.5 289.6 0 224 0S102.2 39.5 77.5 96H64c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16zm40-88c0-22.1 21.5-40 48-40h144c26.5 0 48 17.9 48 40v24c0 53-43 96-96 96h-48c-53 0-96-43-96-96v-24zm72 72l12-36l36-12l-36-12l-12-36l-12 36l-36 12l36 12l12 36zm151.6 113.4C297.7 340.7 262.2 352 224 352s-73.7-11.3-103.6-30.6C52.9 328.5 0 385 0 454.4v9.6c0 26.5 21.5 48 48 48h80v-64c0-17.7 14.3-32 32-32h128c17.7 0 32 14.3 32 32v64h80c26.5 0 48-21.5 48-48v-9.6c0-69.4-52.9-125.9-120.4-133zM272 448c-8.8 0-16 7.2-16 16s7.2 16 16 16s16-7.2 16-16s-7.2-16-16-16zm-96 0c-8.8 0-16 7.2-16 16v48h32v-48c0-8.8-7.2-16-16-16z"
                                    fill="currentColor"></path>
                            </svg>
                        </n-icon>
                    </div>
                    <div v-if="grid[y][x] === 1 && (!arrival(y, x) || !showExit)">
                        <!-- {{ fireEmoji }} -->
                        <n-icon :style="{ marginTop: '7px', opacity: 1 }" color="#FF3333" :size="28">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23c.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59c-1.81-1.37-2-3.34-1.84-4.75c.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54c2.43.31 5.06-.14 6.95-1.87c2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44-.35 2.18-1.39 2.38-2.31c.33-1.43-.96-2.83-.09-5.09c.33 1.87 3.27 3.04 3.27 5.08c.08 2.53-2.66 4.7-5.56 2.32z"
                                    fill="currentColor"></path>
                            </svg>
                        </n-icon>
                    </div>
                    <div
                        v-if="fires[y][x] == sliderValue + 1 && ((fires[player[0]][player[1]] != sliderValue + 1) || !showPlayer) && grid[y][x] != 2 && (!arrival(y, x) || !showExit)">
                        <!-- {{ fireEmoji }} -->
                        <n-icon :style="{ marginTop: '7px', opacity: 0.2 }" color="#FF3333" :size="28">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 24 24">
                                <path
                                    d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23c.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59c-1.81-1.37-2-3.34-1.84-4.75c.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54c2.43.31 5.06-.14 6.95-1.87c2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44-.35 2.18-1.39 2.38-2.31c.33-1.43-.96-2.83-.09-5.09c.33 1.87 3.27 3.04 3.27 5.08c.08 2.53-2.66 4.7-5.56 2.32z"
                                    fill="currentColor"></path>
                            </svg>
                        </n-icon>
                    </div>
                    <div v-if="showExit && (y === rows! - 1 && x === cols! - 1)">
                        <!-- {{ safeEmoji }} -->
                        <n-icon style="margin-top: 5px" :size="28"
                            :color="arrival(player[0], player[1]) ? '#18a058' : undefined">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 24 24">
                                <path
                                    d="M10.09 15.59L11.5 17l5-5l-5-5l-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                                    fill="currentColor"></path>
                            </svg>
                        </n-icon>
                    </div>
                </n-flex>
            </n-gi>
        </n-grid>
        <Transition mode="out-in">
            <div v-if="(escapedMark > 0 && waitingMark != -1) && allowSlide" class="sliderContainer">
                <n-slider v-model:value="sliderValue" :marks="marks" :min="0" :max="escapedMark"
                    @update:value="UpdateGrid" />
            </div>
            <div v-else style="height: 74px"></div>
        </Transition>
    </div>
</template>

<style lang="less" scoped>
.GridContainer {
    margin: 0 auto;

    .sliderContainer {
        margin: 24px 0;
    }
}
</style>