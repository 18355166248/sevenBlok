// 给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
// 说明：每次只能向下或者向右移动一步。
var minPathSum = function(grid) {
  const end1 = grid.length,
    end2 = grid[0].length;
  const dp = Array.from({ length: end1 }, (_) => Array(end2).fill(0));

  dp[0][0] = grid[0][0];

  for (let i = 1; i < end1; i++) {
    dp[i][0] = grid[i][0] + dp[i - 1][0];
  }
  for (let j = 1; j < end2; j++) {
    dp[0][j] = grid[0][j] + dp[0][j - 1];
  }

  for (let i = 1; i < end1; i++) {
    for (let j = 1; j < end2; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  return dp[end1 - 1][end2 - 1];
};
console.log(
  minPathSum([
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ])
); // 7
console.log(
  minPathSum([
    [1, 2, 3],
    [4, 5, 6],
  ])
); // 12
