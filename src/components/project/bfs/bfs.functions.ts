export function calcTime(grid: number[][]) {
    // 初始火元素集合，用于标记火的位置，避免重复处理
    const ogFireSet = new Set<string>();
    // 初始火元素的坐标数组
    const startingFires: number[][] = [];

    const m = grid.length;
    const n = grid[0].length;

    const Firemap: number[][] = Array(m).fill(0).map(() => Array(n).fill(0));

    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    // 遍历网格，找到初始的火元素位置，并添加到集合和数组中
    grid.forEach((row, x) => {
        row.forEach((val, y) => {
            if (val === 1) {
                startingFires.push([x, y]);
                ogFireSet.add(`${x}-${y}`);
            }
        });
    });

    // 定义四个方向的移动向量：右、左、下、上

    // 判断是否可以在目标等待时间内完成任务的 BFS 函数
    const canFinishBfs = (targetWaitTime: number): boolean => {
        // 使用目标等待时间模拟火的蔓延
        const fireSet = new Set(ogFireSet); // 使用初始火元素集合的副本
        let steps = 0;
        let queue = startingFires; // 初始火元素队列，从初始位置开始蔓延

        // 每分钟移动火，最多到达目标等待时间
        while (queue.length && steps < targetWaitTime) {
            const next = [];
            for (const [x, y] of queue) {
                // 尝试四个方向的扩展
                for (const [moveX, moveY] of directions) {
                    const newX = x + moveX;
                    const newY = y + moveY;

                    const newVal = grid[newX]?.[newY];

                    // 如果是草地且未被标记为火，标记并加入队列
                    if (newVal === 0 && !fireSet.has(`${newX}-${newY}`)) {
                        next.push([newX, newY]);
                        fireSet.add(`${newX}-${newY}`);
                        Firemap[newX][newY] = steps + 1;
                    }
                }
            }

            steps++;
            queue = next;
        }

        // BFS 人物从起点到达终点
        const visited = new Set(['0-0']); // 记录访问过的坐标，避免重复访问
        let personQueue = [[0, 0]];
        let PeoplePath = [[0, 0]];
        while (personQueue.length) {
            const next = [];
            for (const [x, y] of personQueue) {
                // 如果到达终点，返回 true
                if (x === grid.length - 1 && y === grid[0].length - 1) {
                    return true;
                }

                // 如果当前位置已被火占据，跳过当前移动
                if (fireSet.has(`${x}-${y}`)) {
                    continue;
                }

                // 尝试四个方向的移动
                for (const [moveX, moveY] of directions) {
                    const newX = x + moveX;
                    const newY = y + moveY;

                    const newVal = grid[newX]?.[newY];

                    // 下一步只限于未访问过的草地，并且不受火的影响
                    if (newVal === 0 && !visited.has(`${newX}-${newY}`) && !fireSet.has(`${newX}-${newY}`)) {
                        next.push([newX, newY]);
                        visited.add(`${newX}-${newY}`);
                    }
                }
            }

            personQueue = next;

            // 在下一次玩家移动之前，如果有可能，每个火都扩散一步，只要还有剩余移动步骤
            if (personQueue.length) {
                const nextFire = [];
                for (const [fireX, fireY] of queue) {
                    // 尝试四个方向的火的扩散
                    for (const [moveX, moveY] of directions) {
                        const newX = fireX + moveX;
                        const newY = fireY + moveY;

                        const newVal = grid[newX]?.[newY];

                        // 如果是草地且未被标记为火，标记并加入队列
                        if (newVal === 0 && !fireSet.has(`${newX}-${newY}`)) {
                            nextFire.push([newX, newY]);
                            fireSet.add(`${newX}-${newY}`);
                        }
                    }
                }

                queue = nextFire;
            }
        }

        return false;
    }

    // 二分搜索初始化
    let lower = 0; // 最小等待时间
    let upper = Math.pow(10, 9); // 最大等待时间，题目描述给出的值
    let maxWaitTime = -1; // 最大可行等待时间，默认为无法完成任务

    // 二分搜索寻找最大可行等待时间
    while (lower <= upper) {
        const targetWaitTime = Math.floor((lower + upper) / 2); // 中间值作为待检查的等待时间

        if (canFinishBfs(targetWaitTime)) {
            // 如果能在目标等待时间内完成任务
            maxWaitTime = targetWaitTime; // 更新最大可行等待时间
            lower = targetWaitTime + 1; // 尝试寻找更大的等待时间
        } else {
            // 如果不能在目标等待时间内完成任务
            upper = targetWaitTime - 1; // 尝试寻找更小的等待时间
        }
    }

    return { maxWaitTime, Firemap }; // 返回最大可行等待时间
};