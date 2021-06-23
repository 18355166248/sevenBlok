// 给定一个 m x n 的矩阵，如果一个元素为 0 ，则将其所在行和列的所有元素都设为 0 。请使用 原地 算法。
// 进阶：
// 一个直观的解决方案是使用  O(mn) 的额外空间，但这并不是一个好的解决方案。
// 一个简单的改进方案是使用 O(m + n) 的额外空间，但这仍然不是最好的解决方案。
// 你能想出一个仅使用常量空间的解决方案吗？
var setZeroes = function(matrix) {
  const obj = {};
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 0 && !obj["" + i + j]) {
        let left = 0,
          top = 0;
        // 行为0
        while (left < matrix[0].length) {
          if (matrix[i][left++]) {
            matrix[i][left - 1] = 0;
            obj["" + i + left] = 1;
          }
        }
        // 列为0
        while (top < matrix.length) {
          if (matrix[top++][j]) {
            matrix[top - 1][j] = 0;
            obj["" + top + j] = 1;
          }
        }
      }
    }
  }
  return matrix;
};
console.log(
  setZeroes([
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ])
); // [[1,0,1],[0,0,0],[1,0,1]]
console.log(
  setZeroes([
    [0, 1, 2, 0],
    [3, 4, 5, 2],
    [1, 3, 1, 5],
  ])
); // [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
