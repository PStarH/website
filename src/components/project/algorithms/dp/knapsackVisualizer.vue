<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    width: {
        type: String,
        default: '700px'
    }
});

// Items: [weight, value, name]
const items = ref([
    { weight: 2, value: 3, name: 'Item A' },
    { weight: 3, value: 4, name: 'Item B' },
    { weight: 4, value: 5, name: 'Item C' },
    { weight: 5, value: 8, name: 'Item D' }
]);

const capacity = ref(8);
const isRunning = ref(false);
const isPaused = ref(false);
const speed = ref(500);
const currentI = ref(0);
const currentW = ref(0);
const dpTable = ref([]);
const selectedItems = ref([]);

const speedMarks = {
    300: 'Fast',
    500: 'Medium',
    800: 'Slow'
};

const initDPTable = () => {
    const n = items.value.length;
    const W = capacity.value;
    dpTable.value = Array(n + 1).fill(0).map(() => 
        Array(W + 1).fill(0).map(() => ({ value: 0, selected: false, highlighted: false }))
    );
};

const reset = () => {
    initDPTable();
    currentI.value = 0;
    currentW.value = 0;
    isRunning.value = false;
    isPaused.value = false;
    selectedItems.value = [];
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runKnapsack = async () => {
    if (isRunning.value) {
        isPaused.value = !isPaused.value;
        return;
    }
    
    reset();
    isRunning.value = true;
    
    const n = items.value.length;
    const W = capacity.value;
    
    // Build DP table with visualization
    for (let i = 1; i <= n; i++) {
        currentI.value = i;
        
        for (let w = 1; w <= W; w++) {
            while (isPaused.value) {
                await sleep(100);
            }
            if (!isRunning.value) return;
            
            currentW.value = w;
            dpTable.value[i][w].highlighted = true;
            
            const item = items.value[i - 1];
            
            if (item.weight <= w) {
                const includeValue = item.value + dpTable.value[i - 1][w - item.weight].value;
                const excludeValue = dpTable.value[i - 1][w].value;
                
                if (includeValue > excludeValue) {
                    dpTable.value[i][w].value = includeValue;
                    dpTable.value[i][w].selected = true;
                } else {
                    dpTable.value[i][w].value = excludeValue;
                    dpTable.value[i][w].selected = false;
                }
            } else {
                dpTable.value[i][w].value = dpTable.value[i - 1][w].value;
                dpTable.value[i][w].selected = false;
            }
            
            await sleep(speed.value);
            dpTable.value[i][w].highlighted = false;
        }
    }
    
    // Trace back to find selected items
    let w = W;
    for (let i = n; i > 0; i--) {
        if (dpTable.value[i][w].selected) {
            selectedItems.value.push(items.value[i - 1]);
            w -= items.value[i - 1].weight;
        }
    }
    
    isRunning.value = false;
};

const getCellStyle = (i, w) => {
    const cell = dpTable.value[i]?.[w];
    if (!cell) return {};
    
    let bgColor = 'white';
    
    if (cell.highlighted) {
        bgColor = '#FF9800'; // orange for current
    } else if (i === 0 || w === 0) {
        bgColor = '#e0e0e0'; // gray for base case
    } else if (cell.selected && i === currentI.value && w >= currentW.value) {
        bgColor = '#C8E6C9'; // light green for selected
    }
    
    return {
        backgroundColor: bgColor,
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'center',
        minWidth: '50px',
        transition: 'background-color 0.3s'
    };
};

const addItem = () => {
    const names = ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const nameIndex = items.value.length - 4;
    items.value.push({
        weight: Math.floor(Math.random() * 5) + 1,
        value: Math.floor(Math.random() * 8) + 2,
        name: `Item ${names[nameIndex] || nameIndex}`
    });
    reset();
};

const removeItem = () => {
    if (items.value.length > 1) {
        items.value.pop();
        reset();
    }
};

initDPTable();
</script>

<template>
    <div class="knapsack-container" :style="{ width: width }">
        <div class="controls-panel">
            <div class="control-row">
                <div class="control-group">
                    <label class="control-label">
                        <span class="label-icon">🎒</span>
                        Knapsack Capacity
                    </label>
                    <n-input-number 
                        v-model:value="capacity" 
                        :min="1" 
                        :max="15"
                        :disabled="isRunning"
                        @update:value="reset"
                        size="large"
                        style="width: 140px">
                        <template #suffix>
                            <span style="color: #999;">kg</span>
                        </template>
                    </n-input-number>
                </div>
                
                <div class="control-group">
                    <label class="control-label">
                        <span class="label-icon">⚡</span>
                        Animation Speed
                    </label>
                    <div style="width: 220px;">
                        <n-slider 
                            v-model:value="speed" 
                            :min="300" 
                            :max="800" 
                            :step="100"
                            :marks="speedMarks"
                            :disabled="isRunning"
                            :reverse="true"
                            :tooltip="false" />
                    </div>
                </div>
            </div>
            
            <div class="button-group">
                <n-button 
                    type="primary" 
                    size="large"
                    @click="runKnapsack"
                    :disabled="isRunning && !isPaused"
                    style="min-width: 160px; font-weight: 600;">
                    <template #icon>
                        <span style="font-size: 18px;">{{ isRunning ? (isPaused ? '▶️' : '⏸️') : '🚀' }}</span>
                    </template>
                    {{ isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Build DP Table' }}
                </n-button>
                <n-button 
                    size="large"
                    @click="reset" 
                    :disabled="isRunning && !isPaused"
                    style="min-width: 100px;">
                    <template #icon>
                        <span style="font-size: 18px;">🔄</span>
                    </template>
                    Reset
                </n-button>
            </div>
        </div>
        
        <div class="items-section">
            <div class="section-header">
                <h4 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">📦</span>
                    Available Items
                </h4>
                <n-space>
                    <n-button 
                        size="medium" 
                        @click="addItem" 
                        :disabled="isRunning || items.length >= 8"
                        type="success"
                        ghost>
                        <template #icon>
                            <span style="font-size: 16px;">➕</span>
                        </template>
                        Add Item
                    </n-button>
                    <n-button 
                        size="medium" 
                        @click="removeItem" 
                        :disabled="isRunning || items.length <= 1"
                        type="error"
                        ghost>
                        <template #icon>
                            <span style="font-size: 16px;">➖</span>
                        </template>
                        Remove Item
                    </n-button>
                </n-space>
            </div>
            <div class="items-grid">
                <div 
                    v-for="(item, idx) in items" 
                    :key="idx"
                    class="item-card"
                    :class="{ 'item-selected': selectedItems.includes(item) }">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-stats">
                        <div class="stat-item">
                            <span class="stat-icon">⚖️</span>
                            <span class="stat-value">{{ item.weight }} kg</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">💎</span>
                            <span class="stat-value">{{ item.value }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="dp-table-section">
            <div class="section-title">
                <span style="font-size: 20px;">📊</span>
                <span>Dynamic Programming Table</span>
            </div>
            <div class="table-description">
                dp[i][w] = maximum value using first <b>i</b> items with capacity <b>w</b>
                <br>
                <span style="font-size: 12px; opacity: 0.8;">💡 Tip: Scroll horizontally to view all capacity values →</span>
            </div>
            <div class="table-scroll">
                <table class="dp-table">
                    <thead>
                        <tr>
                            <th>Item\Capacity</th>
                            <th v-for="w in capacity + 1" :key="w">{{ w - 1 }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>0 (No items)</b></td>
                            <td v-for="w in capacity + 1" :key="w" :style="getCellStyle(0, w - 1)">
                                {{ dpTable[0]?.[w - 1]?.value || 0 }}
                            </td>
                        </tr>
                        <tr v-for="(item, idx) in items" :key="idx">
                            <td><b>{{ idx + 1 }} ({{ item.name }})</b></td>
                            <td v-for="w in capacity + 1" :key="w" :style="getCellStyle(idx + 1, w - 1)">
                                {{ dpTable[idx + 1]?.[w - 1]?.value || 0 }}
                                <span v-if="dpTable[idx + 1]?.[w - 1]?.selected" style="color: green;">✓</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div v-if="selectedItems.length > 0" class="result-section">
            <n-alert type="success" title="Optimal Solution">
                <div><b>Maximum Value: {{ dpTable[items.length]?.[capacity]?.value || 0 }}</b></div>
                <div>Selected Items: 
                    <n-tag 
                        v-for="item in selectedItems" 
                        :key="item.name"
                        type="success"
                        style="margin: 4px;">
                        {{ item.name }} (Weight:{{ item.weight }}, Value:{{ item.value }})
                    </n-tag>
                </div>
                <div>Total Weight: {{ selectedItems.reduce((sum, item) => sum + item.weight, 0) }} / {{ capacity }}</div>
            </n-alert>
        </div>
        
        <div class="legend">
            <div class="legend-title">Color Guide</div>
            <div class="legend-grid">
                <div class="legend-item">
                    <div class="legend-color" style="background: #e0e0e0; border: 1px solid #999;"></div>
                    <span>Base Case (0)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #FF9800; border: 1px solid #F57C00;"></div>
                    <span>Currently Computing</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #C8E6C9; border: 1px solid #4CAF50;"></div>
                    <span>Item Selected</span>
                </div>
            </div>
        </div>
        
        <div class="instructions">
            <n-text depth="3">
                <p><b>How to use:</b></p>
                <p>• Adjust the knapsack capacity and add/remove items</p>
                <p>• Click "Build DP Table" to watch the dynamic programming table being filled</p>
                <p>• Orange cells show the position currently being computed</p>
                <p>• Green ✓ indicates that the item is selected at this position</p>
                <p>• After completion, the optimal solution and selected items will be displayed</p>
                <p><b>State Transition Equation:</b></p>
                <p style="font-family: monospace; background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px;">
                    If weight[i] ≤ w:<br/>
                    &nbsp;&nbsp;dp[i][w] = max(value[i] + dp[i-1][w-weight[i]], dp[i-1][w])<br/>
                    Otherwise:<br/>
                    &nbsp;&nbsp;dp[i][w] = dp[i-1][w]
                </p>
            </n-text>
        </div>
    </div>
</template>

<style scoped>
.knapsack-container {
    margin: 0 auto;
    padding: 20px;
}

.controls-panel {
    background: linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%);
    border: 2px solid rgba(103, 58, 183, 0.2);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.control-row {
    display: flex;
    gap: 40px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    align-items: flex-end;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.control-label {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    gap: 8px;
}

.label-icon {
    font-size: 18px;
}

.button-group {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.controls {
    margin-bottom: 20px;
}

.items-section {
    margin: 24px 0;
    padding: 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
}

.item-card {
    padding: 16px;
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
    text-align: center;
    transition: all 0.3s ease;
    cursor: default;
}

.item-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.item-selected {
    border-color: #4CAF50;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(76, 175, 80, 0.15) 100%);
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
}

.item-name {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.95);
}

.item-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stat-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 14px;
}

.stat-icon {
    font-size: 16px;
}

.stat-value {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
}

.dp-table-section {
    margin: 24px 0;
}

.section-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.95);
}

.table-description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border-left: 3px solid rgba(103, 58, 183, 0.5);
}

.table-scroll {
    overflow-x: auto;
    max-width: 100%;
    border-radius: 8px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

.table-scroll::-webkit-scrollbar {
    height: 12px;
}

.table-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
}

.table-scroll::-webkit-scrollbar-thumb {
    background: rgba(103, 58, 183, 0.5);
    border-radius: 6px;
}

.table-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(103, 58, 183, 0.7);
}

.dp-table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;
}

.dp-table th,
.dp-table td {
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 12px;
    text-align: center;
    min-width: 60px;
    font-size: 14px;
}

.dp-table th {
    background: linear-gradient(135deg, rgba(103, 58, 183, 0.3) 0%, rgba(63, 81, 181, 0.3) 100%);
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
}

.dp-table td:first-child,
.dp-table th:first-child {
    position: sticky;
    left: 0;
    background-color: rgba(50, 50, 60, 0.95);
    z-index: 1;
    font-weight: 600;
    border-right: 2px solid rgba(103, 58, 183, 0.4);
}

.dp-table tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.03);
}

.result-section {
    margin: 20px 0;
}

.legend {
    margin: 24px 0;
    padding: 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.legend-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: rgba(255, 255, 255, 0.9);
}

.legend-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    transition: all 0.2s;
}

.legend-item:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
}

.legend-color {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.instructions {
    margin-top: 24px;
    padding: 20px;
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%);
    border-radius: 12px;
    border-left: 4px solid #2196F3;
}

.instructions p {
    margin: 10px 0;
    line-height: 1.7;
}

.instructions b {
    color: rgba(255, 255, 255, 0.95);
}
</style>
