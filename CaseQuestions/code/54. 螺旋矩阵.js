var spiralOrder = function(matrix) {
  const res = [];

  // 确定边界
  let top = 0,
    bottom = matrix.length - 1,
    left = 0,
    right = matrix[0].length - 1;

  while (top < bottom && left < right) {
    for (let i = left; i < right; i++) res.push(matrix[left][i]);
    for (let i = top; i < bottom; i++) res.push(matrix[i][right]);
    for (let i = right; i > left; i--) res.push(matrix[bottom][i]);
    for (let i = bottom; i > top; i--) res.push(matrix[i][left]);

    left++;
    right--;
    top++;
    bottom--;
  }

  console.log(top, bottom, left, right);

  if (top === bottom) {
    for (let i = left; i <= right; i++) res.push(matrix[left][i]);
  } else if (left === right) {
    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
  }

  return res;
};

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(spiralOrder(matrix));
