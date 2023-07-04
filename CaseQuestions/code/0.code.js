/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
  if (nums.length === 1) return nums[0];
  const dp = [0, nums[0]];
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i - 1], dp[i - 1]);
  }
  const dp1 = [0, 0];
  for (let i = 2; i <= nums.length; i++) {
    dp1[i] = Math.max(dp1[i - 2] + nums[i - 1], dp1[i - 1]);
  }
  return Math.max(dp1[nums.length], dp[nums.length - 1]);
};

console.log(rob([2, 3, 2])); // 3
console.log(rob([1, 2, 3, 1])); // 4
console.log(rob([2, 3, 2, 6, 7, 8])); // 17
