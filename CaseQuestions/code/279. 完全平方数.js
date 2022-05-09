/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
  const f = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    let min = Infinity;
    for (let j = 1; j * j <= i; j++) {
      min = Math.min(min, f[i - j * j]);
    }
    f[i] = min + 1;
  }

  return f[n]
};

console.log(numSquares(2)); // 3
// console.log(numSquares(13)); // 2 4+9
