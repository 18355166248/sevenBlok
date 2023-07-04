// 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
// 问总共有多少条不同的路径？
var uniquePaths = function(m, n) {
  const matrix = Array.from({ length: m }, () => Array(n).fill(0))
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // i或者j为0表示只能往下或者右移动一格, 所有都是1
      if (i === 0 || j === 0) {
        matrix[i][j] = 1
      } else {
        matrix[i][j] = matrix[i - 1][j] + matrix[i][j - 1]
      }
      if (i === m - 1 && j === n - 1) return matrix[i][j]
    }
  }
}
console.log(uniquePaths(3, 2))
console.log(uniquePaths(3, 7))
console.log(uniquePaths(7, 3))
console.log(uniquePaths(3, 3))
console.log(uniquePaths(19, 13))
console.log(uniquePaths(1, 2))
