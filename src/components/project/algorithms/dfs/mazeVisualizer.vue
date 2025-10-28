<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    width: {
        type: String,
        default: '700px'
    }
});

const rows = 8;
const cols = 8;

// Cell types: 'empty', 'wall', 'start', 'end', 'visited', 'current', 'path', 'backtrack'
const maze = ref([
    [{ type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'wall' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }],
    [{ type: 'empty' }, { type: 'wall' }, { type: 'empty' }, { type: 'wall' }, { type: 'empty' }, { type: 'wall' }, { type: 'wall' }, { type: 'empty' }],
    [{ type: 'empty' }, { type: 'wall' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'wall' }, { type: 'empty' }],
    [{ type: 'empty' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'empty' }, { type: 'wall' }, { type: 'empty' }],
    [{ type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }],
    [{ type: 'empty' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'empty' }, { type: 'wall' }, { type: 'wall' }],
    [{ type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'wall' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }],
    [{ type: 'wall' }, { type: 'wall' }, { type: 'wall' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'wall' }, { type: 'empty' }]
]);

const start = ref([0, 0]);
const end = ref([7, 7]);
const editMode = ref('wall'); // 'wall', 'start', 'end'

const isRunning = ref(false);
const isPaused = ref(false);
const speed = ref(200);
const currentStep = ref(0);
const steps = ref([]);
const foundPath = ref(false);
const backtrackStack = ref([]); // To visualize the recursion stack

const speedMarks = {
    100: 'Slow',
    200: 'Medium',
    300: 'Fast',
    400: 'Fastest'
};

const editModes = [
    { label: 'Wall', value: 'wall', icon: '🧱' },
    { label: 'Start', value: 'start', icon: '🚀' },
    { label: 'Goal', value: 'end', icon: '🎯' }
];

const directions = [
    [0, 1],  // right
    [1, 0],  // down
    [0, -1], // left
    [-1, 0]  // up
];

const resetMaze = () => {
    maze.value = maze.value.map((row, x) => 
        row.map((cell, y) => {
            if (cell.type === 'visited' || cell.type === 'current' || cell.type === 'path' || cell.type === 'backtrack') {
                return { type: 'empty' };
            }
            return cell;
        })
    );
    currentStep.value = 0;
    steps.value = [];
    foundPath.value = false;
    isRunning.value = false;
    isPaused.value = false;
    backtrackStack.value = [];
};

const clearMaze = () => {
    maze.value = maze.value.map(row => 
        row.map(() => ({ type: 'empty' }))
    );
    start.value = [0, 0];
    end.value = [7, 7];
    resetMaze();
};

const isValid = (x, y, visited) => {
    return x >= 0 && x < rows && y >= 0 && y < cols && 
           maze.value[x][y].type !== 'wall' && !visited[x][y];
};

