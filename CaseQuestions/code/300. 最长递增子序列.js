/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
  let max = 1;
  const dp = new Array(nums.length).fill(0);

  dp[0] = 1;

  for (let i = 1; i < nums.length; i++) {
    dp[i] = 1;

    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }

    max = Math.max(max, dp[i]);
  }
  return max;
};

// console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
// console.log(lengthOfLIS([0, 1, 0, 3, 2, 3])); // 4
// console.log(lengthOfLIS([7, 7, 7, 7, 7, 7, 7])); // 1
// console.log(lengthOfLIS([1, 2, 1, 3, 0, 5])); // 4
console.log(lengthOfLIS([0])); // 1
