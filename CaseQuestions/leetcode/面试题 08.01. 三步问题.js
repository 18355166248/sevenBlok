// 三步问题。有个小孩正在上楼梯，楼梯有n阶台阶，小孩一次可以上1阶、2阶或3阶。实现一种方法，计算小孩有多少种上楼梯的方式。结果可能很大，你需要对结果模1000000007。

/**
 * @param {number} n
 * @return {number}
 */
var waysToStep = function(n) {
  const cache = new Map();

  return getNum(n);
  function getNum(n) {
    if (n <= 2) return n;
    if (n === 3) return 4;

    let f1 = cache.get(n - 1);
    let f2 = cache.get(n - 2);
    let f3 = cache.get(n - 3);

    if (!f1) {
      f1 = getNum(n - 1);
      cache.set(n - 1, f1);
    }
    if (!f2) {
      f2 = getNum(n - 2);
      cache.set(n - 2, f2);
    }
    if (!f3) {
      f3 = getNum(n - 3);
      cache.set(n - 3, f3);
    }

    return f1 + f2 + f3;
  }
};

var waysToStep2 = function(n) {
  let dp = [];
  dp[1] = 1;
  dp[2] = 2;
  dp[3] = 4;

  for (let i = 4; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3];
    dp[i] = dp[i] % 1000000007;
  }
  return dp[n];
};

console.log(waysToStep(1));
