// 给你一个正整数 n ，生成一个包含 1 到 n2 所有元素，且元素按顺时针顺序螺旋排列的 n x n 正方形矩阵 matrix 。
var generateMatrix = function(n) {
  const matrix = Array.from({ length: n }, (_) => Array(n.length).fill());

  let left = 0,
    top = 0,
    right = n - 1,
    bottom = n - 1,
    num = 1;
  matrix[0][0] = 1;

  while (left < right && top < bottom) {
    for (let i = left; i < right; i++) matrix[top][i] = num++;
    for (let i = top; i < bottom; i++) matrix[i][right] = num++;
    for (let i = right; i > left; i--) matrix[bottom][i] = num++;
    for (let i = bottom; i > top; i--) matrix[i][left] = num++;

    left++;
    right--;
    top++;
    bottom--;
  }

  if (left === right) {
    for (let i = top; i <= bottom; i++) matrix[i][left] = num++;
  } else if (top === bottom) {
    for (let i = left; i <= right; i++) matrix[top][i] = num++;
  }
  return matrix;
};
console.log(generateMatrix(3));
