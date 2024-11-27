export function dfsFireEscape(grid, fireMap) {
    function isValidMove(x, y, grid, fireMap, currentTime) {
        const rows = grid.length;
        const cols = grid[0].length;
        if (x < 0 || y < 0 || x >= rows || y >= cols) return false;
        if (grid[x][y] === 2) return false;
        if (fireMap[x][y] !== -1 && fireMap[x][y] <= currentTime) return false;
        return true;
    }

    function dfs(grid, fireMap, x, y, currentTime, visited, path) {
        const rows = grid.length;
        const cols = grid[0].length;
        if (x === rows - 1 && y === cols - 1) {
            return path.slice(); // Return a copy of the path
        }

        // Define directions for moving in the grid: down, right, up, left
        const directions = [
            [1, 0], // down
            [0, 1], // right
            [-1, 0], // up
            [0, -1] // left
        ];

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValidMove(nx, ny, grid, fireMap, currentTime + 1) && !visited.has(`${nx},${ny}`)) {
                visited.add(`${nx},${ny}`);
                path.push([nx, ny]);
                const resultPath = dfs(grid, fireMap, nx, ny, currentTime + 1, visited, path);
                if (resultPath) {
                    return resultPath;
                }
                path.pop();
                visited.delete(`${nx},${ny}`);
            }
        }
        return path;
    }

    function findFastestRoute(grid, fireMap) {
        const start = [0, 0];
        if (!isValidMove(0, 0, grid, fireMap, 0)) {
            return null;
        }
        const visited = new Set([`${start[0]},${start[1]}`]);
        const path = [start];
        return dfs(grid, fireMap, 0, 0, 0, visited, path);
    }

    const path = findFastestRoute(grid, fireMap);
    return path

}

export function findMaxIn2DArray(arr) {
    let max = -Infinity;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] > max) {
                max = arr[i][j];
            }
        }
    }

    return max;
}