// 有一个 m × n 的矩形岛屿，与 太平洋 和 大西洋 相邻。 “太平洋” 处于大陆的左边界和上边界，而 “大西洋” 处于大陆的右边界和下边界。

// 这个岛被分割成一个由若干方形单元格组成的网格。给定一个 m x n 的整数矩阵 heights ， heights[r][c] 表示坐标 (r, c) 上单元格 高于海平面的高度 。

// 岛上雨水较多，如果相邻单元格的高度 小于或等于 当前单元格的高度，雨水可以直接向北、南、东、西流向相邻单元格。水可以从海洋附近的任何单元格流入海洋。

// 返回网格坐标 result 的 2D 列表 ，其中 result[i] = [ri, ci] 表示雨水从单元格 (ri, ci) 流动 既可流向太平洋也可流向大西洋 。

/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function(heights) {
  if (!heights || !heights[0]) return [];
  const m = heights.length; // 行
  const n = heights[0].length; // 列
  // 生成图
  const flow1 = Array.from({ length: m }, () => new Array(n).fill(false));
  const flow2 = Array.from({ length: m }, () => new Array(n).fill(false));

  function dfs(r, c, flow) {
    flow[r][c] = true;
    [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ].forEach(([nr, nc]) => {
      if (
        nr > 0 &&
        nc > 0 &&
        nr < m &&
        nc < n &&
        // 防止死循环
        flow[(nr, nc)] &&
        // 保证逆流而上
        heights[nr][nc] >= heights[r][c]
      ) {
        console.log(nr, nc);
        dfs(nr, nc, flow);
      }
    });
  }

  // 沿着海岸线逆流而上
  // 自上而下
  for (let i = 0; i < m; i++) {
    dfs(i, 0, flow1);
    dfs(i, n - 1, flow2);
  }
  // for (let i = 0; i < n; i++) {
  //   dfs(0, i, flow1);
  //   dfs(m - 1, i, flow2);
  // }
};

console.log(
  pacificAtlantic([
    [1, 2, 2, 3, 5],
    [3, 2, 3, 4, 4],
    [2, 4, 5, 3, 1],
    [6, 7, 1, 4, 5],
    [5, 1, 1, 2, 4],
  ])
); // [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
