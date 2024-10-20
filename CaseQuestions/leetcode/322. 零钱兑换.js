/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
  const dp = new Array(amount + 1).fill(0);

  for (let i = 1; i < amount + 1; i++) {
    let min = Infinity;

    for (let j = 0; j < coins.length; j++) {
      if (i - coins[j] >= 0) {
        min = Math.min(min, dp[i - coins[j]] + 1);
      }
    }
    dp[i] = min;
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
};

// 假设 dp(n) 代表要凑齐金额为 n 所要用的最少硬币数量，那么有：

// dp(n) = min(dp(n - c1), dp(n - c2), ... dp(n - cn)) + 1
// 其中 c1 ~ cn 为硬币的所有面额。

console.log(coinChange([1, 2, 5], 11)); // 5 + 5 + 1    3
console.log(coinChange([2], 3)); // -1
console.log(coinChange([1], 0)); // 0