const findPathDFS = () => {
    const visited = Array(rows).fill(0).map(() => Array(cols).fill(false));
    const path = [];
    const allSteps = [];
    
    const dfs = (x, y, depth = 0) => {
        if (x === end.value[0] && y === end.value[1]) {
            path.push([x, y]);
            allSteps.push({
                x, y,
                type: 'found',
                path: [...path],
                stack: [...path]
            });
            return true;
        }
        
        visited[x][y] = true;
        path.push([x, y]);
        
        allSteps.push({
            x, y,
            type: 'visit',
            path: [...path],
            stack: [...path],
            depth
        });
        
        // Try all four directions
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (isValid(nx, ny, visited)) {
                if (dfs(nx, ny, depth + 1)) {
                    return true;
                }
            }
        }
        
        // Backtrack - this is the key visualization
        allSteps.push({
            x, y,
            type: 'backtrack',
            path: [...path],
            stack: [...path],
            backtrackFrom: [x, y],
            depth
        });
        path.pop();
        
        return false;
    };
    
    dfs(start.value[0], start.value[1]);
    return allSteps;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runVisualization = async () => {
    if (isRunning.value) {
        isPaused.value = !isPaused.value;
        return;
    }
    
    resetMaze();
    isRunning.value = true;
    steps.value = findPathDFS();
    
    for (let i = 0; i < steps.value.length; i++) {
        while (isPaused.value) {
            await sleep(100);
        }
        
        if (!isRunning.value) break;
        
        const step = steps.value[i];
        currentStep.value = i;
        backtrackStack.value = step.stack;
        
        if (step.type === 'visit') {
            maze.value[step.x][step.y].type = 'current';
            await sleep(speed.value);
            if (step.x !== start.value[0] || step.y !== start.value[1]) {
                maze.value[step.x][step.y].type = 'visited';
            }
        } else if (step.type === 'backtrack') {
            // Highlight the backtrack
            maze.value[step.x][step.y].type = 'backtrack';
            await sleep(speed.value);
            if (step.x !== start.value[0] || step.y !== start.value[1]) {
                maze.value[step.x][step.y].type = 'visited';
            }
        } else if (step.type === 'found') {
            // Mark the final path
            for (const [px, py] of step.path) {
                maze.value[px][py].type = 'path';
                await sleep(speed.value / 3);
            }
            foundPath.value = true;
        }
    }
    
    backtrackStack.value = [];
    isRunning.value = false;
};

const getCellStyle = (x, y) => {
    const cell = maze.value[x][y];
    let bgColor = 'rgba(255, 255, 255, 0.05)';
    let borderColor = 'rgba(255, 255, 255, 0.1)';
    let boxShadow = 'none';
    
    if (x === start.value[0] && y === start.value[1]) {
        bgColor = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        boxShadow = '0 0 15px rgba(76, 175, 80, 0.6)';
    } else if (x === end.value[0] && y === end.value[1]) {
        bgColor = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
        boxShadow = '0 0 15px rgba(33, 150, 243, 0.6)';
    } else if (cell.type === 'wall') {
        bgColor = 'linear-gradient(135deg, #424242 0%, #303030 100%)';
        borderColor = '#212121';
    } else if (cell.type === 'visited') {
        bgColor = 'rgba(255, 224, 130, 0.4)';
        borderColor = 'rgba(255, 224, 130, 0.6)';
    } else if (cell.type === 'current') {
        bgColor = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
        boxShadow = '0 0 20px rgba(255, 152, 0, 0.8)';
    } else if (cell.type === 'path') {
        bgColor = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
    } else if (cell.type === 'backtrack') {
        bgColor = 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)';
        boxShadow = '0 0 15px rgba(233, 30, 99, 0.6)';
    }
    
    return {
        background: bgColor,
        border: `2px solid ${borderColor}`,
        boxShadow: boxShadow,
        transition: 'all 0.3s ease',
        cursor: isRunning.value ? 'default' : 'pointer'
    };
};

const toggleCell = (x, y) => {
    if (isRunning.value) return;
    
    if (editMode.value === 'start') {
        start.value = [x, y];
    } else if (editMode.value === 'end') {
        end.value = [x, y];
    } else if (editMode.value === 'wall') {
        if ((x === start.value[0] && y === start.value[1]) || 
            (x === end.value[0] && y === end.value[1])) {
            return;
        }
        
        if (maze.value[x][y].type === 'empty' || maze.value[x][y].type === 'visited') {
            maze.value[x][y].type = 'wall';
        } else if (maze.value[x][y].type === 'wall') {
            maze.value[x][y].type = 'empty';
        }
    }
};

const getCellIcon = (x, y) => {
    if (x === start.value[0] && y === start.value[1]) return '🚀';
    if (x === end.value[0] && y === end.value[1]) return '🎯';
    if (maze.value[x][y].type === 'wall') return '🧱';
    return '';
};
</script>

