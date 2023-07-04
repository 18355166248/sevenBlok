/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  if (prices.length === 1) return 0;

  const l = prices.length;
  const dp = Array.from({ length: l }, () => Array(3).fill(0));
  dp[0][0] = -prices[0];

  for (let i = 1; i < l; i++) {
    // f[i][0]: 手上持有股票的最大收益
    // f[i][1]: 手上不持有股票，并且处于冷冻期中的累计最大收益
    // f[i][2]: 手上不持有股票，并且不在冷冻期中的累计最大收益
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][2] - prices[i]);
    dp[i][1] = dp[i - 1][0] + prices[i];
    dp[i][2] = Math.max(dp[i - 1][1], dp[i - 1][2]);
  }

  return Math.max(dp[l - 1][1], dp[l - 1][2]);
};

console.log(maxProfit([1, 2, 3, 0, 2])); // 3
console.log(maxProfit([1])); // 0
