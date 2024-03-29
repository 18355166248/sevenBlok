/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
  const arr = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    let min = +Infinity;

    for (let j = 1; j * j <= i; j++) {
      min = Math.min(min, arr[i - j * j]);
    }

    arr[i] = min + 1;
  }

  return arr[n];
};

console.log(numSquares(2)); // 3
// console.log(numSquares(13)); // 2 4+9