<template>
    <div class="maze-container" :style="{ width: width }">
        <!-- Control Panel -->
        <div class="controls-panel">
            <div class="edit-mode-section">
                <div class="section-header">
                    <span class="section-icon">🎨</span>
                    <div>
                        <div class="section-title">Edit Mode</div>
                        <div class="section-hint">Click grid cells to place selected item</div>
                    </div>
                </div>
                <div class="mode-buttons">
                    <button 
                        v-for="mode in editModes" 
                        :key="mode.value"
                        :class="['mode-btn', { active: editMode === mode.value }]"
                        @click="editMode = mode.value"
                        :disabled="isRunning">
                        <span class="mode-icon">{{ mode.icon }}</span>
                        <span class="mode-label">{{ mode.label }}</span>
                    </button>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="speed-section">
                <label class="control-label">
                    <span class="label-icon">⚡</span>
                    Animation Speed
                </label>
                <div class="speed-slider">
                    <n-slider 
                        v-model:value="speed" 
                        :min="100" 
                        :max="400" 
                        :step="100"
                        :marks="speedMarks"
                        :disabled="isRunning"
                        :tooltip="false" />
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="action-buttons">
                <n-button 
                    type="primary" 
                    size="large"
                    @click="runVisualization"
                    :disabled="isRunning && !isPaused"
                    class="primary-btn">
                    <template #icon>
                        <span class="btn-icon">{{ isRunning ? (isPaused ? '▶️' : '⏸️') : '🚀' }}</span>
                    </template>
                    {{ isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Start DFS' }}
                </n-button>
                <n-button 
                    size="large"
                    @click="resetMaze" 
                    :disabled="isRunning && !isPaused"
                    class="secondary-btn">
                    <template #icon>
                        <span class="btn-icon">🔄</span>
                    </template>
                    Reset
                </n-button>
                <n-button 
                    size="large"
                    @click="clearMaze" 
                    :disabled="isRunning"
                    type="warning"
                    ghost
                    class="secondary-btn">
                    <template #icon>
                        <span class="btn-icon">🗑️</span>
                    </template>
                    Clear All
                </n-button>
            </div>
        </div>
        
        <!-- Recursion Stack Visualization -->
        <div v-if="backtrackStack.length > 0" class="stack-visualization">
            <div class="stack-header">
                <span class="stack-icon">📚</span>
                <span class="stack-title">Recursion Stack</span>
                <span class="stack-depth">(Depth: {{ backtrackStack.length }})</span>
            </div>
            <div class="stack-content">
                <n-tag 
                    v-for="(pos, idx) in backtrackStack.slice().reverse()" 
                    :key="idx"
                    :type="idx === 0 ? 'error' : 'info'"
                    size="medium"
                    class="stack-tag">
                    {{ idx === 0 ? '👉 ' : '' }}({{ pos[0] }}, {{ pos[1] }})
                </n-tag>
            </div>
        </div>
        
        <!-- Maze Grid -->
        <div class="maze-wrapper">
            <div class="maze-grid">
                <template v-for="(row, x) in maze" :key="`row-${x}`">
                    <div 
                        v-for="(cell, y) in row"
                        :key="`cell-${x}-${y}`"
                        class="maze-cell"
                        :style="getCellStyle(x, y)"
                        @click="toggleCell(x, y)">
                        <span class="cell-icon">{{ getCellIcon(x, y) }}</span>
                    </div>
                </template>
            </div>
        </div>
        
        <!-- Legend -->
        <div class="legend">
            <div class="legend-title">Color Guide</div>
            <div class="legend-grid">
                <div class="legend-item">
                    <div class="legend-color" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);"></div>
                    <span>Start / Path</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);"></div>
                    <span>Goal</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: linear-gradient(135deg, #424242 0%, #303030 100%);"></div>
                    <span>Wall</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: rgba(255, 224, 130, 0.4); border: 2px solid rgba(255, 224, 130, 0.6);"></div>
                    <span>Visited</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);"></div>
                    <span>Exploring</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%); box-shadow: 0 0 10px rgba(233, 30, 99, 0.5);"></div>
                    <span>Backtracking</span>
                </div>
            </div>
        </div>
        
        <!-- Success Message -->
        <div v-if="foundPath" class="result-section">
            <n-alert type="success" title="Path Found! 🎉">
                DFS successfully found a path from start to goal. The green cells show the final path.
            </n-alert>
        </div>
        
        <!-- Instructions -->
        <div class="instructions">
            <n-text depth="3">
                <p><b>How to use:</b></p>
                <p>• <b>Edit Mode:</b> Click 🧱 to draw walls, 🚀 to set start, or 🎯 to set goal</p>
                <p>• <b>Click cells</b> on the grid to place walls or move start/goal positions</p>
                <p>• <b>Orange (Exploring):</b> Current position being examined by DFS</p>
                <p>• <b>Pink (Backtracking):</b> DFS is going back to try other paths - watch the recursion stack!</p>
                <p>• <b>Yellow (Visited):</b> Already explored positions</p>
                <p>• <b>Green (Path):</b> The final solution path from start to goal</p>
                <p>• The <b>Recursion Stack</b> shows the current call stack depth in DFS</p>
            </n-text>
        </div>
    </div>
