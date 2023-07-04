// 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为“Start” ）。
// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为“Finish”）。
// 现在考虑网格中有障碍物。那么从左上角到右下角将会有多少条不同的路径？
var uniquePathsWithObstacles = function(obstacleGrid) {
  const end1 = obstacleGrid.length,
    end2 = obstacleGrid[0].length;

  const dp = Array.from({ length: end1 }, (_) => Array(end2).fill(0));

  for (let i = 0; i < end1 && obstacleGrid[i][0] === 0; i++) {
    dp[i][0] = 1;
  }
  for (let j = 0; j < end2 && obstacleGrid[0][j] === 0; j++) {
    dp[0][j] = 1;
  }

  for (let i = 1; i < end1; i++) {
    for (let j = 1; j < end2; j++) {
      if (obstacleGrid[i][j] === 0) {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
    }
  }

  return dp[end1 - 1][end2 - 1];
};
console.log(
  uniquePathsWithObstacles([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ])
); // 2
// console.log(
//   uniquePathsWithObstacles([
//     [0, 1],
//     [0, 0],
//   ])
// ); // 1
// console.log(
//   uniquePathsWithObstacles([
//     [0, 0],
//     [0, 1],
//   ])
// ); // 0
// console.log(uniquePathsWithObstacles([[0, 1]])); // 0
// console.log(uniquePathsWithObstacles([[1, 0]])); // 0
// console.log(
//   uniquePathsWithObstacles([
//     [0, 1, 0, 0, 0],
//     [1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0],
//   ])
// ); // 0
