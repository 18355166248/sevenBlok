// 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
// 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
  const map = new Map();
  function rec(n) {
    if (n < 2) return 1;
    const prev1 = n - 1;
    const prev2 = n - 2;
    let res1 = map.get(prev1);
    let res2 = map.get(prev2);

    if (!res1) {
      res1 = rec(prev1);
      map.set(prev1, res1);
    }
    if (!res2) {
      res2 = rec(prev2);
      map.set(prev2, res2);
    }

    return res1 + res2;
  }
  return rec(n);
};

// console.log(climbStairs(2)); // 2
// 解释：有两种方法可以爬到楼顶。
// 1. 1 阶 + 1 阶
// 2. 2 阶

// console.log(climbStairs(3)); // 3
// 解释：有三种方法可以爬到楼顶。
// 1. 1 阶 + 1 阶 + 1 阶
// 2. 1 阶 + 2 阶
// 3. 2 阶 + 1 阶

console.log(climbStairs(45)); // 3