</template>

<style scoped>
.maze-container {
    margin: 0 auto;
    padding: 20px;
}

.controls-panel {
    background: linear-gradient(135deg, rgba(103, 58, 183, 0.15) 0%, rgba(63, 81, 181, 0.15) 100%);
    border: 2px solid rgba(103, 58, 183, 0.3);
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.edit-mode-section {
    margin-bottom: 24px;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.section-icon {
    font-size: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: 0.5px;
}

.section-hint {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 2px;
}

.mode-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.mode-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: rgba(255, 255, 255, 0.8);
}

.mode-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(103, 58, 183, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3);
}

.mode-btn.active {
    background: linear-gradient(135deg, rgba(103, 58, 183, 0.4) 0%, rgba(63, 81, 181, 0.4) 100%);
    border-color: rgba(103, 58, 183, 0.8);
    box-shadow: 0 0 20px rgba(103, 58, 183, 0.5);
}

.mode-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.mode-icon {
    font-size: 32px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.mode-label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.divider {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
    margin: 20px 0;
}

.speed-section {
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

.speed-slider {
    width: 100%;
    max-width: 400px;
    padding: 0 8px;
}

.action-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
    min-width: 140px;
    font-weight: 600;
}

.btn-icon {
    font-size: 18px;
}

.stack-visualization {
    background: linear-gradient(135deg, rgba(233, 30, 99, 0.15) 0%, rgba(156, 39, 176, 0.15) 100%);
    border: 2px solid rgba(233, 30, 99, 0.4);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.2);
}

.stack-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.stack-icon {
    font-size: 20px;
}

.stack-title {
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
}

.stack-depth {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
}

.stack-content {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.stack-tag {
    font-weight: 600;
}

.maze-wrapper {
    display: flex;
    justify-content: center;
    margin: 24px 0;
}

.maze-grid {
    display: grid;
    grid-template-columns: repeat(8, 60px);
    grid-template-rows: repeat(8, 60px);
    gap: 0;
    border: 3px solid rgba(103, 58, 183, 0.5);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.maze-row {
    display: contents;
}

.maze-cell {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.maze-cell:hover {
    opacity: 0.8;
}

.cell-icon {
    font-size: 28px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
}

.result-section {
    margin: 24px 0;
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

/* Responsive adjustments */
@media (max-width: 768px) {
    .maze-grid {
        grid-template-columns: repeat(8, 45px);
        grid-template-rows: repeat(8, 45px);
    }
    
    .maze-cell {
        width: 45px;
        height: 45px;
    }
    
    .cell-icon {
        font-size: 20px;
    }
    
    .mode-buttons {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .primary-btn,
    .secondary-btn {
        width: 100%;
    }
}
</style>
